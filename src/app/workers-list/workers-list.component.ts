import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { WorkerComponent } from './worker/worker.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import {map, tap } from 'rxjs';
import { Worker } from '../shared/worker.model';
import { HttpClient } from '@angular/common/http';
import { selectSlice } from '@rx-angular/state/selections';
@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [WorkerComponent,LoaderComponent,AsyncPipe],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WorkersListComponent {
  isLoading=signal(true);
  _workersRepo = inject(WorkersService);
  _httpClient=inject(HttpClient);
workers=signal<Worker[]>([]);
  workers$ = this._workersRepo.state.select(selectSlice(["workers"]),tap({
    next:({workers})=>{this.isLoading.set(false);
      const message=workers[0]?.message;
      if(message){
        this._workersRepo.setError(message)
return  this._workersRepo.onNavigate("error");
      }
      this.workers.set(workers)}
  }),map(({workers})=>workers))
 
  error="";

}
