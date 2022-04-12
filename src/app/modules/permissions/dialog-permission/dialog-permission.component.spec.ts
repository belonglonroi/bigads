import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPermissionComponent } from './dialog-permission.component';

describe('DialogPermissionComponent', () => {
  let component: DialogPermissionComponent;
  let fixture: ComponentFixture<DialogPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
