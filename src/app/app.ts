import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared-module';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SharedModule,Home],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'HireMe';
}
