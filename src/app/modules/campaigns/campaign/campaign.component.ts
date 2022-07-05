import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    CAMPAIGN_FILTER_OPTIONS,
    COMPARE_OPTIONS,
} from 'src/app/core/consts/campaign-filter.const';
import { CampaignAds } from 'src/app/core/models/campaign-ads.model';
import { CampaignFilter } from 'src/app/core/models/campaign-filter.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { Organization } from 'src/app/core/models/organization.model';
import { User } from 'src/app/core/models/user.model';
import { CampaignService } from 'src/app/core/services/campaign.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ReportService } from 'src/app/core/services/report.service';
import { TabProjectService } from 'src/app/core/services/tab-project.service';
import { UserService } from 'src/app/core/services/user.service';
import * as moment from 'moment';

@Component({
    selector: 'app-campaign',
    templateUrl: './campaign.component.html',
    styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent extends BaseClass implements OnInit {
    campaignFilterOptions = [].concat.apply(
        [],
        CAMPAIGN_FILTER_OPTIONS.map((e) => e.items)
    );

    compareOptions = COMPARE_OPTIONS.map((e) => {
        return {
            value: e.value,
            label: this.translate.instant(e.label),
        };
    });

    selectedOrganizations: Organization[] = [];
    selectedCustomers: User[] = [];
    selectedProjects: Campaign[] = [];
    selectedCampaignAds: CampaignAds[] = [];
    dateFilter: Date[] = [];
    campaignFilter: CampaignFilter = {};
    filterBinding = [];
    filter = new Object();
    activeIndex = 0;
    filterUpdate = undefined;
    actions: number[] = [];
    customerName: string = '';
    code: string = '';
    constructor(
        private reportService: ReportService,
        private translate: TranslateService,
        private customerService: CustomerService,
        private tabProjectService: TabProjectService,
        private route: ActivatedRoute,
        private userService: UserService,
        private campaignService: CampaignService
    ) {
        super();
    }

    ngOnInit(): void {
        this.actions = this.userService.action ?? [];

        this.route.queryParams
            .pipe(this.unsubsribeOnDestroy)
            .subscribe((params) => {
                if (params.hasOwnProperty('code')) {
                    this.code = params.code;
                    sessionStorage.setItem('code', this.code);
                    this.selectDate(5);
                }
            });

        this.reportService.filterBinding$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.filterBinding = res;
                },
            });

        this.reportService.campaignFilter$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.campaignFilter = {
                        ...res,
                        ...this.campaignFilter,
                    };
                },
            });

        this.reportService.selectedOrganization$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedOrganizations = res;
                },
            });

        this.reportService.selectedCustomers$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedCustomers = res;
                },
            });

        this.reportService.selectedProjects$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedProjects = res;
                },
            });

        this.reportService.selectedCampaignAds$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.selectedCampaignAds = res;
                },
            });

        this.activeIndex = this.campaignService.getTab;
    }

    selectedOrganizationsRemoved() {
        this.reportService.selectedOrganization$.next([]);
    }

    selectedCustomersRemoved() {
        this.reportService.selectedCustomers$.next([]);
        // const storageCustomerTable = JSON.parse(this.customerService.storageTable);
        // storageCustomerTable.selection = [];
        // localStorage.setItem('customerRp', JSON.stringify(storageCustomerTable));
    }

    selectedProjectsRemoved() {
        this.reportService.selectedProjects$.next([]);
        // const storageProjectTable = JSON.parse(this.tabProjectService.storageTable);
        // storageProjectTable.selection = [];
        // localStorage.setItem('projectRp', JSON.stringify(storageProjectTable));
    }

    selectedCampaignAdsRemoved() {
        this.reportService.selectedCampaignAds$.next([]);
        // const storageProjectTable = JSON.parse(this.tabProjectService.storageTable);
        // storageProjectTable.selection = [];
        // localStorage.setItem('campaignAdsRp', JSON.stringify(storageProjectTable));
    }

    selectDate(e: number) {
        let startDate = new Date(new Date().setHours(0, 0, 0, 0));
        let endDate = new Date(new Date().setHours(23, 59, 59, 0));
        switch (e) {
            case 1:
                this.dateFilter = [startDate, endDate];
                break;
            case 2:
                startDate = new Date(
                    new Date(
                        new Date().setDate(startDate.getDate() - 1)
                    ).setHours(0, 0, 0, 0)
                );
                endDate = new Date(
                    new Date(
                        new Date().setDate(endDate.getDate() - 1)
                    ).setHours(23, 59, 59, 0)
                );
                this.dateFilter = [startDate, endDate];
                break;
            case 3:
                startDate = new Date(
                    new Date(
                        new Date().setDate(startDate.getDate() - 6)
                    ).setHours(0, 0, 0, 0)
                );
                this.dateFilter = [startDate, endDate];
                break;
            case 4:
                startDate = new Date(
                    new Date(
                        new Date().setDate(startDate.getDate() - 29)
                    ).setHours(0, 0, 0, 0)
                );
                this.dateFilter = [startDate, endDate];
                break;
            case 5:
                startDate = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                );
                endDate = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                );
                this.dateFilter = [startDate, endDate];
                break;
            case 6:
                if (new Date().getMonth() == 0) {
                    startDate = new Date(new Date().getFullYear() - 1, 11, 1);
                    endDate = new Date(new Date().getFullYear() - 1, 11, 31);
                } else {
                    startDate = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() - 1,
                        1
                    );
                    endDate = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        0
                    );
                }
                this.dateFilter = [startDate, endDate];
                break;
            default:
                break;
        }

        // this.reportService.dateFilter$.next(this.dateFilter);
        // this.reportService.campaignFilter$.next(
        //     this.reportService.campaignFilter$.value
        // );
        this.campaignFilter.fromDate = moment(this.dateFilter[0]).format(
            'YYYY-MM-DD'
        );
        this.campaignFilter.toDate = moment(this.dateFilter[1]).format(
            'YYYY-MM-DD'
        );
        this.campaignFilter = { ...this.campaignFilter };
    }

    dateFilterChange(e: Date[]) {
        if (e.length === 2 && e[0] && e[1]) {
            this.reportService.dateFilter$.next(e);
            this.campaignFilter.fromDate = moment(e[0]).format('YYYY-MM-DD');
            this.campaignFilter.toDate = moment(e[1]).format('YYYY-MM-DD');
            this.campaignFilter = { ...this.campaignFilter };
        }
    }

    clearDate() {
        this.dateFilter = [];
        this.campaignFilter.fromDate = '';
        this.campaignFilter.toDate = '';
        this.campaignFilter = { ...this.campaignFilter };
    }

    getFilterItem(e) {
        const option = this.campaignFilterOptions.find(
            (x) => x.value === e.filterOption
        );
        const compare = this.compareOptions.find(
            (x) => x.value === e.compareOption
        );
        return (
            this.translate.instant(option.label) +
            ' ' +
            compare.label.toLowerCase() +
            (e.value === '' ? '' : ` '${e.value}'`)
        );
    }

    filterChange(removed?: string) {
        if (this.filterBinding.length === 0) {
            const filter = this.reportService.campaignFilter$.value;
            delete filter[removed];
            delete this.campaignFilter[removed]
            this.reportService.campaignFilter$.next(filter);
        } else {
            this.filterBinding.forEach((e) => {
                if (e.filterOption !== 'campaignServiceIsActive') {
                    this.filter[e.filterOption] = {
                        compareId: e.compareOption,
                        value: Array.isArray(e.value)
                            ? e.value.join(', ')
                            : e.value,
                    };
                } else {
                    this.filter[e.filterOption] = e.value;
                }
            });

            this.reportService.campaignFilter$.next(this.filter);
        }
    }

    removeFilter(e) {
        const index = this.filterBinding.indexOf(e);
        this.filterBinding.splice(index, 1);
        sessionStorage.setItem(
            'campaignFilter',
            JSON.stringify(this.filterBinding)
        );
        this.reportService.filterBinding$.next(this.filterBinding);
        this.filterChange(e.filterOption);
    }

    searchByCustomer(e: string) {
        this.campaignFilter.customerNameStr = e;
        this.campaignFilter = { ...this.campaignFilter };
    }

    receivedActiveIndex(e: number) {
        this.activeIndex = e;
    }

    isMobile() {
        return window.innerWidth < 600;
    }

    setCalendar() {
        if (this.isMobile()) {
            return 1;
        } else {
            return 2;
        }
    }
}
