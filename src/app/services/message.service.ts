import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    messages = new Subject();
    messages$ = this.messages.asObservable();
    isMouseClicked: boolean = false;

    constructor() { }

    notify(message) {
        this.messages.next(message);
    }

    setMouseClicked() {
        this.isMouseClicked = true;
    }

    setMouseReleased() {
        this.isMouseClicked = false;
    }

    getMouseClicked() {
        return this.isMouseClicked;
    }

}
