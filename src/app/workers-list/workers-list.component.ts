import { Component, DestroyRef, inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { WorkerComponent } from './worker/worker.component';

@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [WorkerComponent],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css',
})
export class WorkersListComponent {
  _workersRepo = inject(WorkersService);

  workers = this._workersRepo.workersSignal();
  destroyRef = inject(DestroyRef);
  constructor() {
    const sub = this._workersRepo.workers.subscribe({
      next: (resp) => {
        this._workersRepo.setWorkers(resp.workers);
      },
      error: (err) => {
        this._workersRepo.setError(
          err?.error?.message || err?.message || 'response failed'
        );
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe);
  }
}
