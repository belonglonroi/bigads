import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModelChangeDebouncedDirective } from './directive/ngModel-change-debounced.directive';
import { AgGridModule } from 'ag-grid-angular';
import { SharedPrimeModule } from './primeng.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        NgModelChangeDebouncedDirective
    ],
    imports: [
        CommonModule,
        AgGridModule,
        SharedPrimeModule,
        FlexLayoutModule
    ],
    exports: [
        NgModelChangeDebouncedDirective,
        AgGridModule,
        SharedPrimeModule,
        FlexLayoutModule
    ],
    providers: [],
})
export class SharedModule { }
