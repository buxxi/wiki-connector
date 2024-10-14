//copied from and modified: https://gist.github.com/andrei-m/982927
export function levenshteinDistance(a: AlphaNumeric, b: AlphaNumeric) {
    if(a.length == 0 || b.length == 0) {
        return (a || b).length;
    }
    var m = [];
    for(var i = 0; i <= b.length; i++){
        m[i] = [i];
        if(i === 0) {
            continue;
        }
        for(var j = 0; j <= a.length; j++){
            m[0][j] = j;
            if(j === 0) {
                continue;
            }
            m[i][j] = b[i - 1] == a[j - 1] ? m[i - 1][j - 1] : Math.min(
                m[i-1][j-1] + 1,
                m[i][j-1] + 1,
                m[i-1][j] + 1
            );
        }
    }
    return m[b.length][a.length];
}

export type AlphaNumeric = Brand<string, "AlphaNumeric">

type Brand<K, T> = K & { __brand: T }

export function alphaNumericOnly(input: string) : AlphaNumeric {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '') as AlphaNumeric;
}