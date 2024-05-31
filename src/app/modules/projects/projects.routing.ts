import { Component } from "@angular/core";
import { ProjectsHomeComponent } from "./page/projects-home/projects-home.component";
import { Routes } from "@angular/router";

export const PROJECTS_ROUTES: Routes = [
{
    path:'',
    component: ProjectsHomeComponent
}
]