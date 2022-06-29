import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/assets/i18n/util';
import { SharedModule } from 'src/app/shared/shared.module';

const authRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }
]

@NgModule({
    declarations: [
        LoginComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(authRoutes),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ]
})
export class AuthModule { }
