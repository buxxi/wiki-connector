import { pairs, singleDirectionPermutations } from "@/util/permutations";
import Article, { ArticleState } from "./article";
import { findLink } from "@/util/graph";

export enum ResultType {
    WON = "WON",
    LOST = "LOST",
    ONGOING = "ONGOING"
}

function _findCompleteSingleConnection(foundArticles: Article[]) : Article[] | undefined {
    let startArticles = foundArticles.filter(art => art.state == ArticleState.START);
    let links = new Map();

    const linkKey = function(list: Article[], index : number) {
        return list[index].id() + "-" + list[index + 1].id();
    }

    for (let pair of pairs(startArticles)) {
        let link = findLink(pair[0], pair[1]);
        if (!link) {
            return undefined;
        }
        links.set(linkKey(pair, 0), link);
    }

    let permutationLinks = singleDirectionPermutations(startArticles);

    var result : (Article[] | undefined) = undefined;

    const permutationLink = function(perm: Article[]) : Article[] | undefined {
        let permLinkResult : Article[] = [];
        for (var i = 0; i < perm.length - 1; i++) {
            let id = linkKey(perm, i);
            if (links.has(id)) {
                permLinkResult = permLinkResult.concat(links.get(id).slice(permLinkResult.length == 0 ? 0 : 1));
            } else {
                return undefined;
            }
        }

        if (permLinkResult.length == 0) {
            return undefined;
        }
        return permLinkResult;
    }


    for (let perm of permutationLinks) {
        let link = permutationLink(perm);
        if (result == undefined || (link != undefined && link.length < result.length)) {
            result = link;
        }
    }

    return result;
}

function _updateBombLinks(foundLinks: Article[]) : Article[] {
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
    return foundLinks;
}

function _updateCorrectLinks(foundLinks: Article[]) : Article[] {
    let singleConnection = _findCompleteSingleConnection(foundLinks); 
    if (singleConnection != undefined) {
        for (let article of singleConnection) {
            if (article.state == ArticleState.FOUND) {
                article.state = ArticleState.CORRECT;
            }
        }
    }
    return foundLinks;
}

class Result {
    found: Article[];
    type: ResultType;
    started: Date | undefined;
    ended: Date | undefined;

    constructor(found: Article[], type: ResultType, started: Date | undefined, ended: Date | undefined) {
        this.found = found;
        this.type = type;
        this.started = started;
        this.ended = ended;
    }

    titles(state: ArticleState) : string[] {
        return this.found.filter(art => art.state == state).map(art => art.title);
    }

    linkCount(): number {
        return this.found.map(n => n.linkCount).reduce((a, b) => a + b, 0);
    }

    shortest() : number | undefined {
        //TODO: should this handle one link being used 2 times as 1 or 2? currently 2
        let path = _findCompleteSingleConnection(this.found);
        return path != undefined ? path.length - 1 : undefined;
    }

    seconds() : number {
        return Math.floor(((this.ended == undefined ? new Date() : this.ended).getTime() - this.started!.getTime()) / 1000)
    }

    static from(foundLinks: Article[], started: Date | undefined, ended: Date | undefined) : Result {
        foundLinks = _updateCorrectLinks(_updateBombLinks(foundLinks));
        let startingArticles = foundLinks.filter(article => article.state == ArticleState.START);
        let connectedToBomb = startingArticles.map(article => article.links.find(a => a.state == ArticleState.BOMB) != undefined).reduce((a, b) => a || b, false);
        if (connectedToBomb) {
            return new Result(foundLinks, ResultType.LOST, started, ended);
        }

        let connectedCorrect = foundLinks.find(art => art.state == ArticleState.CORRECT) != undefined;
        if (connectedCorrect) {
            return new Result(foundLinks, ResultType.WON, started, ended);
        } else {
            return new Result(foundLinks, ResultType.ONGOING, started, ended);
        }
    }
}

export default Result;