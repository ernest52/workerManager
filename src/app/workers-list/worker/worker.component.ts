import { Component, DestroyRef, inject, input } from '@angular/core';
import { type Worker } from '../../shared/worker.model';
import { WorkersService } from '../../shared/workers.service';
import { ContentService } from '../../shared/content.service';

@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [],
  templateUrl: './worker.component.html',

})
export class WorkerComponent {
  destroyRef=inject(DestroyRef);
  _workersService=inject(WorkersService);
  _contentService=inject(ContentService);
  worker = input.required<Worker>();
  _state=this._workersService.state;
  // isLoading=this._workersService.isLoading;

  setWorkerId(){
    this._contentService.setInfo("");
  if(this._state.get("workerId")===this.worker().id){
 
    this._workersService.setWorkerId(null);
   return  this._workersService.setContent("main");
  }
// this.isLoading.set(true);
this._contentService.setLoading(true);
  this._workersService.setWorkerId(this.worker().id);
  this._workersService.setContent("tasks");
    const sub=this._workersService.tasksObserv.subscribe({
  
    error:(err)=>{
      
      this._workersService.setError(err?.error?.message||"fetching tasks failed")
    },
    complete:()=>this._contentService.setLoading(false)
    }
  );
    this.destroyRef.onDestroy(()=>sub.unsubscribe());
    
  }
  details($e:Event){
$e.stopPropagation();
console.log("SEE DETAILS")
  }
}
