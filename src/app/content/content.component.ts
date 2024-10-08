import { Component,inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';

import { TaskFormComponent } from './taskForm/taskForm.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';
import { LoaderComponent } from '../shared/loader/loader.component';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [TaskFormComponent,WorkerFormComponent,LoaderComponent],
  templateUrl: './content.component.html',
})
export class ContentComponent    {
  _workersRepo=inject(WorkersService);
  mode=this._workersRepo.contentSignal();
  tasks=this._workersRepo.tasksSignal();
  isLoading=this._workersRepo.isLoading.asReadonly();
 


}
