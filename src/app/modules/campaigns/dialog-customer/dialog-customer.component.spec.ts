import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCustomerComponent } from './dialog-customer.component';

describe('DialogCustomerComponent', () => {
  let component: DialogCustomerComponent;
  let fixture: ComponentFixture<DialogCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
