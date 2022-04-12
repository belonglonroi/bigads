import { AuthService } from './core/auth/auth.service';
import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    constructor(
        public appMain: AppMainComponent,
        private authService: AuthService,
        private router: Router
    ) { }

    logOut() {
        this.authService.logout().subscribe();
        this.router.navigateByUrl('/auth')
    }
}
