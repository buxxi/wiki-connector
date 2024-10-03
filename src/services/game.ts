import WikipediaService from "./wikipedia";
import { unique, findAll, findParents, findLink, type NodeId } from "../util/graph";
import Article, { ArticleState, toArticleId } from "../domain/article";
import Result from "../domain/result";
import { levenshteinDistance } from "@/util/text";
import config from '@/config.ts';

export enum GameMode {
    Curated = "curated",
    Random = "random",
    Popular = "popular"
};

export type Language = "se" | "en";

const AUTOCOMPLETE_SUGGESTIONS = 3;
const AUTOCOMPLETE_TOLERANCE_RATIO = 3;
const ROOT_NAME = "#ROOT";

class Game {
    wikipedia: WikipediaService | undefined;
    root: Article = new Article(ROOT_NAME, "", [], 0, ArticleState.ROOT);

    async start(language: Language, startArticleCount: number, bombCount: number, gameMode: GameMode) : Promise<Result> {
        this.wikipedia = new WikipediaService(language);
        let titles = await this._loadStartingArticles(gameMode, startArticleCount + bombCount);
        let articles = await Promise.all(titles.map((title, index) => this._loadArticle(title, index < startArticleCount ? ArticleState.START : ArticleState.BOMB)));
        for (let article of articles) {
            this.root.links.push(article);
        }

        return this._generateResult();
    }

    async guess(title: string) : Promise<Result> {
        let loadArticleId = toArticleId(title);
        let fromArticles = findParents(this.root, loadArticleId);

        if (fromArticles.length > 0) {
            let loadTitle = fromArticles.flatMap(art => art.links).find(art => art.id() == loadArticleId)!.title;
            let toArticle = await this._loadArticle(loadTitle, ArticleState.FOUND);

            //Connect the ones that linked to this new article
            for (let fromArticle of fromArticles) {
                let fromIndex = fromArticle.links.findIndex(e => e.id() == toArticle.id());
 
                if (fromIndex == -1) {
                    fromArticle.links.push(toArticle);
                } else {
                    fromArticle.links[fromIndex] = toArticle;
                }
            }
            //Connect links that the new article links to but possibly does link back
            for (let toArticleLink of toArticle.links.filter(link => link.found())) {
                let toIndex = toArticleLink.links.findIndex(e => e.id() == toArticle.id());
                if (toIndex == -1) {
                    toArticleLink.links.push(toArticle);
                } else {
                    toArticleLink.links[toIndex] = toArticle;
                }
            }
        }

        return this._generateResult();
    }

    autoCompleteSuggestions(title: string) : string[] {
        let matchNodeId = toArticleId(title);
        let tolerance = Math.floor(matchNodeId.length / AUTOCOMPLETE_TOLERANCE_RATIO);

        let notFound = unique(this.root, a => !a.found());
        var matches = notFound.filter(a => levenshteinDistance(a.id(), matchNodeId) <= tolerance);
        matches = [...new Set(matches)];
        matches.sort((a, b) => levenshteinDistance(a.id(), matchNodeId) - levenshteinDistance(b.id(), matchNodeId));

        if (matches.length > AUTOCOMPLETE_SUGGESTIONS) {
            matches = matches.slice(0, AUTOCOMPLETE_SUGGESTIONS);
        }

        return matches.map(a => a.title);
    }

    async _loadArticle(title: string, state: ArticleState) : Promise<Article> {
        if (this.wikipedia == undefined) {
            throw new Error("Game not started");
        }
        let [thumbnail, links] = await Promise.all([this.wikipedia.getThumbnail(title), this.wikipedia.getAllLinks(title)]);
        let connectedLinks : Article[] = findAll(this.root, links.map(link => toArticleId(link)))
            .map((link, i) => link != undefined ? link : new Article(links[i], "" , [], 0, ArticleState.NOT_FOUND));
        let article = new Article(title, thumbnail, connectedLinks, links.length, state);

        return article;
    }

    _generateResult() : Result {
        let foundLinks = this._onlyFoundLinks();
        return Result.from(foundLinks);
    }

    _onlyFoundLinks() : Article[] {
        let foundArticles = unique(this.root, a => a.found());
  
        for (var i = 0; i < foundArticles.length; i++) {
            let e = foundArticles[i];
            let links = e.links.map(l => foundArticles.find(al => al.id() == l.id())).filter(e => e != undefined);
            foundArticles[i] = new Article(e.title, e.thumbnail, links, e.linkCount, e.state);
        }

        return foundArticles;
    }

    _loadStartingArticles(gameMode: GameMode, startArticleCount: number): Promise<string[]> {
        switch(gameMode) {
            case GameMode.Curated:
                switch (this.wikipedia!.language) {
                    case "sv":
                        return Promise.resolve(config.curated.sv.slice(0, startArticleCount));
                    case "en":
                        return Promise.resolve(config.curated.en.slice(0, startArticleCount));
                }
            case GameMode.Random:
                return this.wikipedia!.getRandom(startArticleCount);
            case GameMode.Popular:
                return this.wikipedia!.getPopular(startArticleCount);
        }
    }
}

export default Game;