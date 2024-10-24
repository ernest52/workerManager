import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { type Worker } from '../../shared/worker.model';
import { WorkersService } from '../../shared/workers.service';
import { ContentService } from '../../shared/content.service';




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
  // _router=inject(Router);
 
  worker = input.required<Worker>();
  _state=this._workersService.state;

  setWorkerId(){
    this._workersService.setWorkerId(this.worker().id);
return  this._workersService.onNavigate(`/tasks/${this.worker().id}`)
  }
  details($e:Event){
$e.stopPropagation();
this._workersService.onNavigate(`workers/${this.worker().id}`);
this._workersService.setWorkerId(this.worker().id);

  }
}
