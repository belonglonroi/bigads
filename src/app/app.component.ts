import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { MessageConfigService } from './service/message.config.service';
import { ConfigService } from './service/app.config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent {

    menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        public translate: TranslateService,
        private messageService: MessageService,
        private messageConfig: MessageConfigService,
        private appConfig: ConfigService,

    ) {
        translate.addLangs(['vi', 'en']);
        translate.setDefaultLang('vi');
        appConfig.updateConfig(appConfig.getConfig());
        // console.log(appConfig.getConfig());
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        this.messageConfig.messageConfig.asObservable()
            .subscribe(
                next => {
                    if (next) {
                        this.messageService.add(next)
                    }
                }
            );

        this.translateFunc('vi');
    }

    translateFunc(lang: string) {
        this.translate.use(lang);
        this.translate.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
    }
}
