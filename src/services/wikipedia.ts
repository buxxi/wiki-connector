import config from "@/config";

const RANDOM_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit={count}&origin=*';
const POPULAR_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/{language}.wikipedia/all-access/{year}/{month}/{day}';
const LOOKUP_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&titles={titles}&format=json&redirects&origin=*';
const LINKS_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&generator=links&pageids={pageids}&gpllimit=max&format=json&redirects&origin=*';
const THUMBNAIL_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&pageids={pageids}&prop=pageimages&format=json&pithumbsize=250&pilicense=any&origin=*';
const MISSING_THUMBNAIL_URL = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/250px-Wikipedia-logo-v2.svg.png';

type WikipediaRandomResponse = {
	query: WikipediaRandomQuery;
}

type WikipediaRandomQuery = {
	random: WikipediaRandomEntry[];
}

type WikipediaRandomEntry = {
	id: number;
	title: string;
}



type WikipediaPopularResponse = {
	items: WikipediaPopularItem[];
}

type WikipediaPopularItem = {
	articles: WikipediaPopularArticle[];
}

type WikipediaPopularArticle = {
	article: string;
}



type WikipediaLookupResponse = {
	query: WikipediaLookupQuery;
}

type WikipediaLookupQuery = {
	pages: WikipediaLookupPages;
}

type WikipediaLookupPages = {
	[key: string]: WikipediaLookupPage;
}

type WikipediaLookupPage = {
	pageid: number;
	title: string;
}



type WikipediaLinksResponse = {
	continue: WikipediaLinksContinue;
	query: WikipediaLinksQuery;
}

type WikipediaLinksContinue = {
	gplcontinue: string;
	continue: string;
}

type WikipediaLinksQuery = {
	pages: WikipediaLinksPages;
}

type WikipediaLinksPages = {
	[key: string]: WikipediaLinksPage;
}

type WikipediaLinksPage = {
	pageid: number;
	title: string;
}



type WikipediaThumbnailResponse = {
	query: WikipediaThumbnailQuery;
}

type WikipediaThumbnailQuery = {
	pages: WikipediaThumbnailPages;
}

type WikipediaThumbnailPages = {
	[key: string]: WikipediaThumbnailPage;
}

type WikipediaThumbnailPage = {
	thumbnail: WikipediaThumbnail;
}

type WikipediaThumbnail = {
	source: string;
}

export type WikipediaArticle = {
	id: number;
	title: string;
}

class WikipediaService {
	language: string;

	constructor(language: string) {
		this.language = language;
	}

	async getRandom(): Promise<WikipediaArticle[]> {
		let url = RANDOM_URL
			.replace('{language}', this.language)
			.replace('{count}', "" + 500);
		let data: WikipediaRandomResponse = await this._fetchJson(url);
		return data.query.random.map(e => ({ id: e.id, title: e.title })).filter(e => this._filterPages(e));
	}

	async getPopular(): Promise<WikipediaArticle[]> {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		let year = new String(yesterday.getFullYear()).padStart(4, '0');
		let month = new String(yesterday.getMonth()).padStart(2, '0');
		let day = new String(yesterday.getDate()).padStart(2, '0');

		let url = POPULAR_URL
			.replace('{language}', this.language)
			.replace('{year}', "" + year)
			.replace('{month}', "" + month)
			.replace('{day}', "" + day);

		let data: WikipediaPopularResponse = await this._fetchJson(url);
		return this.getPages(data.items[0].articles.map(e => this._parseTitle(e.article)));
	}

	async getPages(titles: string[]): Promise<WikipediaArticle[]> {
		if (titles.length > 50) {
			let chunkPromises = [];
			for (var i = 0; i < titles.length; i = i + 50) {
				let chunkTitles = titles.slice(i, i + 50);
				chunkPromises.push(this.getPages(chunkTitles));
			}
			let chunkResult = await Promise.all(chunkPromises);
			return chunkResult.flatMap(e => e);
		}
		let url = LOOKUP_URL
			.replace('{language}', this.language)
			.replace('{titles}', titles.join("|"));
		let data: WikipediaLookupResponse = await this._fetchJson(url);
		return Object.values(data.query.pages).map(e => ({ id: e.pageid, title: e.title })).filter(e => this._filterPages(e));
	}

	async getAllLinks(pageid: number): Promise<WikipediaArticle[]> {
		let url = LINKS_URL
			.replace('{language}', this.language)
			.replace('{pageids}', "" + pageid);

		var cont = "";
		let result = [];

		do {
			let data: WikipediaLinksResponse = await this._fetchJson(url + cont);

			result.push(Object.values(data.query.pages).filter(e => e.pageid > 0));
			if (data.continue) {
				cont = `&gplcontinue=${data.continue.gplcontinue}&continue=${data.continue.continue}`;
			} else {
				cont = "";
			}
		} while (cont);
		return result.flatMap(e => e).map(e => ({ id: e.pageid, title: e.title })).filter(e => e.id != pageid && this._filterPages(e));
	}

	async getThumbnail(pageid: number): Promise<string> {
		let url = THUMBNAIL_URL
			.replace('{language}', this.language)
			.replace('{pageids}', "" + pageid);

		let data: WikipediaThumbnailResponse = await this._fetchJson(url);
		let pages = Object.values(data.query.pages);
		if (pages.length > 0 && pages[0].thumbnail) {
			return pages[0].thumbnail.source;
		} else {
			return MISSING_THUMBNAIL_URL;
		}
	}

	_parseTitle(title: string) {
		return title.replace(/_/g, " ");
	}

	_randomSelect(articles: string[], count: number): string[] {
		while (articles.length > count) {
			let random = Math.floor(Math.random() * articles.length);
			articles.splice(random, 1);
		}
		return articles;
	}

	_filterPages(article: WikipediaArticle): boolean {
		let page = article.title;
		if (config.blacklist.articles.includes(page)) {
			return false;
		}
		let m = /(.*?):.*/;
		let r = m.exec(page);
		if (r != null) {
			if (config.blacklist.prefix.includes(r[1])) {
				return false;
			} else {
				// nothing for now
			}
		}
		return true;
	}

	async _fetchJson<T>(url: string): Promise<T> {
		let response = await fetch(url, { cache: "force-cache" });
		let newData = await response.json();
		return newData;
	}
}

export default WikipediaService;