export function pairs<T>(input: T[]): T[][] {
	let result = [];
	for (var i = 0; i < input.length - 1; i++) {
		for (var j = 1; j < input.length; j++) {
			result.push([input[i], input[j]]);
		}
	}
	return result;
}

export type EqualityFunction<E> = (a: E, b: E) => boolean;

export function singleDirectionPermutations<T>(input: T[], eqFunc: EqualityFunction<T>): T[][] {
	let result: T[][] = [];

	const arrayEquals = (a: T[], b: T[]) => {
		if (a.length != b.length) {
			return false;
		}
		return a.every((val, i) => eqFunc(val, b[i]));
	}

	const reverseExists = (arr: T[]) => {
		return result.some(org => arrayEquals(org, arr.slice().reverse()));
	}

	const permute = (arr: T[], m: T[] = []) => {
		if (arr.length === 0) {
			if (!reverseExists(m)) {
				result.push(m);
			}
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next))
			}
		}
	}

	permute(input);

	return result;
}