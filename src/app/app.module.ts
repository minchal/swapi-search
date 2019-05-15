import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PersonComponent } from './person.component';
import { ResultsComponent } from './results.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    declarations: [
        AppComponent,
        PersonComponent,
        ResultsComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
