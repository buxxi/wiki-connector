import config from "@/config";

const RANDOM_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit={count}&origin=*';
const POPULAR_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/{language}.wikipedia/all-access/{year}/{month}/{day}';
const LINKS_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&titles={title}&prop=links&pllimit=max&format=json&origin=*';
const THUMBNAIL_URL = 'https://{language}.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=250&pilicense=any&origin=*';
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



type WikipediaLinksResponse = {
    continue : WikipediaLinksContinue;
    query: WikipediaLinksQuery;
}

type WikipediaLinksContinue = {
    plcontinue: string;
    continue: string;
}

type WikipediaLinksQuery = {
    pages: WikipediaLinksPages;
}

type WikipediaLinksPages = {
    [key: string] : WikipediaLinksPage;
}

type WikipediaLinksPage = {
    links : WikipediaLinksLink[];
}

type WikipediaLinksLink = {
    title : string;
}



type WikipediaThumbnailResponse = {
    query: WikipediaThumbnailQuery;
}

type WikipediaThumbnailQuery = {
    pages: WikipediaThumbnailPages;
}

type WikipediaThumbnailPages = {
    [key: string] : WikipediaThumbnailPage;
}

type WikipediaThumbnailPage = {
    thumbnail : WikipediaThumbnail;
}

type WikipediaThumbnail = {
    source : string;
}

class WikipediaService {
    language: string;

    constructor(language: string) {
        this.language = language;
    }

    async getRandom(count: number) : Promise<string[]> {
        let url = RANDOM_URL
            .replace('{language}', this.language)
            .replace('{count}', "" + count);
        let data : WikipediaRandomResponse = await this._fetchJson(url);
        return data.query.random.map(e => e.title).filter(e => this._filterPages(e));
    }

    async getPopular(count: number) : Promise<string[]> {
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
            
        let data : WikipediaPopularResponse = await this._fetchJson(url);
        let articles = data.items[0].articles.filter(e => this._filterPages(e.article)).map(e => this._parseTitle(e.article));
        return this._randomSelect(articles, count);
    }

    //TODO: follow redirects
    async getAllLinks(title: string) : Promise<string[]> {
        let url = LINKS_URL
            .replace('{language}', this.language)
            .replace('{title}', title);

        var cont = "";            
        let result = [];

        do {
            let data : WikipediaLinksResponse = await this._fetchJson(url + cont);
            
            result.push(Object.values(data.query.pages)[0].links.map(e => e.title));
            if (data.continue) {
                cont = `&plcontinue=${data.continue.plcontinue}&continue=${data.continue.continue}`;
            } else {
                cont = "";
            }
        } while (cont);
        return result.flatMap(e => e).filter(e => this._filterPages(e));
    }

    //TODO: follow redirects
    async getThumbnail(title: string) : Promise<string> {
        let url = THUMBNAIL_URL
            .replace('{language}', this.language)
            .replace('{title}', title);

        let data : WikipediaThumbnailResponse = await this._fetchJson(url);
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

    _filterPages(page: string): boolean {
        if (config.blacklist.articles.includes(page)) {
            return false;
        }
        let m = /(.*?):.*/;
        let r = m.exec(page);
        if (r != null) {
            //TODO: read from config
            if (config.blacklist.prefix.includes(r[1])) {
                return false;
            } else {
                // nothing for now
            }
        }
        return true;
    }

    async _fetchJson<T>(url: string) : Promise<T> {
        let data = localStorage.getItem(url);
        if (data != undefined) {
            return JSON.parse(data);
        }

        let response = await fetch(url);
        let newData = await response.json();
        localStorage.setItem(url, JSON.stringify(newData));
        return newData;
    }
}

export default WikipediaService;