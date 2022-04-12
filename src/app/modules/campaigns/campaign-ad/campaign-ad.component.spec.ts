import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignAdComponent } from './campaign-ad.component';

describe('CampaignAdComponent', () => {
  let component: CampaignAdComponent;
  let fixture: ComponentFixture<CampaignAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignAdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
