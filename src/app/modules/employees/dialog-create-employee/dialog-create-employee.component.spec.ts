import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateEmployeeComponent } from './dialog-create-employee.component';

describe('DialogCreateEmployeeComponent', () => {
  let component: DialogCreateEmployeeComponent;
  let fixture: ComponentFixture<DialogCreateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
