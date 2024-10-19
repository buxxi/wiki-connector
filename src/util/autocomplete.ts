import type Article from "@/domain/article";
import { alphaNumericOnly, levenshteinDistance, type AlphaNumeric } from "./text";
import { unique } from "./graph";

const AUTOCOMPLETE_SUGGESTIONS = 3;
const AUTOCOMPLETE_TOLERANCE_RATIO = 3;

class Autocompleter {
    _cache = new Map<AlphaNumeric, Article>();
    _root : Article;

    constructor(root: Article) {
        this._root = root;
    }

    autoCompleteSuggestions(input: string) : Article[] {
        if (this._cache.size == 0) {
            this._populateCache();
        }

        let cleanedInputTitle = alphaNumericOnly(input);
        let tolerance = Math.floor(cleanedInputTitle.length / AUTOCOMPLETE_TOLERANCE_RATIO);

        var matches = Array.from(this._cache.entries()).filter(a => levenshteinDistance(a[0], cleanedInputTitle) <= tolerance);
        matches = [...new Set(matches)];
        matches.sort((a, b) => levenshteinDistance(a[0], cleanedInputTitle) - levenshteinDistance(b[0], cleanedInputTitle));

        if (matches.length > AUTOCOMPLETE_SUGGESTIONS) {
            matches = matches.slice(0, AUTOCOMPLETE_SUGGESTIONS);
        }

        return matches.map(a => a[1]);
    }

    _populateCache() {
        for (let article of unique(this._root, a => a.autoCompletable())) {
            this._cache.set(article.searchValue(), article);
        }
    }

    reset() {
        this._cache.clear();
    }
}

export default Autocompleter;