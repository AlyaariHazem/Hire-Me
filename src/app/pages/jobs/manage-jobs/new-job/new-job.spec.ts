import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewJob } from './new-job';

describe('NewJob', () => {
  let component: NewJob;
  let fixture: ComponentFixture<NewJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
