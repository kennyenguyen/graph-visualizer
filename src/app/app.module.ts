import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActionsComponent } from './components/actions/actions.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { NodeComponent } from './components/node/node.component';

@NgModule({
    declarations: [
        AppComponent,
        ActionsComponent,
        VisualizerComponent,
        NodeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DragDropModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
