import { Component,inject,input, OnInit } from '@angular/core';

import { WorkersService } from '../../shared/workers.service';

import { LoaderComponent } from '../../shared/loader/loader.component';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [LoaderComponent,DetailsComponent],
  templateUrl: './task.component.html',
})
export class TaskComponent{
workerID=input.required<string>();
_workersService=inject(WorkersService);
tasks=this._workersService.tasksSignal();






}
