import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
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
        DragDropModule,
        FontAwesomeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faGithub, faLinkedin, faCode, faHeart);
    }
}
