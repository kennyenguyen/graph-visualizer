import { Injectable } from '@angular/core';
import { Node } from '../models/node';

@Injectable({
    providedIn: 'root'
})
export class DijkstraService {

    constructor() { }

    start(nodes, startNode, endNode) {
        startNode.distance = 0;
        const unvisited: Array<Node> = [];
        const visited: Array<Node> = [];
        for (const node of nodes) {
            unvisited.push(...node);
        }
        while (unvisited.length > 0) {
            this.sortNodes(unvisited);
            const currNode = unvisited.shift();
            currNode.isVisited = true;
            visited.push(currNode);
            if (currNode.row === endNode.row && currNode.col === endNode.col) {
                return visited;
            }
            this.updateNeighbors(currNode, nodes);
        }
    }

    updateReference(currNode, original) {
        setTimeout(() => {
            original[currNode.row][currNode.col] = currNode;
        }, 20);
    }

    sortNodes(nodes) {
        nodes.sort((a, b) => a.distance - b.distance);
    }

    getNeighbors(currNode, nodes) {
        const lastRow = nodes.length - 1;
        const lastCol = nodes[0].length - 1;
        let neighbors: Array<Node> = [];
        if (currNode.row > 0) {
            neighbors.push(nodes[currNode.row - 1][currNode.col]);
        }
        if (currNode.col > 0) {
            neighbors.push(nodes[currNode.row][currNode.col - 1]);
        }
        if (currNode.row < lastRow) {
            neighbors.push(nodes[currNode.row + 1][currNode.col]);
        }
        if (currNode.col < lastCol) {
            neighbors.push(nodes[currNode.row][currNode.col + 1]);
        }
        neighbors = neighbors.filter(
            neighbor => !neighbor.isVisited && !neighbor.isWall
        );
        return neighbors;
    }

    updateNeighbors(currNode, nodes) {
        let neighbors = this.getNeighbors(currNode, nodes);
        for (let neighbor of neighbors) {
            neighbor.distance = currNode.distance + 1;
            neighbor.previousNode = currNode;
        }
    }

}
