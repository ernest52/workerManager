import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkersListComponent } from './workers-list/workers-list.component';
import { ErrorComponent } from './shared/error/error.component';
import { WorkersService } from './shared/workers.service';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ContentComponent } from './content/content.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkersListComponent, ErrorComponent,TopNavComponent,ContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  _workersRepo = inject(WorkersService);
  error = this._workersRepo.errorSignal();
}
