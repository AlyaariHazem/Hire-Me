import { Component, AfterViewInit, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedModule } from 'shared/shared-module';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CompanyService as CompanyDataService } from 'app/pages/companies/core/services/company.service';
import { JobService } from 'shared/services/job.service';
import { ApplicationService } from 'shared/services/application.service';

declare var AOS: any;

interface Statistics {
  totalJobs: number;
  totalCompanies: number;
  totalCVs: number;
}

@Component({
  selector: 'app-about-us',
  imports: [SharedModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss'
})
export class AboutUs implements OnInit, AfterViewInit, OnDestroy {
  private hasAnimated = false;
  
  statistics: Statistics = {
    totalJobs: 0,
    totalCompanies: 0,
    totalCVs: 0
  };
  
  loadingStats = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private companyDataService: CompanyDataService,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScripts();
    }
  }

  ngOnDestroy() {
    // Cleanup is handled automatically
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  private initScripts() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
      });
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]') as HTMLElement;
    if (cursorDot) {
      window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      });
    }

    // Hover Effect logic
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, details, input, textarea');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });

    // Counter animation will be triggered after stats load or when scrolling to section

    // Scroll event for counter animation and navbar effect (throttled for performance)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = document.getElementById('stats-section');
          if (section && !this.hasAnimated) {
            const sectionPosition = section.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (sectionPosition < screenPosition && !this.hasAnimated) {
              this.animateCounters();
              this.hasAnimated = true;
            }
          }

          // Navbar effect
          const navbar = document.getElementById('navbar');
          const navContainer = document.getElementById('nav-container');
          if (navbar && navContainer) {
            if (window.scrollY > 20) {
              navbar.classList.remove('py-4');
              navbar.classList.add('py-2');
              navContainer.classList.add('shadow-xl');
            } else {
              navbar.classList.add('py-4');
              navbar.classList.remove('py-2');
              navContainer.classList.remove('shadow-xl');
              navContainer.classList.add('shadow-lg');
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('open');
      });
    }
  }

  loadStatistics() {
    this.loadingStats = true;
    
    // Fetch companies count
    const companiesRequest = this.companyDataService.getAllCompanies({ page_size: 1 });
    
    // Fetch jobs count
    const jobsRequest = this.jobService.getJobs({ page_size: 1 });
    
    // Fetch applications count (as proxy for CVs) - catch error if not accessible
    const applicationsRequest = this.applicationService.getApplications({ page_size: 1 }).pipe(
      catchError(() => of({ count: 0 })) // Return 0 if endpoint requires auth or fails
    );

    forkJoin({
      companies: companiesRequest,
      jobs: jobsRequest,
      applications: applicationsRequest
    }).subscribe({
      next: (response) => {
        // Total companies
        this.statistics.totalCompanies = response.companies.count || 0;
        
        // Total jobs
        this.statistics.totalJobs = response.jobs.count || 0;
        
        // Total CVs/Resumes - using applications count as proxy
        // Each application typically means someone has created a CV
        this.statistics.totalCVs = response.applications.count || 0;
        
        this.loadingStats = false;
        
        // Update counter elements after stats are loaded
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.updateCounterTargets();
            // Check if section is visible and trigger animation
            const section = document.getElementById('stats-section');
            if (section) {
              const sectionPosition = section.getBoundingClientRect().top;
              const screenPosition = window.innerHeight / 1.3;
              if (sectionPosition < screenPosition && !this.hasAnimated) {
                this.animateCounters();
                this.hasAnimated = true;
              }
            }
          }, 200);
        }
      },
      error: (err) => {
        console.error('Failed to load statistics', err);
        this.loadingStats = false;
        // Keep default values (0) on error
      }
    });
  }

  private updateCounterTargets() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const statType = counter.getAttribute('data-stat');
      if (statType === 'jobs') {
        counter.setAttribute('data-target', this.statistics.totalJobs.toString());
        counter.textContent = '0';
      } else if (statType === 'companies') {
        counter.setAttribute('data-target', this.statistics.totalCompanies.toString());
        counter.textContent = '0';
      } else if (statType === 'cvs') {
        counter.setAttribute('data-target', this.statistics.totalCVs.toString());
        counter.textContent = '0';
      }
    });
  }

  private animateCounters() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200;

    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +(counter.getAttribute('data-target') || 0);
        const count = +counter.textContent!;
        const inc = target / counterSpeed;

        if (count < target) {
          counter.textContent = Math.ceil(count + inc).toString();
          setTimeout(updateCount, 5);
        } else {
          counter.textContent = target.toString();
        }
      };
      updateCount();
    });
  }
}
