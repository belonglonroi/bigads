import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrtherServiceComponent } from './dialog-orther-service.component';

describe('DialogOrtherServiceComponent', () => {
  let component: DialogOrtherServiceComponent;
  let fixture: ComponentFixture<DialogOrtherServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogOrtherServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrtherServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
