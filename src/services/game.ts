import WikipediaService, { type WikipediaArticle } from "./wikipedia";
import { unique, findByIds, linksTo, type NodeId } from "../util/graph";
import Article, { ArticleState } from "../domain/article";
import Result, { ResultType } from "../domain/result";
import { alphaNumericOnly } from "@/util/text";
import { WIKI_ARTICLES } from '@/config.ts';
import { getDifficultySetting, type Difficulty } from "@/domain/difficulty";
import Autocompleter from "@/util/autocomplete";
import { Clock } from "@/util/clock";
import { Duration } from "@/domain/duration";

export enum GameMode {
	Curated = "curated",
	Random = "random",
	Popular = "popular"
};

export type DurationCallback = (duration: Duration) => void;

export type ResultCallback = (result: Result) => void;

export type Language = "se" | "en";

type LoadResult = {
	article: Article;
	links: WikipediaArticle[];
}

const ROOT_NAME = "#ROOT";

class Game {
	wikipedia: WikipediaService;
	root: Article = new Article(-1, ROOT_NAME, "", [], 0, ArticleState.ROOT);
	difficulty: Difficulty;
	gameMode: GameMode;
	autoCompleter: Autocompleter;
	clock: Clock = new Clock();
	resultCallback: ResultCallback | undefined;

	constructor(language: Language, difficulty: Difficulty, gameMode: GameMode) {
		this.wikipedia = new WikipediaService(language);
		this.difficulty = difficulty;
		this.gameMode = gameMode;
		this.autoCompleter = new Autocompleter(this.root);
	}

	async start(): Promise<Result> {
		var attempts = 0;
		var result = new Result([], ResultType.LOST, new Duration(new Date(), new Date()));
		do {
			this.root.links = [];
			let startArticleCount = getDifficultySetting(this.difficulty).articles;
			let bombCount = getDifficultySetting(this.difficulty).bombs;
			let pages = await this._loadStartingArticles(this.gameMode, startArticleCount + bombCount);
			let loadResults = await Promise.all(pages.map((page, index) => this._loadArticle(page.id, page.title, index < startArticleCount ? ArticleState.START : ArticleState.BOMB)));
			for (let loadResult of loadResults) {
				this.root.connect(loadResult.article);
				this._connect(loadResult.article, loadResult.links);
			}

			result = this._generateResult();
		} while (result.anyLinks() && attempts++ < 10);

		this.clock.start();
		return result;
	}

	async guess(title: string): Promise<void> {
		let loadArticles = unique(this.root, e => e.searchValue() == alphaNumericOnly(title) && e.state == ArticleState.NOT_FOUND);
		if (loadArticles.length == 0) {
			throw new Error("No matches for title: " + title);
		}

		for (let loadArticle of loadArticles) {
			let fromArticles = loadArticle.links.concat(linksTo(this.root, loadArticle.id()));

			let loadResult = await this._loadArticle(loadArticle.id(), loadArticle.title, ArticleState.FOUND);

			//Connect the ones that linked to this new article
			for (let fromArticle of fromArticles) {
				fromArticle.connect(loadResult.article);
			}
			this._connect(loadResult.article, loadResult.links);
		}

		let result = this._generateResult();
		if ((result.type == ResultType.WON || result.type == ResultType.LOST) && this.clock.ended == undefined) {
			this.clock.stop();
		}

		this.autoCompleter.reset();

		if (this.resultCallback != undefined) {
			this.resultCallback(result);
		}
	}

	autoCompleteSuggestions(title: string): string[] {
		let matches = this.autoCompleter.autoCompleteSuggestions(title);

		return matches.map(a => a.title);
	}

	onTimeChange(callback: DurationCallback) {
		this.clock.setCallback((started, ended) => callback(new Duration(started, ended)));
	}

	onResultChange(callback: ResultCallback) {
		this.resultCallback = callback;
	}

	guessingEnabled() {
		return this.clock.ended == undefined;
	}

	async _loadArticle(id: number, title: string, state: ArticleState): Promise<LoadResult> {
		let [thumbnail, links] = await Promise.all([this.wikipedia.getThumbnail(id), this.wikipedia.getAllLinks(id)]);

		let article = new Article(id, title, thumbnail, [], links.length, state);

		return { article: article, links: links };
	}

	_generateResult(): Result {
		let foundLinks = this._onlyFoundLinks();
		return Result.from(foundLinks, this.clock.started, this.clock.ended);
	}

	_onlyFoundLinks(): Article[] {
		let foundArticles = unique(this.root, a => a.found()).map(e => new Article(e.id(), e.title, e.thumbnail, e.links, e.linkCount, e.state));

		for (var i = 0; i < foundArticles.length; i++) {
			let e = foundArticles[i];
			let links: (Article | undefined)[] = e.links.map(l => foundArticles.find(al => al.id() == l.id()));
			foundArticles[i].links = links.filter(e => e != undefined).map(e => e!);
		}

		return foundArticles;
	}

	_connect(fromArticle: Article, links: WikipediaArticle[]): void {
		let toArticles: Article[] = findByIds(this.root, links.map(link => link.id as NodeId))
			.map((link, i) => link != undefined ? link : new Article(links[i].id, links[i].title, "", [], 0, ArticleState.NOT_FOUND));
		for (let toArticle of toArticles) {
			fromArticle.connect(toArticle);
		}
	}

	async _loadStartingArticles(gameMode: GameMode, startArticleCount: number): Promise<WikipediaArticle[]> {
		var pages: WikipediaArticle[] = [];
		switch (gameMode) {
			case GameMode.Curated:
				switch (this.wikipedia!.language) {
					case "sv":
						pages = await this.wikipedia.getPages(WIKI_ARTICLES.curated.sv.slice(0));
						break;
					case "en":
						pages = await this.wikipedia.getPages(WIKI_ARTICLES.curated.en.slice(0));
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

	_random(input: WikipediaArticle[], count: number): WikipediaArticle[] {
		let result = [];
		while (result.length < count) {
			result.push(input.splice(Math.floor(Math.random() * input.length), 1)[0]);
		}
		return result;
	}
}

export default Game;