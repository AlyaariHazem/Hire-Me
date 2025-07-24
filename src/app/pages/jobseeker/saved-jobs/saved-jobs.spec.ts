import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedJobs } from './saved-jobs';

describe('SavedJobs', () => {
  let component: SavedJobs;
  let fixture: ComponentFixture<SavedJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
