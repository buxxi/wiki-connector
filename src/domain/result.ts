import Article from "./article";

export enum ResultType {
    WON = "WON",
    LOST = "LOST",
    ONGOING = "ONGOING"
}

class Result {
    found: Article[];
    type: ResultType;

    constructor(found: Article[], type: ResultType) {
        this.found = found;
        this.type = type;
    }
}

export default Result;