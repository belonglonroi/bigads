import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDepartmentComponent } from './dialog-department.component';

describe('DialogDepartmentComponent', () => {
  let component: DialogDepartmentComponent;
  let fixture: ComponentFixture<DialogDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
