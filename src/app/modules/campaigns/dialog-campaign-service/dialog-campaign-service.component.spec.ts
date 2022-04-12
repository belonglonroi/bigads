import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCampaignServiceComponent } from './dialog-campaign-service.component';

describe('DialogCampaignServiceComponent', () => {
  let component: DialogCampaignServiceComponent;
  let fixture: ComponentFixture<DialogCampaignServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCampaignServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCampaignServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
