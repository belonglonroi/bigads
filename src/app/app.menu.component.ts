import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { User } from './core/models/user.model';
import { UserService } from './core/services/user.service';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label | translate}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    currentUser: User;
    roleActions: number[];

    constructor(
        public appMain: AppMainComponent,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.userService._user$.subscribe({
            next: (user) => {
                this.currentUser = user;
                this.roleActions = user.userRole.roleActions.map(e => e.actionId);
            }
        });

        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Analysis', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/'] }
                ]
            },
            {
                label: 'Administrator',
                items: [
                    {
                        label: 'Department',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/department'],
                        show: this.roleActions.includes(1203)
                    },
                    {
                        label: 'Employees',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/employees'],
                        show: this.roleActions.includes(100)
                    },
                    {
                        label: 'Role',
                        icon: 'pi pi-fw pi-sliders-v',
                        routerLink: ['/permissions'],
                        show: this.roleActions.includes(800)
                    },
                    {
                        label: 'Service',
                        icon: 'pi pi-fw pi-server',
                        routerLink: ['/services'],
                        show: this.roleActions.includes(300)
                    },
                    {
                        label: 'Project',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/projects'],
                        show: this.roleActions.includes(400)
                    },
                    {
                        label: 'Category',
                        icon: 'pi pi-fw pi-database',
                        routerLink: ['/category'],
                        show: this.roleActions.includes(1303)
                    },
                    {
                        label: 'Code',
                        icon: 'pi pi-fw pi-code',
                        routerLink: ['/code'],
                        show: this.roleActions.includes(1303)
                    },
                ]
            },
            {
                label: 'Work',
                items: [
                    {
                        label: 'Campaign',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/campaigns'],
                        show: this.roleActions.includes(600) || this.roleActions.includes(601)
                    },
                    {
                        label: 'Campaign_services',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/campaign-services'],
                        show: this.roleActions.includes(600)
                    },
                ]
            },
            {
                label: 'Finance',
                items: [
                    {
                        label: 'Transaction',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['/transactions'],
                        show: this.roleActions.includes(1000)
                    },
                ]
            },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //             ]
            //         }
            //     ]
            // },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
