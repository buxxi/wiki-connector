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
    for (let pair of pairs(startArticles)) {
        let link = findLink(pair[0], pair[1]);
        if (!link) {
            console.log("No link for " + pair[0].id() + "-" + pair[1].id());
            return undefined;
        }
        links.set(pair[0].id() + "-" + pair[1].id(), link);
    }
    let permutationLinks = singleDirectionPermutations(startArticles);

    var result : (Article[] | undefined) = undefined;

    const permutationLink = function(perm: Article[]) : Article[] | undefined {
        let permLinkResult : Article[] = [];
        for (var i = 0; i < perm.length - 1; i++) {
            let id = perm[i].id() + "-" + perm[i + 1].id();
            if (links.has(id)) { // TODO: not needed after permutations don't return the reversed one
                permLinkResult = permLinkResult.concat(links.get(id));
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

    constructor(found: Article[], type: ResultType) {
        this.found = found;
        this.type = type;
    }

    static from(foundLinks: Article[]) : Result {
        foundLinks = _updateCorrectLinks(_updateBombLinks(foundLinks));
        let startingArticles = foundLinks.filter(article => article.state == ArticleState.START);
        let connectedToBomb = startingArticles.map(article => article.links.find(a => a.state == ArticleState.BOMB) != undefined).reduce((a, b) => a || b, false);
        if (connectedToBomb) {
            return new Result(foundLinks, ResultType.LOST);
        }

        let connectedCorrect = foundLinks.find(art => art.state == ArticleState.CORRECT) != undefined;
        if (connectedCorrect) {
            return new Result(foundLinks, ResultType.WON);
        } else {
            return new Result(foundLinks, ResultType.ONGOING);
        }
    }
}

export default Result;