import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModelChangeDebouncedDirective } from './directive/ngModel-change-debounced.directive';

@NgModule({
    declarations: [
        NgModelChangeDebouncedDirective
    ],
    imports: [CommonModule],
    exports: [
        NgModelChangeDebouncedDirective
    ],
    providers: [],
})
export class SharedModule { }
