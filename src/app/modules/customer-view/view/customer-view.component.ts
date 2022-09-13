import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { CampaignAds } from 'src/app/core/models/campaign-ads.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer-view.component.scss'],
})
export class CustomerViewComponent extends BaseClass implements OnInit {
    fetchingData: boolean = true;
    projectsData = [];
    campaignsData = [];
    statistical: any = {};
    total = {
        projects: 0,
        campaigns: 0,
        activeCampaigns: 0,
    };
    dateFilter: Date[] = [];
    constructor(private reportService: ReportService) {
        super();
    }

    ngOnInit(): void {
        this.selectDate(5);
    }

    getDataCustomer() {
        this.fetchingData = true;
        const getProjects = this.reportService.getProjects({});
        const getCampaignAds = this.reportService.getCampaignAds({});

        forkJoin([getProjects, getCampaignAds])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (
                    res: [
                        ApiPagingResult<Campaign[]>,
                        ApiPagingResult<CampaignAds[]>
                    ]
                ) => {
                    this.projectsData = res[0].data.records;
                    this.campaignsData = res[1].data.records;
                    this.statistical = {
                        ...res[0].data.statistical,
                        ...res[1].data.statistical,
                    };
                    this.total = {
                        projects: res[0].data.total,
                        campaigns: res[1].data.total,
                        activeCampaigns: this.campaignsData.filter(
                            (e: CampaignAds) => e.isActive
                        ).length,
                    };
                    console.log(this.statistical);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                    this.fetchingData = false;
                },
            });
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

        this.getDataCustomer();
    }

    dateFilterChange(e: Date[]) {
        if (e.length === 2 && e[0] && e[1]) {
            this.getDataCustomer();
        }
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

    clearDate() {
        this.dateFilter = [];
        this.getDataCustomer();
    }
}
