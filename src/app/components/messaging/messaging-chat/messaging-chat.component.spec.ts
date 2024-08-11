import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingChatComponent } from './messaging-chat.component';

describe('MessagingChatComponent', () => {
  let component: MessagingChatComponent;
  let fixture: ComponentFixture<MessagingChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagingChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
