import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobs } from './manage-jobs';

describe('ManageJobs', () => {
  let component: ManageJobs;
  let fixture: ComponentFixture<ManageJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
