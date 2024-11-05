import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
  ]
}).catch(err => console.error(err));
