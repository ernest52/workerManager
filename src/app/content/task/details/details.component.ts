import { Component, input,inject, ChangeDetectionStrategy, signal, DestroyRef} from "@angular/core";
import {type  Task } from "../../../shared/task.model";
import { WorkersService } from "../../../shared/workers.service";
import { ContentService } from "../../../shared/content.service";
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { debounceTime, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  selector:"app-details",
  templateUrl:"./details.component.html",
  standalone:true,
  imports:[LoaderComponent],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DetailsComponent{
  _workersService=inject(WorkersService);
  _contentService=inject(ContentService);
  destroyRef=inject(DestroyRef);
 task=input.required<Task>()
 isLoading=signal<boolean>(false);

 completeTask(){
    const confirmed=window.confirm("Do you want to complete this task?");
    if(confirmed){

      this._workersService.completeTask(this.task().id);
    }
  }
}