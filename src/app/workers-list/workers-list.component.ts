import { Component, DestroyRef, inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { WorkerComponent } from './worker/worker.component';
import { LoaderComponent } from '../shared/loader/loader.component';
@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [WorkerComponent,LoaderComponent],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css',
})
export class WorkersListComponent {
  isLoading=true;
  _workersRepo = inject(WorkersService);

  workers = this._workersRepo.workersSignal();
  destroyRef = inject(DestroyRef);
  constructor() {
    const sub = this._workersRepo.workers.subscribe({
      next: (resp) => {
        this._workersRepo.setWorkers(resp.workers);
        this.isLoading=false
      },
      error: (err) => {
        this.isLoading=false
        this._workersRepo.setError(
          err?.error?.message || err?.message || 'response failed'
        );
      
      },
   
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe);
  }
}
