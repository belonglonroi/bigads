import { Component, OnInit } from '@angular/core';
import { BaseClass } from 'src/app/core/base/base.class';
import {
    ApiPagingResult,
    DataResult,
} from 'src/app/core/models/api-result.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss'],
})
export class AnalysisComponent extends BaseClass implements OnInit {
    reportResult: DataResult<Campaign[]>;
    fetchingData: boolean = false;
    constructor(private reportService: ReportService) {
        super();
    }

    ngOnInit() {
        this.fetchingData = true;
        this.reportService
            .getProjects({})
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res: ApiPagingResult<Campaign[]>) => {
                    this.reportResult = res.data;
                    this.fetchingData = false;
                    console.log(this.reportResult);
                },
            });
    }
}
