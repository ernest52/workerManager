import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { WorkerComponent } from './worker/worker.component';
import { LoaderComponent } from '../shared/loader/loader.component';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { Worker } from '../shared/worker.model';
import { HttpClient } from '@angular/common/http';
import { select, selectSlice } from '@rx-angular/state/selections';
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
    next:({workers})=>{console.count("workers list was computing...");this.isLoading.set(false);
      const message=workers[0]?.message;
      if(message){
        this._workersRepo.setError(message)
return  this._workersRepo.onNavigate("error");
      }
      this.workers.set(workers)}
  }),map(({workers})=>workers))
 
  // destroyRef = inject(DestroyRef);
  error="";

  // constructor() {
  //   console.log("worker list component rendered");
  //   const sub = this._workersRepo.workers.subscribe({
  //     next: (resp) => {
  //       this._workersRepo.setWorkers(resp.workers);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false)
  //       this._workersRepo.setError(
  //         err?.error?.message || err?.message || 'response failed'
  //       )
  //     }
   
  //   });
  //   // this.destroyRef.onDestroy(() => sub.unsubscribe);
  // }
}
