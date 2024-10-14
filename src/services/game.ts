import WikipediaService, { type WikipediaArticle } from "./wikipedia";
import { unique, findAll, findParents, findLink, type NodeId } from "../util/graph";
import Article, { ArticleState, toArticleId } from "../domain/article";
import Result, { ResultType } from "../domain/result";
import { levenshteinDistance } from "@/util/text";
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
    root: Article = new Article(ROOT_NAME, "", [], 0, ArticleState.ROOT);
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
        let titles = await this._loadStartingArticles(this.gameMode, startArticleCount + bombCount);
        let loadResults = await Promise.all(titles.map((title, index) => this._loadArticle(title.title, index < startArticleCount ? ArticleState.START : ArticleState.BOMB)));
        for (let loadResult of loadResults) {
            this.root.connect(loadResult.article);
            this._connect(loadResult.article, loadResult.links);
        }

        this.started = new Date();

        return this._generateResult();
    }

    async guess(title: string) : Promise<Result> {
        let loadArticleId = toArticleId(title);
        let fromArticles = findParents(this.root, loadArticleId);

        if (fromArticles.length == 0) {
            throw new Error("No matches for title: " + title);
        }

        let loadTitle = fromArticles.flatMap(art => art.links).find(art => art.id() == loadArticleId)!.title;
        let loadResult = await this._loadArticle(loadTitle, ArticleState.FOUND);

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
        let matchNodeId = toArticleId(title);
        let tolerance = Math.floor(matchNodeId.length / AUTOCOMPLETE_TOLERANCE_RATIO);

        let notFound = unique(this.root, a => a.autoCompletable());
        var matches = notFound.filter(a => levenshteinDistance(a.id(), matchNodeId) <= tolerance);
        matches = [...new Set(matches)];
        matches.sort((a, b) => levenshteinDistance(a.id(), matchNodeId) - levenshteinDistance(b.id(), matchNodeId));

        if (matches.length > AUTOCOMPLETE_SUGGESTIONS) {
            matches = matches.slice(0, AUTOCOMPLETE_SUGGESTIONS);
        }

        return matches.map(a => a.title);
    }

    async _loadArticle(title: string, state: ArticleState) : Promise<LoadResult> {
        let [thumbnail, links] = await Promise.all([this.wikipedia.getThumbnail(title), this.wikipedia.getAllLinks(title)]);

        let article = new Article(title, thumbnail, [], links.length, state);

        return { article: article, links : links };
    }

    _generateResult() : Result {
        let foundLinks = this._onlyFoundLinks();
        return Result.from(foundLinks, this.started, this.ended);
    }

    _onlyFoundLinks() : Article[] {
        let foundArticles = unique(this.root, a => a.found()).map(e => new Article(e.title, e.thumbnail, e.links, e.linkCount, e.state));

        for (var i = 0; i < foundArticles.length; i++) {
            let e = foundArticles[i];
            let links: (Article |undefined)[] = e.links.map(l => foundArticles.find(al => al.id() == l.id()));
            foundArticles[i].links = links.filter(e => e != undefined).map(e => e!); 
        } 

        return foundArticles;
    }

    _connect(fromArticle: Article, links: WikipediaArticle[]) : void {
        let toArticles : Article[] = findAll(this.root, links.map(link => toArticleId(link.title)))
            .map((link, i) => link != undefined ? link : new Article(links[i].title, "" , [], 0, ArticleState.NOT_FOUND));
        for (let toArticle of toArticles) {
            fromArticle.connect(toArticle);
        }
    }

    _loadStartingArticles(gameMode: GameMode, startArticleCount: number): Promise<WikipediaArticle[]> {
        switch(gameMode) {
            case GameMode.Curated:
                switch (this.wikipedia!.language) {
                    case "sv":
                        return this.wikipedia.getPages(config.curated.sv.slice(0)).then(list => this._random(list, startArticleCount));
                    case "en":
                        return this.wikipedia.getPages(config.curated.en.slice(0)).then(list => this._random(list, startArticleCount));
                }
            case GameMode.Random:
                return this.wikipedia.getRandom().then(list => this._random(list, startArticleCount));
            case GameMode.Popular:
                return this.wikipedia.getPopular().then(list => this._random(list, startArticleCount));
        }
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