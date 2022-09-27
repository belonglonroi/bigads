import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-mobile-view',
    templateUrl: './mobile-view.component.html',
    styleUrls: ['./mobile-view.component.scss'],
})
export class MobileViewComponent implements OnInit, OnChanges {
    @Input() data;
    displayChargeComponent = false;
    amount: number | undefined = undefined;
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes.data);
    }

    ngOnInit(): void {
        console.log(this.data);
    }
}
