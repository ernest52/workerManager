import { Routes } from "@angular/router";
import { ErrorComponent } from "./shared/error/error.component";

export const componentRoutes:Routes=[{
  path:"workers",
  loadComponent:()=>import("./content/worker-form/worker-form.component").then(m=>m.WorkerFormComponent)
},
{
  path:"workers/:id",
  loadComponent:()=>import("./content/workerDetails/workerDetails.component").then(m=>m.WorkerDetails)
},
{
  path:"tasks",
  loadComponent:()=>import("./content/taskForm/taskForm.component").then(m=>m.TaskFormComponent)
},{
  path:"tasks/:workerID",
  loadComponent:()=>import("./content/task/task.component").then(m=>m.TaskComponent)
},{
  path:"error",
  component:ErrorComponent
}]