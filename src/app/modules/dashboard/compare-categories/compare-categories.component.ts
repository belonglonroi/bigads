import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'app-compare-categories',
    templateUrl: './compare-categories.component.html',
    styleUrls: ['./compare-categories.component.scss'],
})
export class CompareCategoriesComponent implements OnInit {
    chart: Chart;

    constructor() {}

    ngOnInit(): void {
        this.chart = new Chart({
            chart: {
                type: 'variablepie',
            },
            title: {
                text: 'Countries compared by population density and total area.',
            },
            tooltip: {
                headerFormat: '',
                pointFormat:
                    '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    'Area (square km): <b>{point.y}</b><br/>' +
                    'Population density (people per square km): <b>{point.z}</b><br/>',
            },
            series: [
                {
                    type: 'variablepie',
                    minPointSize: 10,
                    innerSize: '20%',
                    zMin: 0,
                    name: 'countries',
                    data: [
                        {
                            name: 'Spain',
                            y: 505370,
                            z: 92.9,
                        },
                        {
                            name: 'France',
                            y: 551500,
                            z: 118.7,
                        },
                        {
                            name: 'Poland',
                            y: 312685,
                            z: 124.6,
                        },
                        {
                            name: 'Czech Republic',
                            y: 78867,
                            z: 137.5,
                        },
                        {
                            name: 'Italy',
                            y: 301340,
                            z: 201.8,
                        },
                        {
                            name: 'Switzerland',
                            y: 41277,
                            z: 214.5,
                        },
                        {
                            name: 'Germany',
                            y: 357022,
                            z: 235.6,
                        },
                    ],
                },
            ],
        });
    }
}
