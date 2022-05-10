import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCodeComponent } from './list-code/list-code.component';
import { GenCodeComponent } from './gen-code/gen-code.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { SharedModule } from 'src/app/shared/shared.module';
import {ClipboardModule} from '@angular/cdk/clipboard';

const codeRoutes: Routes = [
    { path: '', component: ListCodeComponent },
]

@NgModule({
    declarations: [
        ListCodeComponent,
        GenCodeComponent
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(codeRoutes),
        SharedModule,
        ClipboardModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ]
})
export class CodeModule { }
