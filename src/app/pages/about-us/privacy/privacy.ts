import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedModule } from 'shared/shared-module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-privacy',
  imports: [SharedModule],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss'
})
export class Privacy implements AfterViewInit, OnDestroy {
  activeSection: 'terms' | 'privacy' = 'terms';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScripts();
      
      // Handle fragment navigation
      this.route.fragment.subscribe(fragment => {
        if (fragment) {
          if (fragment === 'privacy') {
            this.showSection('privacy');
          } else if (fragment === 'terms') {
            this.showSection('terms');
          }
          // Scroll to the section after a short delay to ensure DOM is ready
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      });
    }
  }

  ngOnDestroy() {
    // Cleanup is handled automatically
  }

  showSection(section: 'terms' | 'privacy') {
    this.activeSection = section;
  }

  scrollToLegalTabs() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById('legalTabs');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  private initScripts() {
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
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
      });
    });

    // Scroll event for navbar effect (throttled for performance)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
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
  }
}
