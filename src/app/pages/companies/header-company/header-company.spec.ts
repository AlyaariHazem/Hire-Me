import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCompany } from './header-company';

describe('HeaderCompany', () => {
  let component: HeaderCompany;
  let fixture: ComponentFixture<HeaderCompany>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCompany]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCompany);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
