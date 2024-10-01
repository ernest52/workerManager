import { Component, inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { AsyncPipe } from '@angular/common';
import { TaskFormComponent } from './taskForm/taskForm.component';
import { WorkerFormComponent } from './worker-form/worker-form.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [AsyncPipe,TaskFormComponent,WorkerFormComponent],
  templateUrl: './content.component.html',
})
export class ContentComponent {
  _workersRepo=inject(WorkersService);
  _state=this._workersRepo.state;
  mode$=this._state.select("content");

}
