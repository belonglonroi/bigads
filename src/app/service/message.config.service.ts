import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageConfigService {

    messageConfig = new BehaviorSubject<Message>(null);

    get message() {
        return this.messageConfig.value;
    }
}
