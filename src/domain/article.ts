export enum ArticleState {
    ROOT = "ROOT",
    NOT_FOUND = "NOT_FOUND",
    START = "START",
    FOUND = "FOUND",
    BOMB = "BOMB"
}

class Article {
    title: string;
    thumbnail: string;
    links: Article[];
    linkCount: number;
    state: ArticleState;

    constructor(title: string, thumbnail: string, links: Article[], linkCount : number, state: ArticleState) {
        this.title = title;
        this.thumbnail = thumbnail;
        this.links = links;
        this.linkCount = linkCount;
        this.state = state;
    }

    id() : string {
        return this.title;
    }

    connections() : Article[] {
        return this.links;
    }

    found() : boolean {
        return this.state == ArticleState.FOUND || this.state == ArticleState.BOMB || this.state == ArticleState.START;
    }
}

export default Article;