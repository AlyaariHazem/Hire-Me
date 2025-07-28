import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfile } from './company-profile';

describe('CompanyProfile', () => {
  let component: CompanyProfile;
  let fixture: ComponentFixture<CompanyProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
