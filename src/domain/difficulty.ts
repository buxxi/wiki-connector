export enum Difficulty {
    EASIEST = 0,
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
    HARDEST = 4
  }
  
export class DifficultySetting {
    smiley: string;
    articles: number;
    bombs: number;

    constructor(smiley : string, articles : number, bombs : number) {
        this.smiley = smiley;
        this.articles = articles;
        this.bombs = bombs;
    }
}

export function getDifficultySetting(input: Difficulty) : DifficultySetting {
    switch (input) {
        case Difficulty.EASIEST:
        return new DifficultySetting("😁", 2, 0);
        case Difficulty.EASY:
        return new DifficultySetting("🙂", 2, 1);
        case Difficulty.MEDIUM:
        return new DifficultySetting("🥴", 3, 2);
        case Difficulty.HARD:
        return new DifficultySetting("🥵", 3, 3);
        case Difficulty.HARDEST:
        return new DifficultySetting("🤬", 4, 4);
    }
}