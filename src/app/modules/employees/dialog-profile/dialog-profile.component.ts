import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseClass } from 'src/app/core/base/base.class';
import { GENDER_SELECT } from 'src/app/core/consts/gender.const';
import { MESSAGE_TYPE, MESSAGE_SUMARY } from 'src/app/core/consts/message.const';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { MessageConfigService } from 'src/app/service/message.config.service';

@Component({
    selector: 'app-dialog-profile',
    templateUrl: './dialog-profile.component.html',
    styleUrls: ['./dialog-profile.component.scss']
})
export class DialogProfileComponent extends BaseClass implements OnInit {

    @ViewChild('file', { static: false }) file: ElementRef;
    dialogData = {
        firstName: '',
        lastName: '',
        genderId: 0,
        email: '',
        image: '',
    }
    invalid: boolean = false;
    imagePreview: string | ArrayBuffer;
    gender = GENDER_SELECT.map(e => {
        return {
            ...e,
            label: this.translate.instant(e.label)
        }
    });
    user: User;

    constructor(
        public dialogRef: DynamicDialogRef,
        private translate: TranslateService,
        private userService: UserService,
        private messageConfig: MessageConfigService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.user = this.userService.user.value;
        this.dialogData = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            genderId: this.user.genderId,
            email: this.user.email,
            image: this.user.avatar,
        }
        this.imagePreview = this.user.avatar;
    }

    submitHandler() {
        if (!this.dialogData.lastName || !this.dialogData.firstName || !this.dialogData.genderId) {
            this.invalid = true;
            return;
        }

        const data = new FormData();

        data.append('firstName', this.dialogData.firstName);
        data.append('lastName', this.dialogData.lastName);
        data.append('genderId', this.dialogData.genderId as unknown as string);
        data.append('email', this.dialogData.email);
        data.append('image', this.dialogData.image);

        this.invalid = false;

        this.userService.updateProfile(data)
            .pipe(this.unsubsribeOnDestroy)
            .subscribe({
                next: (res) => {
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.messageConfig.messageConfig.next({
                        severity: err.error?.statusCode === 400 ? MESSAGE_TYPE.warn : MESSAGE_TYPE.error,
                        summary: err.error?.statusCode === 400 ? this.translate.instant(MESSAGE_SUMARY.warn) : this.translate.instant(MESSAGE_SUMARY.error),
                        detail: err.error?.message ?? this.translate.instant('Internal_server'),
                    })
                }
            });
    }

    selectFileHandler(e) {
        this.dialogData.image = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.imagePreview = e.target.result;
            console.log(this.imagePreview)
        }
        fileReader.readAsDataURL(e.target.files[0])
    }

}
