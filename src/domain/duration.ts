export class Duration {
    started: Date;
    ended: Date | undefined;

    constructor(started: Date, ended: Date | undefined) {
        this.started = started;
        this.ended = ended;
    }

    seconds() : number {
        return Math.floor(((this.ended == undefined ? new Date() : this.ended).getTime() - this.started!.getTime()) / 1000);
    }
}