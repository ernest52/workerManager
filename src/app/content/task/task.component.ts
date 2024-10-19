import { ChangeDetectionStrategy, Component,inject,input, signal } from '@angular/core';

import { WorkersService } from '../../shared/workers.service';

import { LoaderComponent } from '../../shared/loader/loader.component';
import { DetailsComponent } from './details/details.component';

import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../shared/task.model';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [LoaderComponent,DetailsComponent,AsyncPipe],
  templateUrl: './task.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
workerID=input.required<string>();
_workersService=inject(WorkersService);
_httpClient=inject(HttpClient);
error="";
task=signal<Task[]>([]);
tasks$=this._workersService.workerTasks$.pipe(takeUntilDestroyed(),tap({
  next:(tasks)=>{
    const error=tasks[0]?.error;
    if(error){
      this.error=error;
    }else{
      this.task.set(tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})))
    }
// this.task.set(tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})))
    },
}));

// tasks$=this.router.paramMap.pipe(switchMap((params:ParamMap)=>this._httpClient.get<{tasks:Task[]}>(`http://localhost:3000/admin/tasks?id=${params.get("workerID")}`).pipe(map((resp)=>{
//   this.task.set(resp.tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})))
//   return this.task()
//  }))));










}
