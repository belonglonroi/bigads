import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserOrganizationComponent } from './dialog-user-organization.component';

describe('DialogUserOrganizationComponent', () => {
  let component: DialogUserOrganizationComponent;
  let fixture: ComponentFixture<DialogUserOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUserOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
