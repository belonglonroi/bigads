import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit, OnChanges {
    @Input() amount: number | undefined = undefined;
    QRCode: string =
        'https://img.vietqr.io/image/970422-8666699991997-hfrspu6.jpg';
    query: string = '?amount=1000000&addInfo=Nap%20tien%20du%20an%20VHSC';
    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if ('amount' in changes) {
            this.query = `?amount=${this.amount}&addInfo=Nap%20tien%20du%20an%20VHSC`;
        }
    }

    ngOnInit(): void {}
}
