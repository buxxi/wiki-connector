export type GraphNode<T> = {
	id(): NodeId;
	connections(): T[];
}

export type NodeId = Brand<number, "NodeId">

type Predicate<T> = (e: T) => boolean;

type Brand<K, T> = K & { __brand: T }


export function unique<T extends GraphNode<T>>(root: T, predicate: Predicate<T>): T[] {
	let checkIds: NodeId[] = [];
	let queue: T[] = [];
	let result: T[] = [];

	queue.push(root);

	while (queue.length > 0) {
		let elem = queue.shift()!;
		if (!checkIds.includes(elem.id())) {
			checkIds.push(elem.id());

			//TODO: this can probably be optimized to be skipped if predicate doesn't match, except for root
			for (let c of elem.connections()) {
				queue.push(c);
			}

			if (predicate(elem)) {
				result.push(elem);
			}
		}
	}

	return result;
}

export function linksTo<T extends GraphNode<T>>(root: T, childId: NodeId): T[] {
	return unique(root, parent => parent.connections().map(c => c.id()).includes(childId));
}

export function findByIds<T extends GraphNode<T>>(root: T, ids: NodeId[]): (T | undefined)[] {
	let cache = new Map();
	for (let item of unique(root, e => true)) {
		cache.set(item.id(), item);
	};
	return ids.map(id => {
		let found = cache.get(id);
		return found;
	});
}

export function findLink<T extends GraphNode<T>>(from: T, to: T): T[] | undefined {
	let checkIds: NodeId[] = [];
	let queue: T[][] = [];

	queue.push([from]);

	while (queue.length > 0) {
		let path = queue.shift()!;
		let [last] = path.slice(-1);
		if (!checkIds.includes(last!.id())) {
			if (last!.id() == to.id()) {
				return path;
			}

			checkIds.push(last!.id());

			for (let c of last!.connections()) {
				queue.push(path.concat([c]));
			}
		}
	}

	return undefined;
}