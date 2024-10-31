import { ChangeDetectionStrategy, Component,inject,input, OnInit, signal } from '@angular/core';

import { WorkersService } from '../../shared/workers.service';

import { LoaderComponent } from '../../shared/loader/loader.component';
import { DetailsComponent } from './details/details.component';

import { ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, debounceTime, EMPTY, map, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../shared/task.model';
import { AsyncPipe } from '@angular/common';
import { selectSlice } from '@rx-angular/state/selections';


@Component({
  selector: 'app-task',
  standalone: true,
  imports: [LoaderComponent,DetailsComponent,AsyncPipe],
  templateUrl: './task.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit {
workerID=input.required<string>();
_workersService=inject(WorkersService);
_httpClient=inject(HttpClient);
// isLoading=signal<boolean>(false);
router=inject(ActivatedRoute);
error="";
task=signal<Task[]>([]);
tasks$=this._workersService.state.select(selectSlice(["tasks"]),map(({tasks})=>{this.task.set(tasks);return tasks}));
ngOnInit(){
  this._workersService.setWorkerId(this.workerID());
}

// tasks$=this.router.paramMap.pipe(map((params:ParamMap)=>{return params.get("workerID")})).pipe(switchMap(id=>this._httpClient.get<{tasks:Task[]}>(`http://localhost:3000/admin/tasks?id=${id}`).pipe(tap({
//   next:(resp)=>{
//     console.log("resp: ",resp)
//     this.task.set(resp.tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})));

// },
// error:(err)=>{
//   this._workersService.setError(err?.error?.message||"request failed");
//   this._workersService.onNavigate("error");
// }
// }))))

}
