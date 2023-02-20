import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { Node } from '../../models/node';
import { MessageService } from 'src/app/services/message.service';

@Component({
    selector: 'app-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit, OnChanges {

    @Input('node') node: Node;
    @Input('isClicked') isClicked: boolean;
    @Output('dropped') dropped: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('nodeElement', { static: true }) nodeElement;

    isStartNode = false;
    isEndNode = false;

    constructor(private messageService: MessageService, private ref: ChangeDetectorRef, private elementRef: ElementRef) { }

    ngOnInit(): void {
        this.messageService.messages$.subscribe(
            (message: Node) => {
                console.log('Message:', message);
            }
        );
    }

    ngAfterViewInit() { }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('Changes:', changes);
    }

    runChangeDetector() {
        this.ref.markForCheck();
    }

    mouseUp(event: Event) {
        try {
            var data = (event as any).dataTransfer.getData('text');
            this.dropped.emit({
                previousNode: JSON.parse(data),
                newNode: this.node
            });
        } catch (err) {
            console.error(err);
        }
    }

    mouseDown(event: Event) {
        if (this.node.isStartNode || this.node.isEndNode) {
            this.messageService.setMouseReleased();
            event.stopPropagation();
            return;
        }
        this.node.isWall = !this.node.isWall;
    }

    createWall(event) {
        if (this.messageService.getMouseClicked() == true && !this.node.isStartNode && !this.node.isEndNode) {
            this.node.isWall = !this.node.isWall;
        }
    }

    dragCancel(event: Event) {
        event.preventDefault();
    }

    dragStart(event) {
        event.dataTransfer.setData('text/plain', JSON.stringify(this.node));
        event.data = this.node;
    }

}
