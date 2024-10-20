import type { Difficulty } from "@/domain/difficulty";

export type HistoryEntry = {
	date: Date;
	won: boolean;
	difficulty: Difficulty;
	seconds: number;
	bombs: number;
	shortest: number | undefined;
}

const HISTORY_KEY = "history";

class HistoryService {
	add(entry: HistoryEntry): void {
		let entries = this.read();
		entries.push(entry);
		this._save(entries);
	}

	read(): HistoryEntry[] {
		let entries = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
			.map((e: any) => {
				return {
					date: new Date(Date.parse(e.date)),
					won: e.won,
					difficulty: e.difficulty,
					seconds: e.seconds,
					bombs: e.bombs,
					shortest: e.shortest
				}
			});
		return entries.slice();
	}

	_save(entries: HistoryEntry[]) {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
	}


}

export default HistoryService;