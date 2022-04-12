import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTransactionComponent } from './dialog-transaction.component';

describe('DialogTransactionComponent', () => {
  let component: DialogTransactionComponent;
  let fixture: ComponentFixture<DialogTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
