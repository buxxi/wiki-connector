import WikipediaService, { type WikipediaArticle } from "./wikipedia";
import { unique, findAll, find, linksTo } from "../util/graph";
import Article, { ArticleState, toArticleId } from "../domain/article";
import Result, { ResultType } from "../domain/result";
import { alphaNumericOnly, levenshteinDistance } from "@/util/text";
import config from '@/config.ts';
import { getDifficultySetting, type Difficulty } from "@/domain/difficulty";

export enum GameMode {
    Curated = "curated",
    Random = "random",
    Popular = "popular"
};

export type Language = "se" | "en";

type LoadResult = {
    article: Article;
    links: WikipediaArticle[];
}

const AUTOCOMPLETE_SUGGESTIONS = 3;
const AUTOCOMPLETE_TOLERANCE_RATIO = 3;
const ROOT_NAME = "#ROOT";

class Game {
    wikipedia: WikipediaService;
    root: Article = new Article(-1, ROOT_NAME, "", [], 0, ArticleState.ROOT);
    started: Date | undefined;
    ended: Date | undefined;
    difficulty: Difficulty;
    gameMode: GameMode;

    constructor(language: Language, difficulty: Difficulty, gameMode : GameMode) {
        this.wikipedia = new WikipediaService(language);
        this.difficulty = difficulty;
        this.gameMode = gameMode;
    }

    async start() : Promise<Result> {
        let startArticleCount = getDifficultySetting(this.difficulty).articles;
        let bombCount = getDifficultySetting(this.difficulty).bombs;
        let pages = await this._loadStartingArticles(this.gameMode, startArticleCount + bombCount);
        let loadResults = await Promise.all(pages.map((page, index) => this._loadArticle(page.id, page.title, index < startArticleCount ? ArticleState.START : ArticleState.BOMB)));
        for (let loadResult of loadResults) {
            this.root.connect(loadResult.article);
            this._connect(loadResult.article, loadResult.links);
        }

        this.started = new Date();

        return this._generateResult();
    }

    async guess(title: string) : Promise<Result> {
        let loadArticle = find(this.root, e => e.searchValue() == alphaNumericOnly(title));
        if (loadArticle == undefined) {
            throw new Error("No matches for title: " + title);
        }

        let fromArticles = loadArticle.links.concat(linksTo(this.root, loadArticle.id()));

        let loadResult = await this._loadArticle(loadArticle.id(), loadArticle.title, ArticleState.FOUND);

        //Connect the ones that linked to this new article
        for (let fromArticle of fromArticles) {
            fromArticle.connect(loadResult.article);
            this._connect(loadResult.article, loadResult.links);
        }

        let result = this._generateResult();
        if ((result.type == ResultType.WON || result.type == ResultType.LOST) && this.ended == undefined) {
            this.ended = new Date();
        }
        return result;
    }

    autoCompleteSuggestions(title: string) : string[] {
        let cleanedInputTitle = alphaNumericOnly(title);
        let tolerance = Math.floor(cleanedInputTitle.length / AUTOCOMPLETE_TOLERANCE_RATIO);

        let notFound = unique(this.root, a => a.autoCompletable());
        var matches = notFound.filter(a => levenshteinDistance(a.searchValue(), cleanedInputTitle) <= tolerance);
        matches = [...new Set(matches)];
        matches.sort((a, b) => levenshteinDistance(a.searchValue(), cleanedInputTitle) - levenshteinDistance(b.searchValue(), cleanedInputTitle));

        if (matches.length > AUTOCOMPLETE_SUGGESTIONS) {
            matches = matches.slice(0, AUTOCOMPLETE_SUGGESTIONS);
        }

        return matches.map(a => a.title);
    }

    async _loadArticle(id: number, title: string, state: ArticleState) : Promise<LoadResult> {
        let [thumbnail, links] = await Promise.all([this.wikipedia.getThumbnail(id), this.wikipedia.getAllLinks(id)]);

        let article = new Article(id, title, thumbnail, [], links.length, state);

        return { article: article, links : links };
    }

    _generateResult() : Result {
        let foundLinks = this._onlyFoundLinks();
        return Result.from(foundLinks, this.started, this.ended);
    }

    _onlyFoundLinks() : Article[] {
        let foundArticles = unique(this.root, a => a.found()).map(e => new Article(e.id(), e.title, e.thumbnail, e.links, e.linkCount, e.state));

        for (var i = 0; i < foundArticles.length; i++) {
            let e = foundArticles[i];
            let links: (Article |undefined)[] = e.links.map(l => foundArticles.find(al => al.id() == l.id()));
            foundArticles[i].links = links.filter(e => e != undefined).map(e => e!); 
        } 

        return foundArticles;
    }

    _connect(fromArticle: Article, links: WikipediaArticle[]) : void {
        let toArticles : Article[] = findAll(this.root, links.map(link => toArticleId(link.title)))
            .map((link, i) => link != undefined ? link : new Article(links[i].id, links[i].title, "" , [], 0, ArticleState.NOT_FOUND));
        for (let toArticle of toArticles) {
            fromArticle.connect(toArticle);
        }
    }

    async _loadStartingArticles(gameMode: GameMode, startArticleCount: number): Promise<WikipediaArticle[]> {
        var pages : WikipediaArticle[] = [];
        switch(gameMode) {
            case GameMode.Curated:
                switch (this.wikipedia!.language) {
                    case "sv":
                        pages = await this.wikipedia.getPages(config.curated.sv.slice(0));
                        break;
                    case "en":
                        pages = await this.wikipedia.getPages(config.curated.en.slice(0));
                        break;
                }
                break;
            case GameMode.Random:
                pages = await this.wikipedia.getRandom();
                break;
            case GameMode.Popular:
                pages = await this.wikipedia.getPopular();
                break;
        }
        return this._random(pages, startArticleCount);
    }

    _random(input: WikipediaArticle[], count: number) : WikipediaArticle[] {
        let result = [];
        while (result.length < count) {
            result.push(input.splice(Math.floor(Math.random() * input.length), 1)[0]);
        }
        return result;
    }
}

export default Game;