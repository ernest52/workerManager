import { Component,inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';

import { TaskFormComponent } from './taskForm/taskForm.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { TaskComponent } from './task/task.component';
import { ContentService } from '../shared/content.service';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [TaskFormComponent,WorkerFormComponent,LoaderComponent,TaskComponent],

  templateUrl: './content.component.html',
})
export class ContentComponent    {
  _contentRepo=inject(ContentService);
  _workersRepo=inject(WorkersService);
  info=this._contentRepo.infoSignal;
  mode=this._workersRepo.contentSignal();
  tasks=this._workersRepo.tasksSignal();
  isLoading=this._contentRepo.loadingSignal;
 


}
