import {animate, style, transition, trigger} from '@angular/animations';

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateY(+100%)' }),
    animate('300ms ease-in', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(-100%)' }))
  ])
])
