export function pairs<T>(input: T[]) : T[][] {
    let result = [];
    for (var i = 0; i < input.length - 1; i++) {
        for (var j = 1; j < input.length; j++) {
            result.push([input[i], input[j]]);
        }
    }
    return result;
}

export function singleDirectionPermutations<T>(input: T[]) : T[][] {
    let result : T[][] = [];

    const permute = (arr : T[], m : T[] = []) => {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(input);

    /* TODO: handle better that is not dependent on toString()
    for (var i = 0; i < result.length; i++) {
        let rev = result[i].slice().reverse();
        for (var j = 0; j < result.length; j++) {
            if (rev.toString() == result[j].toString()) {
                result.splice(j, 1);
            }
        }
    }
    */

    return result;
}