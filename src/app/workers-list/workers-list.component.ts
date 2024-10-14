import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { WorkersService } from '../shared/workers.service';
import { WorkerComponent } from './worker/worker.component';
import { LoaderComponent } from '../shared/loader/loader.component';
@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [WorkerComponent,LoaderComponent],
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WorkersListComponent {
  isLoading=signal(true);
  _workersRepo = inject(WorkersService);

  workers = this._workersRepo.workersSignal();
  destroyRef = inject(DestroyRef);
  error=""
  constructor() {
    console.log("worker list component rendered");
    const sub = this._workersRepo.workers.subscribe({
      next: (resp) => {
        this._workersRepo.setWorkers(resp.workers);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false)
        this._workersRepo.setError(
          err?.error?.message || err?.message || 'response failed'
        )
      }
   
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe);
  }
}
