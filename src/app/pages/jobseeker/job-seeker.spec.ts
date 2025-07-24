import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeeker } from './job-seeker/job-seeker';

describe('JobSeeker', () => {
  let component: JobSeeker;
  let fixture: ComponentFixture<JobSeeker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeeker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeeker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
