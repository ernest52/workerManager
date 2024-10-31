import { ChangeDetectionStrategy, Component,inject} from '@angular/core';
import { WorkersService } from '../shared/workers.service';


import { LoaderComponent } from '../shared/loader/loader.component';
import { TaskComponent } from './task/task.component';
import { ContentService } from '../shared/content.service';
import { RouterOutlet } from '@angular/router';
import { ErrorComponent } from '../shared/error/error.component';


@Component({
  selector: 'app-content',
  standalone: true,
  imports: [LoaderComponent,TaskComponent,RouterOutlet,ErrorComponent],
styleUrl:"./content.component.css",
  templateUrl: './content.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ContentComponent  {
  _contentRepo=inject(ContentService);
  _workersRepo=inject(WorkersService);
  info=this._contentRepo.infoSignal;
  isLoading=this._contentRepo.loadingSignal;




}
