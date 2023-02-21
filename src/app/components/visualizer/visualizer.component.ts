import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { Point } from 'src/app/models/point';
import { Node } from 'src/app/models/node';
import { Action } from 'src/app/models/action';
import { Algorithm } from 'src/app/models/algorithm';
import { DijkstraService } from 'src/app/services/dijkstra.service';
import { MessageService } from 'src/app/services/message.service';
import { NodeComponent } from 'src/app/components/node/node.component';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {

    rows: number = 25;
    cols: number = 50;
    isClicked: boolean = false;
    algorithms: Array<Algorithm> = [
        { name: 'Dijkstra', isSelected: true },
        { name: 'A*', isSelected: false }
    ];
    actions: Array<Action> = [
        {
            name: 'Start',
            action: () => {
                this.start();
            }
        },
        {
            name: 'Reset',
            action: () => {
                this.reset();
            }
        }
    ];
    nodes: Array<Array<Node>> = [];
    startNode: Point = { row: 6, col: 10 };
    endNode: Point = { row: 18, col: 39 };
    @ViewChildren('node') myComponents: QueryList<any>;

    constructor(private ref: ChangeDetectorRef, private messageService: MessageService) {
        this.createNodes();
        this.initializeStartEndNodes();
    }

    ngOnInit() { }

    initializeStartEndNodes() {
        this.startNode = { row: 6, col: 10 };
        this.endNode = { row: 18, col: 39 };
        let start: Node = this.getNode(this.startNode);
        let end: Node = this.getNode(this.endNode);
        start.isStartNode = true;
        end.isEndNode = true;
        this.startNode = start;
        this.endNode = end;
    }

    mouseUp(event: Event) {
        this.messageService.setMouseReleased();
        event.preventDefault();
        event.stopPropagation();
    }

    mouseDown(event: Event) {
        this.messageService.setMouseClicked();
        event.preventDefault();
        event.stopPropagation();
    }

    drop(event) {
        let previousNode: Node = event.previousNode;
        let newNode: Node = event.newNode;
        if (previousNode.isStartNode && !newNode.isEndNode) {
            this.nodes[previousNode.row][previousNode.col].isStartNode = false;
            previousNode.isStartNode = false;
            this.nodes[newNode.row][newNode.col].isStartNode = true;
            this.startNode = this.nodes[newNode.row][newNode.col];
        } else if (previousNode.isEndNode && !newNode.isStartNode) {
            this.nodes[previousNode.row][previousNode.col].isEndNode = false;
            previousNode.isEndNode = false;
            this.nodes[newNode.row][newNode.col].isEndNode = true;
            this.endNode = this.nodes[newNode.row][newNode.col];
        }
        this.runChangeDetector();
    }

    actionTakenHandler(action: Action) {
        action.action();
    }

    getNode(point): Node {
        for (const row of this.nodes) {
            for (const node of row) {
                if (node.row === point.row && node.col === point.col) {
                    return node;
                }
            }
        }
    }

    createNodes() {
        for (let i = 0; i < this.rows; i++) {
            const newRow: Array<Node> = [];
            for (let j = 0; j < this.cols; j++) {
                newRow.push(new Node(i, j, false, false, this.startNode, this.endNode));
            }
            this.nodes.push(newRow);
        }
    }

    start() {
        const dijkstra = new DijkstraService();
        const visited = dijkstra.start(this.nodes, this.startNode, this.endNode);
        for (let i = 0; i < visited.length; i++) {
            this.myComponents.forEach((cmp: NodeComponent) => {
                if (cmp.node == visited[i]) {
                    setTimeout(() => {
                        cmp.runChangeDetector();
                    }, i * 5);
                }
            });
        }
        let lastNode = visited[visited.length - 1];
        while (lastNode != null) {
            lastNode.inPath = true;
            lastNode = lastNode.previousNode;
        }
        let totalTime = (visited.length - 1) * 5;
        setTimeout(() => {
            let i = 0;
            this.myComponents.forEach((cmp: NodeComponent) => {
                setTimeout(() => {
                    cmp.runChangeDetector();
                }, i * 2);
                i += 1;
            });
        }, totalTime);
    }

    reset() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.nodes[i][j].reset();
            }
        }
        this.initializeStartEndNodes();
        let newNodes = [];
        for (let i = 0; i < this.rows; i++) {
            newNodes.push([...this.nodes[i]]);
        }
        delete this.nodes;
        this.nodes = newNodes;
        this.runChangeDetector();
    }

    runChangeDetector(type = 'all', index?) {
        if (type == 'all') {
            let toRun = [];
            this.myComponents.forEach((cmp: NodeComponent) => {
                toRun.push(cmp.runChangeDetector());
            });
            Promise.all(toRun);
        }
    }
    
}
