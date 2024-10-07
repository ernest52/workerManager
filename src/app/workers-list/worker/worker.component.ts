import { Component, DestroyRef, inject, input } from '@angular/core';
import { type Worker } from '../../shared/worker.model';
import { WorkersService } from '../../shared/workers.service';

@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [],
  templateUrl: './worker.component.html',
  styleUrl: './worker.component.css',
})
export class WorkerComponent {
  destroyRef=inject(DestroyRef);
  _workersService=inject(WorkersService);
  worker = input.required<Worker>();
  _state=this._workersService.state;
  setWorkerId(){
  if(this._state.get("workerId")===this.worker().id){
    // this._state.set("workerId",({workerId})=>id);
    this._workersService.setWorkerId(null);
   return  this._workersService.setContent("main");
  }
  this._workersService.setWorkerId(this.worker().id);
  this._workersService.setContent("tasks");
    const sub=this._workersService.tasksSubscription.subscribe();
    this.destroyRef.onDestroy(()=>sub.unsubscribe());
    
  }
}
