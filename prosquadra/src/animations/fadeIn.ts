import { trigger, style, transition, animate } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate(
      '300ms ease-out',
      style({ opacity: 1, transform: 'scale(1)' })
    )
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ opacity: 0, transform: 'scale(0.8)' })
    )
  ])
]);
