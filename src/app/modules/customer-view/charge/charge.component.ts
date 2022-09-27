import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-charge',
    templateUrl: './charge.component.html',
    styleUrls: ['./charge.component.scss'],
})
export class ChargeComponent implements OnInit {
    @Input() submitted: boolean = false;
    chargeValue: number = 2;
    amount: number | undefined = undefined;
    constructor() {}

    ngOnInit() {}

    submitAmount() {
        if (this.chargeValue !== 0) {
            switch (this.chargeValue) {
                case 2:
                    this.amount = 2000000;
                    break;
                case 5:
                    this.amount = 5000000;
                    break;
                case 10:
                    this.amount = 10000000;
                    break;
                case 20:
                    this.amount = 20000000;
                    break;

                default:
                    break;
            }
        }
        this.submitted = true;
    }
}
