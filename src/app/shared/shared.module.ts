import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModelChangeDebouncedDirective } from './directive/ngModel-change-debounced.directive';
import { AgGridModule } from 'ag-grid-angular';
import { SharedPrimeModule } from './primeng.module';

@NgModule({
    declarations: [
        NgModelChangeDebouncedDirective
    ],
    imports: [
        CommonModule,
        AgGridModule,
        SharedPrimeModule,
    ],
    exports: [
        NgModelChangeDebouncedDirective,
        AgGridModule,
        SharedPrimeModule,
    ],
    providers: [],
})
export class SharedModule { }
