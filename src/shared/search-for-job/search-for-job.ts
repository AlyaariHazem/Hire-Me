import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-for-job',
  standalone: false,
  templateUrl: './search-for-job.html',
  styleUrls: ['./search-for-job.scss'],
})
export class SearchForJob {
  toastr = inject(ToastrService);
  originalCompaniesData = [
    {
      id: 'tech-solutions',
      name: 'شركة التقنيات المتقدمة',
      industry: 'تقنية المعلومات',
      location: 'صنعاء',
      logo: 'images/company-logo-1.jpg',
      description:
        'شركة رائدة في مجال تطوير البرمجيات وحلول تقنية المعلومات، تقدم خدمات متميزة للشركات والمؤسسات.',
      employees: 150,
      openJobs: 5,
      followers: 1200,
      tags: ['تطوير البرمجيات', 'تصميم المواقع', 'تطبيقات الجوال'],
      size: 'medium',
      featured: true,
      following: true,
    },
    {
      id: 'health-care',
      name: 'مستشفى الأمل',
      industry: 'الرعاية الصحية',
      location: 'عدن',
      logo: 'images/company-logo-2.png',
      description:
        'مستشفى متخصص يقدم خدمات طبية شاملة بأحدث التقنيات والمعدات الطبية المتطورة.',
      employees: 300,
      openJobs: 8,
      followers: 850,
      tags: ['طب عام', 'جراحة', 'تمريض', 'صيدلة'],
      size: 'medium',
      featured: true,
      following: true,
    },
    {
      id: 'education-center',
      name: 'مركز التعليم الحديث',
      industry: 'التعليم',
      location: 'تعز',
      logo: 'images/company-logo-3.jpg',
      description:
        'مركز تعليمي متطور يقدم برامج تعليمية وتدريبية متنوعة لجميع الأعمار والمستويات.',
      employees: 80,
      openJobs: 3,
      followers: 650,
      tags: ['تعليم', 'تدريب', 'تطوير المهارات'],
      size: 'small',
      featured: true,
      following: true,
    },
    {
      id: 'construction-co',
      name: 'شركة البناء والتطوير',
      industry: 'البناء والتشييد',
      location: 'الحديدة',
      logo: 'images/company-logo-4.jpg',
      description:
        'شركة متخصصة في مشاريع البناء والتطوير العقاري، تنفذ مشاريع سكنية وتجارية متميزة.',
      employees: 500,
      openJobs: 12,
      followers: 2100,
      tags: ['بناء', 'تطوير عقاري', 'هندسة مدنية'],
      size: 'large',
      featured: true,
      following: true,
    },
    {
      id: 'finance-bank',
      name: 'البنك التجاري اليمني',
      industry: 'المالية والمصرفية',
      location: 'صنعاء',
      logo: 'images/company-logo-1.jpg',
      description:
        'بنك رائد يقدم خدمات مصرفية شاملة للأفراد والشركات بأعلى معايير الجودة والأمان.',
      employees: 800,
      openJobs: 6,
      followers: 3200,
      tags: ['خدمات مصرفية', 'تمويل', 'استثمار'],
      size: 'large',
      featured: false,
      following: false,
    },
    {
      id: 'retail-store',
      name: 'مجموعة المتاجر الحديثة',
      industry: 'التجارة والبيع بالتجزئة',
      location: 'عدن',
      logo: 'images/company-logo-2.png',
      description:
        'سلسلة متاجر حديثة تقدم منتجات متنوعة عالية الجودة بأسعار تنافسية.',
      employees: 200,
      openJobs: 4,
      followers: 950,
      tags: ['بيع بالتجزئة', 'خدمة العملاء', 'إدارة المخازن'],
      size: 'medium',
      featured: false,
      following: false,
    },
  ];

  companiesData = [...this.originalCompaniesData];
  notImplemented(){
    this.toastr.info('هذه الميزة غير متوفرة حالياً', 'لم يتم التنفيذ');
  }
   mobileOpen = false;
  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
    document.body.classList.toggle('no-scroll', this.mobileOpen);
  }
  closeMobileMenu() {
    if (this.mobileOpen) {
      this.mobileOpen = false;
      document.body.classList.remove('no-scroll');
    }
  }

  industryFilter = '';
  locationFilter = '';
  sizeFilter = '';
  searchTerm = '';

  constructor(private router: Router) {}

  viewCompany(companyId: string) {
    this.closeMobileMenu();
    this.router.navigate(['/companies/company-profile']);
  }

  applyFilters() {
    this.companiesData = this.originalCompaniesData.filter(company =>
      (this.industryFilter ? company.industry === this.industryFilter : true) &&
      (this.locationFilter ? company.location === this.locationFilter : true) &&
      (this.sizeFilter ? company.size === this.sizeFilter : true) &&
      (this.searchTerm
        ? (company.name + ' ' + company.description).toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        : true)
    );
  }

  toggleFollow(companyId: string) {
    const c = this.companiesData.find(x => x.id === companyId);
    if (c) c.following = !c.following;
  }
}
