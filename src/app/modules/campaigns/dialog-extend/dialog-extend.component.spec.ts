import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExtendComponent } from './dialog-extend.component';

describe('DialogExtendComponent', () => {
  let component: DialogExtendComponent;
  let fixture: ComponentFixture<DialogExtendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogExtendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
