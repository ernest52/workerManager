import { inject, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { type Worker } from './worker.model';
import { RxState } from '@rx-angular/state';
import { type State } from './state.model';
import { type Task } from './task.model';
import {  catchError, map, mergeMap, Observable, of, Subject, switchMap, tap, throwError, } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({ providedIn: 'root' })
export class WorkersService {
  private _httpClient = inject(HttpClient);
  private router=inject(Router);
  private _state: RxState<State> = inject(RxState<State>);
  private taskSubject=new Subject<Task>();
  private workerIdSubject=new Subject<string>();
workerIdObservable$=this.workerIdSubject.asObservable();
workerTasks$=this.workerIdObservable$.pipe(switchMap(id=>this._httpClient.get<{tasks:Task[]}>(`http://localhost:3000/admin/tasks?id=${id}`).pipe(map(resp=>resp.tasks),catchError((err)=>{
  console.log("CATCH ERROR: ",err);
return of([{error:err?.error?.message||"request failed"}as Task])}))));
  workers$=this._httpClient.get<{ workers: Worker[] }>('http://localhost:3000/admin/workers').pipe(map(resp=>resp.workers),catchError(this.errorHandler));
  
 taskObservable$=this.taskSubject.asObservable();
 createTask$=this.taskObservable$.pipe(mergeMap((task)=>{
  return this._httpClient.post<{message:string}>('http://localhost:3000/admin/tasks',task).pipe(map((resp)=>{
return resp.message;
  }),catchError(this.errorHandler))
 }),catchError(this.errorHandler));

  constructor() {
    this._state.set(() => ({ error: '', workers: [],tasks:[],workerId:null }));
  }
  get state() {
    return this._state.asReadOnly();
  }
 onNavigate(path:string){
this.router.navigate([path]);
 }
 onAddedTask(task:Task){
  this.taskSubject.next(task);
 }
 onSelectedWorkerId(id:string){
  console.log("WORKER id: ",id);
  this.workerIdSubject.next(id);
 }
 private errorHandler(err:HttpErrorResponse):Observable<never>{

 const error=`error occured with: ${err?.error?.message||"request failed"}`;
  return throwError(()=>error )

};

  get errorSignal() {
    return this._state.computed((s) => s.error);
  }


  addWorkerToManager(worker:Worker){
this._state.set("workers",({workers})=>[...workers,worker])
// console.log("CURRENT WORKERS: ",this._state.get("workers"));

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
