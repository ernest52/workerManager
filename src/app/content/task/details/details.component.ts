import { Component, input,inject} from "@angular/core";
import {type  Task } from "../../../shared/task.model";
import { WorkersService } from "../../../shared/workers.service";
import { ContentService } from "../../../shared/content.service";
import { LoaderComponent } from "../../../shared/loader/loader.component";
@Component({
  selector:"app-details",
  templateUrl:"./details.component.html",
  standalone:true,
  imports:[LoaderComponent]
})
export class DetailsComponent{
  _workersService=inject(WorkersService);
  _contentService=inject(ContentService);
 task=input.required<Task>()
 isLoading=false;

 removeTask(){
    const confirmed=window.confirm("Do you really want to delete this task?");
    if(confirmed){
      this.isLoading=true;
      this._workersService.removeTask(this.task().id).subscribe({
        next:(message)=>this._contentService.setInfo(message),
        error:(err)=>this._workersService.setError(err?.error?.message||"deleting process failed"),
        complete:()=>this.isLoading=false
      })
    }
  }
}