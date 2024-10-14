import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  @Input({ required: true }) error!: string;
}
