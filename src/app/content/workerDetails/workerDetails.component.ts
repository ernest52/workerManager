import{ Component, DestroyRef, inject, Input, OnInit, signal, WritableSignal} from "@angular/core";
import { WorkersService } from "../../shared/workers.service";
import { RxState } from "@rx-angular/state";
import { Worker } from "../../shared/worker.model";
import { select } from "@rx-angular/state/selections";
import { catchError, combineLatest, delayWhen, EMPTY, map, scan, switchMap, timer } from "rxjs";
import { CommonModule } from "@angular/common";
import { Task } from "../../shared/task.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { retryWhen } from "rxjs";
import { DetailedBlock } from "./detailedBlock/detailedBlock";
interface Address{
  country:string;
  city:string;
   street:string;
  zipCode:string;

}
interface DetailedWorker{
name: string;
 image: string;
status:string;
 address:Address[]

};
interface State{
  userData:{
    worker:DetailedWorker,
    tasks:Task[]
  };

}
@Component({
  selector:"app-worker-details",
  templateUrl:"./workerDetails.component.html",
  standalone:true,
  imports:[CommonModule,DetailedBlock],
  providers:[RxState]

})
export  class WorkerDetails implements OnInit{
@Input({required:true}) id!:string;
_destroyRef=inject(DestroyRef);
_workersService=inject(WorkersService);
_httpClient=inject(HttpClient);
_state:RxState<State>=inject(RxState<State>);
worker$=this._state.select("userData");
workerId$=this._workersService.state.select("workerId");
workers$=this._workersService.state.select("workers");
tasks$=this._workersService.state.select("tasks");
details=signal<{name:string,address:Address[],tasks:Task[],showDetails:boolean}>({name:"",address:[],tasks:[],showDetails:false});
info:string="";

removeTask(id:number){
  
  this._state.connect("userData",this._workersService.removeTask(id).pipe(map(message=>{
    this._state.set("userData",({userData})=>({...userData,tasks:userData.tasks.filter(el=>el.id!==id)}));
    this.info=message;
    return {...this._state.get("userData")}
  })))

}

createUpdater=<T>(sg:WritableSignal<T>)=>
<K extends keyof T>(prop:K,value:T[K])=>sg.update(cur=>({...cur,[prop]:value}));
detailsUpdater=this.createUpdater(this.details);
setDetails(value:string){
  const userData=this._state.get("userData");
this.detailsUpdater("name",value);
 if(value==="address"){
  this.detailsUpdater("address",userData.worker.address);
  this.detailsUpdater("tasks",[])
 }else{
  this.detailsUpdater("tasks",userData.tasks);
  this.detailsUpdater("address",[]);
}


}
showDetails(id:number){
 
  if(this.details().name==="tasks"){
    this.details.update(cur=>({...cur,tasks:[cur.tasks.find(el=>el.id===id)!],showDetails:true}));

    
  }
  

}

ngOnInit():void{
  this._state.connect("userData",combineLatest([this.workers$,this.workerId$]).pipe(select(switchMap(([workers,workerId])=>{
  
   return  this._httpClient.get<{tasks:Task[],address:Address[]}>(`http://localhost:3000/admin/tasks?id=${workerId}&address=true`).pipe(map(resp=>{
 
   const worker=workers.find(el=>el.id===workerId);
   let detailedWorker:DetailedWorker=<DetailedWorker>{}
   if(worker){
    detailedWorker={
      name:`${worker.firstName} ${worker.lastName}` || "",
      image:worker?.image||worker?.avatar?.url || "",
      status:worker.status?"online":"offline",
      address:resp.address
     }
   }
 
   const userData={worker:detailedWorker,tasks:resp.tasks};
   return userData
   }),retryWhen((error)=>error.pipe(scan((acc,err)=>{
if(acc===3) throw err;
return acc+1;
   },0),delayWhen(value=>timer(value*500)))),catchError((err)=>{
    console.log("error occured with requesting tasks: ",err);
    return EMPTY

   }))}))))
  }
}

