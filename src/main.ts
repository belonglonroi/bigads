import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

const theme = JSON.parse(localStorage.getItem('appConfig'))?.theme ?? 'saga-blue';
const themeElement = document.getElementById('theme-css');
themeElement.setAttribute('href', `assets/theme/${theme}/theme.css`);

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
