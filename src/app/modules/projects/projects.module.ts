import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { httpTranslateLoader } from 'src/assets/i18n/util';
import { ListProjectComponent } from './list-project/list-project.component';
import { DialogProjectComponent } from './dialog-project/dialog-project.component';
import { SharedModule } from 'src/app/shared/shared.module';

const projectRoutes: Routes = [
    { path: '', component: ListProjectComponent }
]

@NgModule({
    declarations: [
        ListProjectComponent,
        DialogProjectComponent
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(projectRoutes),
        SharedModule,
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
export class ProjectsModule { }
