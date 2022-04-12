import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../core/models/app-config.model';

@Injectable()
export class ConfigService {

    config: AppConfig = {
        theme: 'lara-light-indigo',
        dark: false,
        inputStyle: 'outlined',
        ripple: true
    };

    private configUpdate = new Subject<AppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: AppConfig) {
        this.config = config;
        this.configUpdate.next(config);
        localStorage.setItem('appConfig', JSON.stringify(this.config));
    }

    getConfig() {
        return JSON.parse(localStorage.getItem('appConfig'));
    }
}
