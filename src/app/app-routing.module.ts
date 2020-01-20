import { NgModule } from "@angular/core";
import {show} from "./dynamic.js";
import { Routes, RouterModule } from "@angular/router";
import { MenubarComponent } from "./menubar/menubar.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { BlankComponent } from './blank/blank.component';
import { LoginComponent } from './login/login.component';


let routes: Routes = [];
console.log(show);
let showa =show;

if (showa==1) {
  routes = [
    { path: "", component: WelcomeComponent },
    { path: "", component: MenubarComponent, outlet: "menubar" }
  ];
} else {
  routes = [
    { path: "", component: BlankComponent },
    { path: "", component: LoginComponent, outlet: "menubar" }
  ];
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
