import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkersListComponent } from './workers-list/workers-list.component';

import { TopNavComponent } from './top-nav/top-nav.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkersListComponent,TopNavComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
