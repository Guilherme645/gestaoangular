import { Component } from "@angular/core";
import { ClientsHomeComponent } from "./page/clients-home/clients-home.component";
import { Routes } from "@angular/router";

export const PROJECTS_ROUTES: Routes = [
{
    path:'',
    component: ClientsHomeComponent
}
]