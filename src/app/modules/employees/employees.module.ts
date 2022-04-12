import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { SharedPrimeModule } from 'src/app/shared/primeng.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DialogCreateEmployeeComponent } from './dialog-create-employee/dialog-create-employee.component';
import { DialogPromoteRoleComponent } from './dialog-promote-role/dialog-promote-role.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { DialogProfileComponent } from './dialog-profile/dialog-profile.component';
import { DialogChangePasswordComponent } from './dialog-change-password/dialog-change-password.component';
import { SharedModule } from 'src/app/shared/shared.module';

const employeesRoutes: Routes = [
    { path: '', component: ListEmployeeComponent },
    { path: 'profile', component: ProfileComponent },
    // { path: 'profile/:id', component: ProfileComponent },
];

@NgModule({
    declarations: [
        ListEmployeeComponent,
        DialogCreateEmployeeComponent,
        DialogPromoteRoleComponent,
        ProfileComponent,
        DialogProfileComponent,
        DialogChangePasswordComponent,
    ],
    imports: [
        PerfectScrollbarModule,
        CommonModule,
        RouterModule.forChild(employeesRoutes),
        SharedPrimeModule,
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
export class EmployeesModule { }
