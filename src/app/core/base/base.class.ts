import { Directive, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from '../consts/message.const';
@Directive()
export abstract class BaseClass implements OnDestroy {
    private destroyer$ = new Subject<any>();
    public limit = 30;
    public page = 1;
    public totalRecords = 0;
    protected unsubsribeOnDestroy = (source: Observable<any>): Observable<any> => {
        return source.pipe(
            takeUntil(this.destroyer$)
        );
    }

    ngOnDestroy(): void {
        this.destroyer$.next(null);
        this.destroyer$.complete();
    }
}
