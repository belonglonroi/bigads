import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareProjectsComponent } from './compare-projects.component';

describe('CompareProjectsComponent', () => {
  let component: CompareProjectsComponent;
  let fixture: ComponentFixture<CompareProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
