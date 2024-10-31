import { ChangeDetectionStrategy, Component,inject } from '@angular/core';
import { WorkersService } from '../workers.service';
import { ContentService } from '../content.service';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
_workersService=inject(WorkersService);
_contentService=inject(ContentService);
error=this._workersService.errorSignal();


}
