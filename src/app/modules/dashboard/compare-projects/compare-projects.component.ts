// import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { finalize } from 'rxjs';
import { BaseClass } from 'src/app/core/base/base.class';
import { ApiPagingResult } from 'src/app/core/models/api-result.model';
import { Campaign } from 'src/app/core/models/campaign.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
    selector: 'app-compare-projects',
    templateUrl: './compare-projects.component.html',
    styleUrls: ['./compare-projects.component.scss'],
})
export class CompareProjectsComponent extends BaseClass implements OnInit {
    chart: Chart;
    data;

    constructor(
        private dashboardService: DashboardService
    ) // private decimalPipe: DecimalPipe
    {
        super();
    }

    ngOnInit(): void {
        this.dashboardService
            .chartCompareProjects({
                fromDate: '2022-07-01',
                toDate: '2022-07-31',
            })
            .pipe(
                this.unsubsribeOnDestroy,
                finalize(() => {
                    this.initialChart();
                })
            )
            .subscribe({
                next: (res: ApiPagingResult<Campaign[]>) => {
                    this.data = res.data.records
                        .map((e) => {
                            return {
                                projectName: e.project.name,
                                total:
                                    e.anotherServiceFee +
                                    e.fixedAmount +
                                    e.expenditureAmount,
                                drilldown: e.project.name,
                                drilldownData: {
                                    type: 'bar',
                                    name: e.project.name,
                                    id: e.project.name,
                                    data: [
                                        ['dịch vụ khác', e.anotherServiceFee],
                                        ['thu phí', e.fixedAmount],
                                        ['chi tiêu', e.expenditureAmount],
                                    ],
                                },
                            };
                        })
                        .reduce((acc, curr) => {
                            const objInAcc = acc.find(
                                (o) => o.projectName === curr.projectName
                            );
                            if (objInAcc) objInAcc.total += curr.total;
                            else acc.push(curr);
                            return acc;
                        }, [])
                        .sort((a, b) => b.total - a.total)
                        .slice(0, 5);
                },
            });
    }

    initialChart() {
        this.chart = new Chart({
            chart: {
                type: 'bar',
            },
            title: {
                align: 'left',
                text: 'Browser market shares. January, 2018',
            },
            subtitle: {
                align: 'left',
                text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
            },
            accessibility: {
                announceNewData: {
                    enabled: true,
                },
            },
            xAxis: {
                type: 'category',
            },
            yAxis: {
                title: {
                    text: 'Total percent market share',
                },
            },
            legend: {
                enabled: false,
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false,
                    },
                },
            },

            tooltip: {
                headerFormat:
                    '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat:
                    '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
            },

            series: [
                {
                    type: 'bar',
                    name: 'Dự án',
                    colorByPoint: true,
                    data: this.data.map((e) => {
                        return {
                            name: e.projectName,
                            y: e.total,
                            drilldown: e.drilldown,
                        };
                    }),
                },
            ],
            drilldown: {
                breadcrumbs: {
                    position: {
                        align: 'right',
                    },
                },
                series: this.data.map((e) => {
                    return { ...e.drilldownData };
                }),
            },
        });
    }
}
