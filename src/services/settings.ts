const SETTINGS_KEY = "settings";

type Settings = {
	animate: boolean;
}

class SettingsService {
	save(settings: Settings): void {
		this._save(settings);
	}

	read(): Settings {
		return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"animate": true}');
	}

	_save(settings: Settings) {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	}


}

export default SettingsService;