import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForJob } from './search-for-job';

describe('SearchForJob', () => {
  let component: SearchForJob;
  let fixture: ComponentFixture<SearchForJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchForJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchForJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
