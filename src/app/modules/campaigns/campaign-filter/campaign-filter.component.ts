import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Dropdown } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    CAMPAIGN_FILTER_OPTIONS,
    COMPARE_OPTIONS,
} from 'src/app/core/consts/campaign-filter.const';
import { AdService } from 'src/app/core/models/ad-service.model';
import { Project } from 'src/app/core/models/project.model';
import { User } from 'src/app/core/models/user.model';
import { ProjectService } from 'src/app/core/services/project.service';
import { ReportService } from 'src/app/core/services/report.service';
import { AdServiceService } from 'src/app/core/services/service.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
    selector: 'app-campaign-filter',
    templateUrl: './campaign-filter.component.html',
    styleUrls: ['./campaign-filter.component.scss'],
})
export class CampaignFilterComponent extends BaseClass implements OnInit {
    @ViewChild('compare') compareDropdown: Dropdown;
    @ViewChild('btnSubmit') btnSubmit: HTMLButtonElement;
    @Input() filterUpdate;
    @Output() updated = new EventEmitter();
    campaignFilterOptions = CAMPAIGN_FILTER_OPTIONS.map((e) => {
        return {
            value: e.value ?? '',
            label: this.translate.instant(e.label),
            items: e.items?.map((x) => {
                return {
                    value: x.value,
                    label: this.translate.instant(x.label),
                };
            }),
        };
    });

    compareOptions = COMPARE_OPTIONS.map((e) => {
        return {
            value: e.value,
            label: this.translate.instant(e.label),
        };
    });

    isActiveOptions = [
        { value: true, label: this.translate.instant('Active') },
        { value: false, label: this.translate.instant('Deactive') },
    ];

    filterForm = {
        filterOption: '',
        compareOption: 0,
        value: null,
    };

    filterBinding = [];

    filter = new Object();

    employees: User[] = [];
    adServices: AdService[] = [];
    projects: Project[] = [];

    constructor(
        private translate: TranslateService,
        private reportService: ReportService,
        private UserService: UserService,
        private AdServiceService: AdServiceService,
        private ProjectService: ProjectService
    ) {
        super();
    }

    ngOnInit(): void {
        if (this.filterUpdate) {
            this.filterForm = {
                ...this.filterUpdate,
            };
        }
        this.reportService.filterBinding$
            .asObservable()
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.filterBinding = res;
                },
            });
        const getEmployees = this.UserService.getListUser({
            page: 1,
            limit: 9999,
        });
        const getServices = this.AdServiceService.getAllService({
            page: 1,
            limit: 9999,
        });
        const getProjects = this.ProjectService.getProjects({
            page: 1,
            limit: 9999,
        });
        forkJoin([getEmployees, getServices, getProjects])
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.employees = res[0].data.records.map((e: User) => {
                        return {
                            ...e,
                            fullname: e.lastName + ' ' + e.firstName,
                        };
                    });
                    this.adServices = res[1].data.records;
                    this.projects = res[2].data.records;
                },
            });
    }

    @HostListener('window:keydown.enter', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (this.btnSubmit.disabled) {
            event.preventDefault();
        }
        this.submitHandler();
    }

    changeFilterOption(e) {
        if (e.value === 'campaignServiceAmount') {
            this.filterForm.compareOption = 4;
            this.compareDropdown.disabled = true;
            return;
        }

        if (e.value === 'campaignServiceIsActive') {
            this.filterForm.compareOption = 1;
            this.compareDropdown.disabled = true;
            this.filterForm.value = true;
            return;
        }
        this.compareDropdown.show();
    }

    submitHandler() {
        if (this.btnSubmit.disabled) {
            return;
        }
        if (this.filterUpdate) {
            this.update();
            return;
        }
        if (!this.filterForm.compareOption || !this.filterForm.filterOption) {
            return;
        }

        this.filterBinding.push(this.filterForm);
        this.reportService.filterBinding$.next(this.filterBinding);

        this.filterForm = {
            filterOption: '',
            compareOption: 0,
            value: '',
        };

        this.filterChange();
    }

    filterChange() {
        if (this.filterBinding.length === 0) {
            this.reportService.campaignFilter$.next({});
        } else {
            this.filterBinding.forEach((e) => {
                const value = Array.isArray(e.value)
                    ? e.value.join(', ')
                    : e.value;
                if (e.filterOption !== 'campaignServiceIsActive') {
                    if (this.filter.hasOwnProperty(e.filterOption)) {
                        this.filter[e.filterOption] = {
                            compareId: e.compareOption,
                            value:
                                this.filter[e.filterOption].value + '&' + value,
                        };
                    } else {
                        this.filter[e.filterOption] = {
                            compareId: e.compareOption,
                            value: value,
                        };
                    }
                } else {
                    this.filter[e.filterOption] = value;
                }
            });

            const filter = {
                ...this.reportService.campaignFilter$.value,
                ...this.filter,
            };

            console.log(filter);

            this.reportService.campaignFilter$.next(filter);
        }

        if (this.filterUpdate) {
            this.updated.emit(true);
        }
    }

    update() {
        this.filterBinding.find(
            (e) => e.filterOption === this.filterUpdate.filterOption
        ).compareOption = this.filterForm.compareOption;
        this.filterBinding.find(
            (e) => e.filterOption === this.filterUpdate.filterOption
        ).value = this.filterForm.value;
        this.filterChange();
    }

    getFilterItem(e) {
        const option = this.campaignFilterOptions.find(
            (x) => x.value === e.filterOption
        );
        const compare = this.compareOptions.find(
            (x) => x.value === e.compareOption
        );
        return (
            option.label +
            ' ' +
            compare.label.toLowerCase() +
            " '" +
            e.value +
            "'"
        );
    }

    removeFilter(e) {
        const index = this.filterBinding.indexOf(e);
        this.filterBinding.splice(index, 1);
        // sessionStorage.setItem('campaignFilter', JSON.stringify(this.filterBinding));
        this.reportService.filterBinding$.next(this.filterBinding);
        this.filterChange();
    }

    disabledBtnSubmit(): boolean {
        if (this.filterForm.compareOption === 4) {
            if (
                !this.filterForm.compareOption ||
                !this.filterForm.filterOption
            ) {
                return true;
            } else {
                return false;
            }
        } else if(this.filterForm.filterOption === 'campaignServiceIsActive') {
            return false;
        } else if (
            !this.filterForm.compareOption ||
            !this.filterForm.filterOption ||
            !this.filterForm.value
        ) {
            return true;
        } else {
            return false;
        }
    }
}
