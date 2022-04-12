import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCampaignAdComponent } from './dialog-campaign-ad.component';

describe('DialogCampaignAdComponent', () => {
  let component: DialogCampaignAdComponent;
  let fixture: ComponentFixture<DialogCampaignAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCampaignAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCampaignAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
