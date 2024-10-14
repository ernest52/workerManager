import { ChangeDetectionStrategy, Component} from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink],
  providers:[],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TopNavComponent {



}
