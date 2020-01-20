import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenubarComponent } from './menubar/menubar.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { BlankComponent } from './blank/blank.component';
import { LoginComponent } from './login/login.component';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    WelcomeComponent,
    BlankComponent,
    LoginComponent,
    GraphComponent
  ],
  entryComponents:[
    AppComponent,
    MenubarComponent,
    WelcomeComponent,
    BlankComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
