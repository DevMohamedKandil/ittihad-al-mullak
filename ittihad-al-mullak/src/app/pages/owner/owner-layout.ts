import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OwnerMobileNav } from './mobile-nav';

@Component({
  selector: 'app-owner-layout',
  imports: [RouterOutlet, OwnerMobileNav],
  template: `
    <div class="min-h-screen bg-background pb-20">
      <router-outlet />
      <app-owner-mobile-nav />
    </div>
  `,
})
export class OwnerLayout {}
