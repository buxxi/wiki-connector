export type ClockCallback = (started: Date, ended: (Date | undefined)) => void;

const ROOT_NAME = "#ROOT";

export class Clock {
	started: Date;
	ended: Date | undefined;
	_callback: ClockCallback | undefined;
	_interval: any;

	constructor() {
		this.started = new Date();
	}

	start() {
		this.started = new Date();
		this._interval = setInterval(() => {
			if (this._callback != undefined) {
				this._callback(this.started, this.ended);
			}
		}, 1000);
	}

	stop() {
		this.ended = new Date();
		clearInterval(this._interval);
	}

	setCallback(callback: ClockCallback) {
		this._callback = callback;
	}
}