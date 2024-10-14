import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { type Worker } from '../../shared/worker.model';
import { WorkersService } from '../../shared/workers.service';
import { ContentService } from '../../shared/content.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [],
  templateUrl: './worker.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush

})
export class WorkerComponent {
  destroyRef=inject(DestroyRef);
  _workersService=inject(WorkersService);
  _contentService=inject(ContentService);
  _router=inject(Router);
 
  worker = input.required<Worker>();
  _state=this._workersService.state;

  setWorkerId(){
    this._contentService.setInfo("");
  if(this._state.get("workerId")===this.worker().id){
 this._workersService.setWorkerId(null);
return this._router.navigate([''])
  }

this._contentService.setLoading(true);
  this._workersService.setWorkerId(this.worker().id);
    const sub=this._workersService.tasksObserv.subscribe({
   error:(err)=>{
      
      this._workersService.setError(err?.error?.message||"fetching tasks failed")
    },
    complete:()=>this._contentService.setLoading(false)
    }
  );
    this.destroyRef.onDestroy(()=>sub.unsubscribe());
 return  this._router.navigate(['/tasks/',this.worker().id])
  }
  details($e:Event){
$e.stopPropagation();
console.log("SEE DETAILS")
  }
}
