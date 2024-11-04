import{ ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal} from "@angular/core";
import { WorkersService } from "../../shared/workers.service";
import { RxState } from "@rx-angular/state";
import { select } from "@rx-angular/state/selections";
import { catchError, combineLatest, delayWhen, EMPTY, map, scan, switchMap, timer } from "rxjs";
import { CommonModule } from "@angular/common";
import {type  Task } from "../../shared/task.model";
import {type Address} from "../../shared/address.model";
import { HttpClient } from "@angular/common/http";
import { retryWhen } from "rxjs";
import { DetailedBlock } from "./detailedBlock/detailedBlock";
import { LoaderComponent } from "../../shared/loader/loader.component";

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
  imports:[CommonModule,DetailedBlock,LoaderComponent],
  providers:[RxState],
  changeDetection:ChangeDetectionStrategy.OnPush

})
export  class WorkerDetails implements OnInit,OnChanges{
@Input({required:true}) id!:string;

_destroyRef=inject(DestroyRef);
_workersService=inject(WorkersService);
_httpClient=inject(HttpClient);
_state:RxState<State>=inject(RxState<State>);
worker$=this._state.select("userData");
workerId$=this._workersService.state.select("workerId");
workers$=this._workersService.state.select("workers");

details=signal<{name:string,address:Address[],tasks:Task[],showDetails:boolean}>({name:"",address:[],tasks:[],showDetails:false});
info:string="";
isLoading=signal<boolean>(false)

removeTask(id:number){
  this.isLoading.set(true);
  this._state.connect("userData",this._workersService.removeTask(id).pipe(map(message=>{
    this._state.set("userData",({userData})=>({...userData,tasks:userData.tasks.filter(el=>el.id!==id)}));
    this.info=message;
    this.details.set({name:"",address:[],tasks:[],showDetails:false});
    this.isLoading.set(false);
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
  this.detailsUpdater("tasks",[]);
  // console.log("this.details(): ",this.details());
 }else{
  this.detailsUpdater("tasks",userData.tasks);
  this.detailsUpdater("address",[]);
}


}
showDetails(id:number){
 
  if(this.details().name==="tasks"){
    if(this.details().showDetails) return this.details.update(obj=>({...obj,showDetails:false}))
    this.details.update(cur=>({...cur,tasks:[cur.tasks.find(el=>el.id===id)!],showDetails:true}));

  }
  

}

ngOnChanges(changes:SimpleChanges){
 this.details.set({name:"",address:[],tasks:[],showDetails:false});
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
//  console.count("workerDetails computes...");
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

