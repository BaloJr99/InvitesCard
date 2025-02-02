import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonInvitesService } from 'src/app/core/services/commonInvites.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { userMock } from '../mocks/mocks';
import { Subject } from 'rxjs';
import { IMessage, INotification } from 'src/app/core/models/common';
import { By } from '@angular/platform-browser';
import { deepCopy } from 'src/app/shared/utils/tools';

const userMockCopy = deepCopy(userMock);

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
    tokenStorageServiceSpy.getTokenValues.and.returnValue(userMockCopy);
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
});
