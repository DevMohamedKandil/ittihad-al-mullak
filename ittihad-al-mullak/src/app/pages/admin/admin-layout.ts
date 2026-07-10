import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from './sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSidebar],
  template: `
    <div class="min-h-screen bg-background">
      <app-admin-sidebar />
      <main class="lg:pr-72 min-h-screen">
        <div class="p-4 lg:p-8">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class AdminLayout {}
