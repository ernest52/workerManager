import { Component,inject,Input } from '@angular/core';
import {type Task } from '../../shared/task.model';
import { WorkersService } from '../../shared/workers.service';
import { ContentService } from '../../shared/content.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './task.component.html',
})
export class TaskComponent {
@Input({required:true}) task!:Task;
_workersService=inject(WorkersService);
_contentService=inject(ContentService);
isLoading=false;



removeTask(){
  const confirmed=window.confirm("Do you really want to delete this task?");
  if(confirmed){
    this.isLoading=true;
    this._workersService.removeTask(this.task.id).subscribe({
      next:(message)=>this._contentService.setInfo(message),
      error:(err)=>this._workersService.setError(err?.error?.message||"deleting process failed"),
      complete:()=>this.isLoading=false
    })
  }
}
}
