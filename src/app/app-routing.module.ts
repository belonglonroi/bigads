import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppMainComponent } from './app.main.component';
import { AuthGuard } from './core/guards/auth.guard';
import { InitialDataResolver } from './app.resolve';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
            { path: 'customer-view', loadChildren: () => import('./modules/campaigns/campaign.module').then(m => m.CampaignModule) },
            {
                path: '', component: AppMainComponent,
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                resolve: {
                    initialData: InitialDataResolver,
                },
                children: [
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'employees', loadChildren: () => import('./modules/employees/employees.module').then(m => m.EmployeesModule) },
                    { path: 'permissions', loadChildren: () => import('./modules/permissions/permissions.module').then(m => m.PermissionsModule) },
                    { path: 'projects', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) },
                    { path: 'services', loadChildren: () => import('./modules/services/service.module').then(m => m.ServiceModule) },
                    { path: 'transactions', loadChildren: () => import('./modules/transactions/transactions.module').then(m => m.TransactionsModule) },
                    { path: 'campaigns', loadChildren: () => import('./modules/campaigns/campaign.module').then(m => m.CampaignModule) },
                    { path: 'campaign-services', loadChildren: () => import('./modules/campaign-services/campaign-ad.module').then(m => m.CampaignServicesModule) },
                    { path: 'department', loadChildren: () => import('./modules/department/department.module').then(m => m.DepartmentModule) },
                    { path: 'category', loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule) },
                    { path: 'code', loadChildren: () => import('./modules/code/code.module').then(m => m.CodeModule) },
                ],
            },
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
