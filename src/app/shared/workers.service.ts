import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Worker } from './worker.model';
import { RxState } from '@rx-angular/state';
import { type State } from './state.model';
import { type Task } from './task.model';


@Injectable({ providedIn: 'root' })
export class WorkersService {
  private _httpClient = inject(HttpClient);
  private _state: RxState<State> = inject(RxState<State>);
  constructor() {
    this._state.set(() => ({ error: '', workers: [],content:"main" }));
  }
  get state() {
    return this._state.asReadOnly();
  }
  setContent(value:"main"|"task"|"worker"){
this._state.set("content",()=>value);
  }
  setError(error: string) {
    this._state.set('error', () => error);
  }
  setWorkers(workers: Worker[]) {
    this._state.set('workers', () => workers);
  }
  get errorSignal() {
    return this._state.computed((s) => s.error);
  }
  get workersSignal() {
    return this._state.computed((s) => s.workers);
  }
  get workers() {
    return this._httpClient.get<{ workers: Worker[] }>(
      'http://localhost:3000/admin/workers'
    );
  }
  addWorkerToManager(worker:Worker){
this._state.set("workers",({workers})=>[...workers,worker])
console.log("CURRENT WORKERS: ",this._state.get("workers"));
  }
  createTask(task:Task){
return this._httpClient.post<{ message:string }>(
  'http://localhost:3000/admin/tasks',{task}
);
  }
  createWorker(firstName:string,lastName:string,image:File, randomAvatar:boolean){
    console.log("randomAvatar: ",randomAvatar);
    if(randomAvatar){
      return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers/default',{firstName,lastName});
    }
    const workerData=new FormData();
    workerData.append("firstName",firstName);
    workerData.append("lastName",lastName);
   workerData.append("image",image,`${firstName} ${lastName}`)
return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers',workerData);

  }
}
