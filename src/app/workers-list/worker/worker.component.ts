import { Component, input } from '@angular/core';
import { type Worker } from '../../shared/worker.model';

@Component({
  selector: 'app-worker',
  standalone: true,
  imports: [],
  templateUrl: './worker.component.html',
  styleUrl: './worker.component.css',
})
export class WorkerComponent {
  worker = input.required<Worker>();
}
