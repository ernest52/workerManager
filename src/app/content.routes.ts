import { Routes } from "@angular/router";
import { TaskComponent } from "./content/task/task.component";
import { TaskFormComponent } from "./content/taskForm/taskForm.component";
import { WorkerFormComponent } from "./content/worker-form/worker-form.component";
import { ErrorComponent } from "./shared/error/error.component";
export const componentRoutes:Routes=[{
  path:"workers",
  component:WorkerFormComponent
},{
  path:"tasks",
  component:TaskFormComponent
},{
  path:"tasks/:workerID",
  component:TaskComponent
},{
  path:"error",
  component:ErrorComponent
}]