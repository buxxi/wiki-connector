type GraphNode<T> = {
    id() : string;
    connections() : T[];
}

type Predicate<T> = (e : T) => boolean;
type NotFoundHandler<T> = (e : string) => T;

export function unique<T extends GraphNode<T>>(root: T, predicate: Predicate<T>) : T[] {
    let checkIds: string[] = [];
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

export function findParents<T extends GraphNode<T>>(root: T, childId: string) : T[] {
    return unique(root, parent => parent.connections().map(c => c.id()).includes(childId));
}

export function findAll<T extends GraphNode<T>>(root: T, ids: string[], notFound : NotFoundHandler<T>) : T[] {
    let cache = new Map();
    for (let item of unique(root, e => true)) {
        cache.set(item.id(), item);
    };
    return ids.map(id => {
        let found = cache.get(id);
        return found != undefined ? found : notFound(id);
    });
}

export function findLink<T extends GraphNode<T>>(all: T[]) : T[] | undefined {
    let checkIds: string[] = [];
    let queue: T[][] = [];

    if (all.length != 2) {
        throw new Error("Only nodes supported for now");
    }

    let from = all[0];
    let to = all[1];

    queue.push([from]);
    
    while (queue.length > 0) {
        let path = queue.shift()!;
        let [last] = path.slice(-1);
        if (!checkIds.includes(last.id())) {
            if (last.id() == to.id()) {
                return path;
            }

            checkIds.push(last.id());

            for (let c of last.connections()) {
                queue.push(path.concat([c]));
            }
        }
    }

    return undefined;
}