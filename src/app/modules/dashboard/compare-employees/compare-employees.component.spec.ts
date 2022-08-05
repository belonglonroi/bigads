import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareEmployeesComponent } from './compare-employees.component';

describe('CompareEmployeesComponent', () => {
  let component: CompareEmployeesComponent;
  let fixture: ComponentFixture<CompareEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
