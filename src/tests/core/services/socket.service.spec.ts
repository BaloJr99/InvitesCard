import { TestBed } from '@angular/core/testing';
import { SocketService } from 'src/app/core/services/socket.service';
import { deepCopy } from 'src/app/shared/utils/tools';
import { confirmationInviteMock, fullUserMock } from 'src/tests/mocks/mocks';

const confirmationInviteMockCopy = deepCopy(confirmationInviteMock);
const fullUserMockCopy = deepCopy(fullUserMock);

describe('Socket Service', () => {
  let socketService: SocketService;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SocketService', [
      'joinRoom',
      'sendNotification',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: SocketService, useValue: spy }],
    });

    socketServiceSpy = TestBed.inject(
      SocketService
    ) as jasmine.SpyObj<SocketService>;
  });

  it('should be created', () => {
    socketService = TestBed.inject(SocketService);
    expect(socketService)
      .withContext('Expected Socket Service to have been created')
      .toBeTruthy();
  });

  it('should call joinRoom', () => {
    socketServiceSpy.joinRoom(fullUserMockCopy.username);

    expect(socketServiceSpy.joinRoom)
      .withContext('Expected joinRoom to have been called')
      .toHaveBeenCalledOnceWith(fullUserMockCopy.username);
  });

  it('should call sendNotification', () => {
    socketServiceSpy.sendNotification(confirmationInviteMockCopy);

    expect(socketServiceSpy.sendNotification)
      .withContext('Expected sendNotification to have been called')
      .toHaveBeenCalledOnceWith(confirmationInviteMockCopy);
  });
});
