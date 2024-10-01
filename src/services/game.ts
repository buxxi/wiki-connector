import WikipediaService from "./wikipedia";
import { unique, findAll, findParents, findLink, type NodeId } from "../util/graph";
import Article, { ArticleState, toArticleId } from "../domain/article";
import Result, { ResultType } from "../domain/result";
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

            this._updateBombLinks();
            this._updateCorrectLinks();
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

    _updateBombLinks() : void {
        let foundLinks = unique(this.root, a => a.found());
        var changes = false;
        do {
            changes = false;
            for (let bomb of foundLinks.filter(a => a.state == ArticleState.BOMB)) {
                for (let link of bomb.links.filter(a => a.state == ArticleState.FOUND)) {
                    link.state = ArticleState.BOMB;
                    changes = true;
                }
            }
        } while (changes);
    }

    _updateCorrectLinks() : void {
        let start = this.root.links.filter(art => art.state == ArticleState.START);
        let link = findLink(start);
        console.log(link);
        if (link != undefined) {
            for (let art of link) {
                if (art.state == ArticleState.FOUND) {
                    art.state = ArticleState.CORRECT;
                }
            }
        }
    }

    _generateResult() : Result {
        let foundLinks = this._onlyFoundLinks();
        let startingArticles = foundLinks.filter(article => article.state == ArticleState.START);
        let connectedToBomb = startingArticles.map(article => article.links.find(a => a.state == ArticleState.BOMB) != undefined).reduce((a, b) => a || b, false);
        if (connectedToBomb) {
            return new Result(foundLinks, ResultType.LOST);
        }

        let singleConnection = this._findCompleteSingleConnection(foundLinks);
        if (singleConnection == undefined) {
            return new Result(foundLinks, ResultType.ONGOING);
        } else {
            return new Result(singleConnection, ResultType.WON);
        }
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

    _findCompleteSingleConnection(foundArticles: Article[]) : Article[] | undefined {

        //TODO: implement me again, previous attempt was way too slow
        return undefined;
    }

    _loadStartingArticles(gameMode: GameMode, startArticleCount: number): Promise<string[]> {
        switch(gameMode) {
            case GameMode.Curated:
                return Promise.resolve(config.curated);
            case GameMode.Random:
                return this.wikipedia!.getRandom(startArticleCount);
            case GameMode.Popular:
                return this.wikipedia!.getPopular(startArticleCount);
        }
    }
}

export default Game;