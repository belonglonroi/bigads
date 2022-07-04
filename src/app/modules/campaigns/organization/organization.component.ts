import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    MESSAGE_TYPE,
    MESSAGE_SUMARY,
} from 'src/app/core/consts/message.const';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Organization } from 'src/app/core/models/organization.model';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { ReportService } from 'src/app/core/services/report.service';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';
import { DialogOrganizationComponent } from '../dialog-organization/dialog-organization.component';
import { DialogUserOrganizationComponent } from '../dialog-user-organization/dialog-user-organization.component';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss'],
    providers: [DialogService],
})
export class OrganizationComponent
    extends BaseClass
    implements OnInit, OnChanges
{
    @Input() organizationsInput: Organization[];
    @Output() tabIndex = new EventEmitter<number>();
    organizations: Organization[] = [];
    fetchingData: boolean = false;
    selectedOrganizations: Organization[] = [];
    actions: number[] = [];
    code: string = '';
    selectedAll: boolean = false;
    constructor(
        private organizationService: OrganizationService,
        private translate: TranslateService,
        private messageConfig: MessageConfigService,
        private dialog: DialogService,
        private reportService: ReportService,
        private userService: UserService
    ) {
        super();
        this.code = reportService.code;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('organizationsInput' in changes) {
            this.selectedOrganizations =
                changes.organizationsInput.currentValue;
        }
    }

    ngOnInit(): void {
        this.actions = this.userService.action ?? [];
        this.getOrganization();
    }

    getOrganization() {
        this.fetchingData = true;
        this.organizationService
            .getOrganizations({ limit: 9999, page: 1 })
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Organization[]>) => {
                    this.fetchingData = false;
                    this.organizations = res.data.records.map((e) => {
                        return {
                            ...e,
                            quantity: e.users.length,
                        };
                    });
                    this.totalRecords = res.data.total;
                },
            });
    }

    selectionChange() {
        this.reportService.selectedOrganization$.next(
            this.selectedOrganizations
        );
    }

    changePage(e) {
        this.page = e.page + 1;
        this.getOrganization();
    }

    delete(e: Organization) {
        this.organizationService
            .deleteOrganization(e.organizationId)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    if (res.data.success) {
                        this.messageConfig.messageConfig.next({
                            severity: MESSAGE_TYPE.success,
                            summary: this.translate.instant(
                                MESSAGE_SUMARY.success
                            ),
                            detail: res.data.message,
                        });
                        this.selectedOrganizations = [];
                        this.getOrganization();
                    }
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity:
                            err.error?.statusCode === 400
                                ? MESSAGE_TYPE.warn
                                : MESSAGE_TYPE.error,
                        summary:
                            err.error?.statusCode === 400
                                ? this.translate.instant(MESSAGE_SUMARY.warn)
                                : this.translate.instant(MESSAGE_SUMARY.error),
                        detail:
                            err.error?.message ??
                            this.translate.instant('Internal_server'),
                    });
                },
            });
    }

    openDialog(e?, method?: string) {
        const dialogRef = this.dialog.open(DialogOrganizationComponent, {
            header:
                e && method
                    ? this.translate.instant('Detail_organization')
                    : e && !method
                    ? this.translate.instant('Update_organization')
                    : this.translate.instant('Add_organization'),
            width: '350px',
            data: {
                ...e,
                method: method,
            },
        });

        dialogRef.onClose.subscribe({
            next: (res) => {
                if (res) {
                    this.getOrganization();
                }
            },
        });
    }

    updateUserOrganization(e: Organization) {
        const dialogRef = this.dialog.open(DialogUserOrganizationComponent, {
            header: this.translate.instant('Update_member'),
            width: '350px',
            data: e,
        });

        dialogRef.onClose.subscribe({
            next: () => {
                this.getOrganization();
            },
        });
    }

    organizationClicked(e: Organization) {
        this.selectedOrganizations = [];
        this.selectedOrganizations.push(e);
        this.reportService.selectedOrganization$.next(
            this.selectedOrganizations
        );
        this.tabIndex.emit(1);
    }

    organizationSelectedHandle() {
        this.reportService.selectedOrganization$.next(
            this.selectedOrganizations
        );
    }
}
