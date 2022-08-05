import { AuthService } from './core/auth/auth.service';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from './core/services/user.service';
import { User } from './core/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { SplitButton } from 'primeng/splitbutton';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit, AfterViewInit {
    @ViewChild('splitbutton') btnUser: SplitButton;
    items: MenuItem[];
    user: User;
    constructor(
        public appMain: AppMainComponent,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private translate: TranslateService
    ) {
        this.user = userService.user.value;
    }

    ngOnInit(): void {
        this.items = [
            {
                label: this.translate.instant('Profile'),
                icon: 'pi pi-user',
                command: () => {
                    this.router.navigateByUrl('/employees/profile');
                },
            },
            // {
            //     label: 'Angular.io',
            //     icon: 'pi pi-info',
            //     url: 'http://angular.io',
            // },
            { separator: true },
            {
                label: this.translate.instant('Sign_out'),
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logOut();
                },
            },
        ];
    }

    ngAfterViewInit(): void {

    }

    btnUserClick() {
        this.btnUser.onDropdownButtonClick(null);
    }

    logOut() {
        this.authService.logout().subscribe();
        this.router.navigateByUrl('/auth');
    }
}
