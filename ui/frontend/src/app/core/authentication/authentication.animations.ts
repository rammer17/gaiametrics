import {
  trigger,
  state,
  style,
  transition,
  animate,
  animateChild,
  group,
  query,
} from '@angular/animations';

export const AuthenticationAnimations = [
  trigger('bannerAnimation', [
    state(
      'false',
      style({
        transform: 'translateX(100%)',
        'background-image': "url('../../../assets/gaia.png')",
      })
    ),
    state(
      'true',
      style({
        transform: 'translateX(0%)',
        'background-image': "url('../../../assets/gaia2.png')",
      })
    ),
    transition('false <=> true', [
      group([
        // query('@logoAnimation', animateChild()),
        query('@quoteAnimation', animateChild()),
        animate('0.5s ease-in-out'),
      ]),
    ]),
  ]),

  trigger('logoAnimation', [
    state(
      'false',
      style({
        transform: 'translateX(500%)',
      })
    ),
    state(
      'true',
      style({
        transform: 'translateX(0%)',
      })
    ),
    transition('false <=> true', [animate('0.5s ease-out')]),
  ]),
  trigger('quoteAnimation', [
    state(
      'false',
      style({
        display: 'none',
        opacity: 0,
      })
    ),
    state(
      'true',
      style({
        display: 'block',
        opacity: 1,
      })
    ),
    transition('false <=> true', [animate('0.5s ease-out')]),
  ]),

  trigger('signInFormAnimation', [
    state(
      'false',
      style({
        transform: 'translateX(0%)',
        'z-index': '999',
      })
    ),
    state(
      'true',
      style({
        transform: 'translateX(-100%)',
        'z-index': '998',
      })
    ),
    transition('false <=> true', [animate('0.5s ease-out')]),
  ]),
  trigger('signUpFormAnimation', [
    state(
      'false',
      style({
        transform: 'translateX(-100%)',
        'z-index': '999',
      })
    ),
    state(
      'true',
      style({
        transform: 'translateX(0%)',
        'z-index': '998',
      })
    ),
    transition('false <=> true', [animate('0.5s ease-out')]),
  ]),
];
