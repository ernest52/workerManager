import { Component, inject } from '@angular/core';
import { WorkersService } from '../shared/workers.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css'
})
export class TopNavComponent {
  _workerRepo=inject(WorkersService);
  changeMode(value:"worker"|"task"){
    this._workerRepo.setContent(value);
  }

}
