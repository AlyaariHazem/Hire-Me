import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../services/breadcrumb.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  private breadcrumbService = inject(BreadcrumbService);
  private destroy$ = new Subject<void>();

  items: MenuItem[] = [];
  home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/',
    label: 'الرئيسية',
  };

  ngOnInit(): void {
    this.home = this.breadcrumbService.getHomeItem();
    this.breadcrumbService.breadcrumbs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
      });
  }

  onRefresh(): void {
    this.breadcrumbService.triggerRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

