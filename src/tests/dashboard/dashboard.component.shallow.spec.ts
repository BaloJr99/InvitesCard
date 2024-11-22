import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { messagesMock, userMock } from '../mocks/mocks';
import { Subject } from 'rxjs';
import { IMessage, INotification } from 'src/app/core/models/common';
import { By } from '@angular/platform-browser';

describe('Dashboard Component (Shallow Test)', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;
  let messagesDataSubject: Subject<IMessage[]>;
  let notificationsDataSubject: Subject<INotification[]>;

  beforeEach(waitForAsync(() => {
    messagesDataSubject = new Subject<IMessage[]>();
    notificationsDataSubject = new Subject<INotification[]>();
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'getTokenValues',
    ]);
    const commonInvitesSpy = jasmine.createSpyObj(
      'CommonInvitesService',
      [''],
      {
        messages$: messagesDataSubject.asObservable(),
        notifications$: notificationsDataSubject.asObservable(),
      }
    );

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: CommonInvitesService, useValue: commonInvitesSpy },
      ],
    }).compileComponents();

    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;
  }));

  beforeEach(() => {
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMock);
    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should have a messages-chat', () => {
    const messagesChat = fixture.debugElement.query(By.css('.messages-chat'));
    const noMessages = messagesChat.query(By.css('.card'));

    expect(messagesChat)
      .withContext('Messages chat should exist')
      .not.toBeNull();
    expect(noMessages.nativeElement.textContent)
      .withContext('No messages card should exist')
      .toContain('No hay mensajes');
  });

  it('should have 1 message in the messages-chat', () => {
    messagesDataSubject.next(messagesMock);
    fixture.detectChanges();

    const messagesChat = fixture.debugElement.query(By.css('.messages-chat'));
    const messages = messagesChat.queryAll(By.css('.message'));

    expect(messages.length).withContext('Messages chat should exist').toBe(1);

    expect(Object.keys(fixture.componentInstance.messagesGrouped).length)
      .withContext('Messages grouped should have one group')
      .toBe(1);
    expect(fixture.componentInstance.messagesGrouped[0].value.length)
      .withContext('Messages grouped should contain 1 message')
      .toBe(1);
    expect(fixture.componentInstance.messagesGrouped[0].value)
      .withContext('Messages grouped should contain the message')
      .toEqual(messagesMock);

    const messageDate = messages[0].query(By.css('.message-date'));
    const messageCard = messages[0].query(By.css('.card'));
    const messageTime = messageCard.query(By.css('.message-time'));
    const messageFamily = messageCard.query(By.css('p'));
    const messageContent = messageCard.query(By.css('.chat-message'));

    expect(messageDate.nativeElement.textContent)
      .withContext('Message date should be 01/01/2021')
      .toContain(messagesMock[0].date);
    expect(messageTime.nativeElement.textContent)
      .withContext('Message time should be 12:00')
      .toContain(messagesMock[0].time);
    expect(messageFamily.nativeElement.textContent)
      .withContext('Message family should be Familia')
      .toContain(messagesMock[0].family);
    expect(messageContent.nativeElement.textContent)
      .withContext('Message content should be Hola')
      .toContain(messagesMock[0].message);
  });
});
