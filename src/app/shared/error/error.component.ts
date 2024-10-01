import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
})
export class ErrorComponent {
  @Input({ required: true }) error!: string;
}
