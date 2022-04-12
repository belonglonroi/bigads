import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPromoteRoleComponent } from './dialog-promote-role.component';

describe('DialogPromoteRoleComponent', () => {
  let component: DialogPromoteRoleComponent;
  let fixture: ComponentFixture<DialogPromoteRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPromoteRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPromoteRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
