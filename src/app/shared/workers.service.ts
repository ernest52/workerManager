import { inject, Injectable} from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { type Worker } from './worker.model';
import { RxState } from '@rx-angular/state';
import { type State } from './state.model';
import { type Task } from './task.model';
import {  catchError, debounceTime, delay, delayWhen, map, mergeMap, Observable, of, retryWhen, scan, Subject,tap,throwError, timeInterval, timer, } from 'rxjs';
import { Router } from '@angular/router';
import { ContentService } from './content.service';



@Injectable({ providedIn: 'root' })
export class WorkersService {
  private _contentService=inject(ContentService);
  private _httpClient = inject(HttpClient);
  private router=inject(Router);
  private _state: RxState<State> = inject(RxState<State>);
  private taskSubject=new Subject<Task>();



  workers$=this._httpClient.get<{ workers: Worker[] }>('http://localhost:3000/admin/workers').pipe(map(resp=>resp.workers),retryWhen(error=>error.pipe(
    scan((acc,err)=>{
      if(acc>3) throw error;
      return acc+1
    },1),
    delayWhen(value=>{ return timer(value*500)}),
    // tap(value=>console.log("retrying in (value from tap after increasing value in delay when): ",value))
  )),catchError((err)=>{return of([{message:err?.error?.message||"request failed"} as Worker])}));
  
 taskObservable$=this.taskSubject.asObservable();
 createTask$=this.taskObservable$.pipe(mergeMap((task)=>{
  return this._httpClient.post<{message:string}>('http://localhost:3000/admin/tasks',task).pipe(map((resp)=>{
    this._state.set("tasks",({tasks})=>[...tasks,{...task,deadline:new Date(task.deadline).toLocaleDateString()}]);
return resp.message;
  }),catchError(this.errorHandler))
 }),catchError(this.errorHandler));

  constructor() {
    this._state.set(() => ({ error: '' }));
    this._state.connect("workers",this.workers$);
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
 
 private errorHandler(err:HttpErrorResponse):Observable<never>{
// console.log("FROM ERROR HANDLER err: ",err);
 const error=`error occured with: ${err?.error?.message||"request failed"}`;
  return throwError(()=>error )

};

  get errorSignal() {
    return this._state.computed((s) => s.error);
  }

  completeTask(id:number){

    this._state.connect("tasks",this._httpClient.patch<{message:string,}>(`http://localhost:3000/admin/tasks`,{id}).pipe(tap({
      next:(resp)=>{
        this._contentService.setInfo(resp.message);

      },
      error:(err)=>{
        this.setError(`updating status of task failed with error ${err?.error?.message || "request failed"}`);
        this.onNavigate("error");
      }
    }),map(()=>{
return this._state.get("tasks").map((el)=>el.id===id?{...el,completed:true}:el)
    })).pipe(delay(1500),tap({next:()=>this._contentService.setInfo("")})));
    

  }

  removeTask(id:number){
   return  this._httpClient.delete<{message:string}>(`http://localhost:3000/admin/tasks?id=${id}`).pipe(map((resp)=>{
    this._state.set("tasks",({tasks})=>tasks.filter(el=>el.id!==id));
   
return resp.message
   }))
  }
  createWorker(firstName:string,lastName:string,image:File, randomAvatar:boolean){
    // console.log("randomAvatar: ",randomAvatar);
    // console.log("firstName: ",firstName);
    // console.log("lastName: ",lastName)
    if(randomAvatar){
      return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers/default',{firstName,lastName}).pipe(tap({
        next:({worker})=>this._state.set("workers",({workers})=>[...workers,worker])
      }));
    }
    const workerData=new FormData();
    workerData.append("firstName",firstName);
    workerData.append("lastName",lastName);
   workerData.append("image",image,`${firstName} ${lastName}`);
return this._httpClient.post<{message:string,worker:Worker}>('http://localhost:3000/admin/workers',workerData).pipe(tap({
  next:({worker})=>this._state.set("workers",({workers})=>[...workers,worker])
}));

  }

     
      setError(error: string) {
        this._state.set('error', () => error);
      }
      // setWorkers(workers: Worker[]) {
      //   this._state.set('workers', () => workers);
      // }
      setWorkerId(id:string){
        this._state.set({tasks:undefined});
        const stateWorkerId=this._state.get("workerId");
       (!stateWorkerId||stateWorkerId!==id)&&this._state.set({workerId:id});

  this._state.connect("tasks",this._httpClient.get<{tasks:Task[]}>(`http://localhost:3000/admin/tasks?id=${id}`).pipe(tap({
error:(err)=>{
this.setError(err?.error?.message||"request failed");
this.onNavigate("error");
}})),(state,emited)=>emited.tasks.map(el=>({...el,deadline:new Date(el.deadline).toLocaleDateString()})))

    

      }


}
