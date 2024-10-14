import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl:"./loader.component.css",
  standalone: true,
  imports: [MatProgressSpinnerModule],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {}
