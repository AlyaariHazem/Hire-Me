# Breadcrumb Component

A reusable breadcrumb navigation component using PrimeNG v20 for the entire system.

## Usage

### Basic Usage

Simply add the component to any template:

```html
<app-breadcrumb></app-breadcrumb>
```

### Automatic Breadcrumbs from Routes

To enable automatic breadcrumbs from routes, add `breadcrumb` data to your route configuration:

```typescript
{
  path: 'profile',
  component: ProfileComponent,
  data: { breadcrumb: 'الملف الشخصي' }
}
```

### Manual Breadcrumbs

You can also set breadcrumbs manually using the `BreadcrumbService`:

```typescript
import { BreadcrumbService } from 'shared/services/breadcrumb.service';
import { MenuItem } from 'primeng/api';

export class MyComponent {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    const items: MenuItem[] = [
      { label: 'الوظائف', routerLink: '/jobs' },
      { label: 'تفاصيل الوظيفة', routerLink: '/jobs/123' }
    ];
    this.breadcrumbService.setBreadcrumbs(items);
  }
}
```

### Custom Home Item

To customize the home icon:

```typescript
this.breadcrumbService.setHomeItem({
  icon: 'pi pi-home',
  routerLink: '/dashboard',
  label: 'لوحة التحكم'
});
```

## Examples

### In Job Seeker Profile Page

```html
<div class="page-header">
  <app-breadcrumb></app-breadcrumb>
  <h1>الملف الشخصي</h1>
</div>
```

### In Company Dashboard

```html
<div class="container">
  <app-breadcrumb></app-breadcrumb>
  <!-- Your content here -->
</div>
```

## Route Configuration Example

```typescript
const routes: Routes = [
  {
    path: 'jobseeker',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: 'الملف الشخصي' }
      },
      {
        path: 'cv',
        component: CVComponent,
        data: { breadcrumb: 'السيرة الذاتية' }
      }
    ]
  }
];
```

