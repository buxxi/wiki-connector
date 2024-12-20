import type { NodeId } from "@/util/graph";
import { alphaNumericOnly, type AlphaNumeric } from "@/util/text";

export enum ArticleState {
	ROOT = "ROOT",
	NOT_FOUND = "NOT_FOUND",
	START = "START",
	FOUND = "FOUND",
	BOMB = "BOMB",
	CORRECT = "CORRECT"
}

function _connect(art1: Article, art2: Article) {
	let fromIndex = art1.links.findIndex(e => e.id() == art2.id());

	if (fromIndex == -1) {
		art1.links.push(art2);
	} else {
		art1.links[fromIndex] = art2;
	}
}


class Article {
	_id: number;
	title: string;
	thumbnail: string;
	links: Article[];
	linkCount: number;
	state: ArticleState;

	constructor(id: number, title: string, thumbnail: string, links: Article[], linkCount: number, state: ArticleState) {
		this._id = id;
		this.title = this._cleanTitle(title);
		this.thumbnail = thumbnail;
		this.links = links;
		this.linkCount = linkCount;
		this.state = state;
	}

	id(): NodeId {
		return this._id as NodeId;
	}

	searchValue(): AlphaNumeric {
		return alphaNumericOnly(this.title);
	}

	connections(): Article[] {
		return this.links;
	}

	found(): boolean {
		return this.state == ArticleState.FOUND || this.state == ArticleState.BOMB || this.state == ArticleState.START;
	}

	autoCompletable(): boolean {
		return this.state == ArticleState.NOT_FOUND;
	}

	connect(article: Article) {
		_connect(this, article);
		_connect(article, this);
	}

	_cleanTitle(input: string) {
		let m = /(.*) \(.*\)/.exec(input);
		if (m != undefined) {
			return m[1];
		}
		return input;
	}
}

export default Article;