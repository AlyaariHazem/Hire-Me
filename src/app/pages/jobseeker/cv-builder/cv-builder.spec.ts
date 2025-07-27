import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvBuilder } from './cv-builder';

describe('CvBuilder', () => {
  let component: CvBuilder;
  let fixture: ComponentFixture<CvBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
