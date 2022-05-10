import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenCodeComponent } from './gen-code.component';

describe('GenCodeComponent', () => {
  let component: GenCodeComponent;
  let fixture: ComponentFixture<GenCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
