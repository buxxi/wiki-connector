import './assets/main.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import en from './translations/en';
import sv from './translations/sv';

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	messages: {
		en: en,
		sv: sv
	}
});

let appInstance = createApp(App);
appInstance.use(i18n);
appInstance.mount('#app')
