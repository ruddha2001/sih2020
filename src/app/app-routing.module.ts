import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {show} from "./dynamic";
import { MenubarComponent } from "./menubar/menubar.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { GraphComponent } from "./graph/graph.component";
import { BlankComponent } from './blank/blank.component';
import { LoginComponent } from './login/login.component';

let routes: Routes = [
  { path: "", component: WelcomeComponent },
    { path: "", component: MenubarComponent, outlet: "menubar" },
    { path: "graph", component: GraphComponent }
];

console.log(show)

let showa = show;

if (showa == 1) {
  routes = [
    { path: "", component: WelcomeComponent },
    { path: "", component: MenubarComponent, outlet: "menubar" },
    { path: "graph", component: GraphComponent }
  ];
} else {
  routes = [
    { path: "", component: BlankComponent },
    { path: "", component: LoginComponent, outlet: "menubar" },
    { path: "graph", component: BlankComponent }
  ];
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
