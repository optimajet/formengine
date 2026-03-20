import {Component} from '@angular/core';
import {BookingFormComponent} from "./booking-form/booking-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookingFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FormEngine with Angular reactive forms';

  constructor() {}
}
