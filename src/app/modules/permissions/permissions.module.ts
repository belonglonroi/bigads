import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPermissionComponent } from './list-permission/list-permission.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { httpTranslateLoader } from 'src/assets/i18n/util';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DialogPermissionComponent } from './dialog-permission/dialog-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';

const permissionRoutes: Routes = [
    { path: '', component: ListPermissionComponent }
]

@NgModule({
    declarations: [
        ListPermissionComponent,
        DialogPermissionComponent
    ],
    imports: [
        PerfectScrollbarModule,
        CommonModule,
        RouterModule.forChild(permissionRoutes),
        ReactiveFormsModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ]
})
export class PermissionsModule { }
