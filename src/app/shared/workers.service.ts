import { inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Worker } from './worker.model';
import { RxState } from '@rx-angular/state';
import { type State } from './state.model';
import { type Task } from './task.model';
import { map } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class WorkersService {
  private _httpClient = inject(HttpClient);
  private _state: RxState<State> = inject(RxState<State>);

  
  constructor() {
    this._state.set(() => ({ error: '', workers: [],tasks:[],workerId:null }));
  }
  get state() {
    return this._state.asReadOnly();
  }

  get tasksObserv()
  {
    this._state.set("tasks",()=>[]);
    
   return  this._httpClient.get<{tasks:Task[]}>(`http://localhost:3000/admin/tasks?id=${this._state.get("workerId")}`).pipe(map((resp)=>{
  if(resp.tasks.length){
    this._state.set("tasks",()=>resp.tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})))
  }
   }))
  }
  get errorSignal() {
    return this._state.computed((s) => s.error);
  }
  get workersSignal() {
    return this._state.computed((s) => s.workers);
  }

get tasksSignal(){
return this._state.computed((s)=>s.tasks);
}

  get workers() {
    return this._httpClient.get<{ workers: Worker[] }>(
      'http://localhost:3000/admin/workers'
    );
  }
  addWorkerToManager(worker:Worker){
this._state.set("workers",({workers})=>[...workers,worker])
// console.log("CURRENT WORKERS: ",this._state.get("workers"));

  }
  createTask(task:Task){
return this._httpClient.post<{ message:string }>(
  'http://localhost:3000/admin/tasks',{task}
);
  }
  removeTask(id:number){
   return  this._httpClient.delete<{message:string}>(`http://localhost:3000/admin/tasks?id=${id}`).pipe(map((resp)=>{
    this._state.set("tasks",({tasks})=>tasks.filter(el=>el.id!==id));
    this._state.set("workerId",()=>null);
return resp.message
   }))
  }
  createWorker(firstName:string,lastName:string,image:File, randomAvatar:boolean){
    // console.log("randomAvatar: ",randomAvatar);
    // console.log("firstName: ",firstName);
    // console.log("lastName: ",lastName)
    if(randomAvatar){
      return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers/default',{firstName,lastName});
    }
    const workerData=new FormData();
    workerData.append("firstName",firstName);
    workerData.append("lastName",lastName);
   workerData.append("image",image,`${firstName} ${lastName}`);
return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers',workerData);

  }

     
      setError(error: string) {
        this._state.set('error', () => error);
      }
      setWorkers(workers: Worker[]) {
        this._state.set('workers', () => workers);
      }
      setWorkerId(id:string|null){
        this._state.set("workerId",()=>id);
      }


}
