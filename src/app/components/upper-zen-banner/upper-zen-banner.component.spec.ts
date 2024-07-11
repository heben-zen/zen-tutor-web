import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperZenBannerComponent } from './upper-zen-banner.component';

describe('UpperZenBannerComponent', () => {
  let component: UpperZenBannerComponent;
  let fixture: ComponentFixture<UpperZenBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpperZenBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpperZenBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
