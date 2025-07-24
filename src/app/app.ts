import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SharedModule } from '../shared/shared-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'HireMe';
}
