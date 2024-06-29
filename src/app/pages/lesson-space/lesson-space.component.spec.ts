import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSpaceComponent } from './lesson-space.component';

describe('LessonSpaceComponent', () => {
  let component: LessonSpaceComponent;
  let fixture: ComponentFixture<LessonSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonSpaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
