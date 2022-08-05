import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareCategoriesComponent } from './compare-categories.component';

describe('CompareCategoriesComponent', () => {
  let component: CompareCategoriesComponent;
  let fixture: ComponentFixture<CompareCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
