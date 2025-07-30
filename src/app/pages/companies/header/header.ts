import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-company',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  isEmployerMenuOpen = false;

  constructor(private eRef: ElementRef) {}

  toggleEmployerMenu() {
    this.isEmployerMenuOpen = !this.isEmployerMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(target)) {
      this.isEmployerMenuOpen = false;
    }
  }
}
