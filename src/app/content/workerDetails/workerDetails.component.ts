import{ Component, DestroyRef, inject, Input, OnInit} from "@angular/core";
import { WorkersService } from "../../shared/workers.service";
import { RxState } from "@rx-angular/state";
import { Worker } from "../../shared/worker.model";
import { select, selectSlice } from "@rx-angular/state/selections";
import { combineLatest, map, of, shareReplay, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { Task } from "../../shared/task.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
interface State{
  userData:{
    worker:Worker,
    tasks:Task[]
  };
  workers:Worker[]

}
@Component({
  selector:"app-worker-details",
  templateUrl:"./workerDetails.component.html",
  standalone:true,
  imports:[CommonModule],
  providers:[RxState]

})
export  class WorkerDetails implements OnInit{
@Input({required:true}) id!:string;
_destroyRef=inject(DestroyRef);
_workersService=inject(WorkersService);

// _state:RxState<State>=inject(RxState<State>);
worker$=this._state.select("userData");
workerId$=this._workersService.state.select(selectSlice(["workerId"]),map(({workerId})=>workerId));
workers$=this._state.select(selectSlice(["workers"]),map(({workers})=>workers));
tasks$=this._workersService.state.select(selectSlice(["tasks"]),map(({tasks})=>tasks));

constructor(private _state:RxState<State>){
  this._state.connect("workers",this._workersService.state.select("workers"));
}
ngOnInit():void{
  this._state.connect("userData",combineLatest([this.workers$,this.workerId$,this.tasks$]).pipe(select(shareReplay(1),map(([workers,id,tasks])=>{
    console.count("workerDetails computed...");
    const worker= workers.filter(el=>el.id===id)[0];
    const userData={worker,tasks};
    console.log("userData: ",userData);
    return userData;
  }))))
}
}
