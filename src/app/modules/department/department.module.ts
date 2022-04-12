import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDepartmentComponent } from './list-department/list-department.component';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPrimeModule } from 'src/app/shared/primeng.module';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { DialogDepartmentComponent } from './dialog-department/dialog-department.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogAddEmployeeComponent } from './dialog-add-employee/dialog-add-employee.component';

const departmentRoutes: Routes = [
    { path: '', component: ListDepartmentComponent },
]

@NgModule({
    declarations: [
        ListDepartmentComponent,
        DialogDepartmentComponent,
        DialogAddEmployeeComponent,
    ],
    imports: [
        CommonModule,
        PerfectScrollbarModule,
        RouterModule.forChild(departmentRoutes),
        SharedPrimeModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })],
})
export class DepartmentModule { }
