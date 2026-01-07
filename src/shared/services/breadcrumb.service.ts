import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AuthStateService } from 'app/auth/auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<MenuItem[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  // Refresh signal
  private refreshSubject = new Subject<void>();
  public refresh$ = this.refreshSubject.asObservable();

  private authState = inject(AuthStateService);

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  setHomeItem(item: MenuItem): void {
    // This method can still be used to override the default behavior
  }

  getHomeItem(): MenuItem {
    // Determine dashboard route based on user role
    const role = this.authState.role();
    let dashboardRoute = '/';
    
    if (role === 'employer') {
      dashboardRoute = '/companies/dashboard';
    } else if (role === 'jobseeker') {
      dashboardRoute = '/jobseeker/dashboard';
    }
    
    return {
      icon: 'pi pi-home',
      routerLink: dashboardRoute,
      label: 'الرئيسية',
    };
  }

  /**
   * Manually set breadcrumbs (useful for dynamic routes)
   */
  setBreadcrumbs(items: MenuItem[]): void {
    this.breadcrumbsSubject.next(items);
  }

  /**
   * Add a breadcrumb item
   */
  addBreadcrumb(item: MenuItem): void {
    const current = this.breadcrumbsSubject.value;
    this.breadcrumbsSubject.next([...current, item]);
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.breadcrumbsSubject.next([]);
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Check for breadcrumb data in route
      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, routerLink: url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}

