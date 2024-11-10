import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalResponse } from 'src/app/core/models/enum';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TableComponent } from 'src/app/dashboard/events/event-details/table/table.component';
import {
  newInviteMock,
  fullInvitesGroupsMock,
  messageResponseMock,
} from 'src/tests/mocks/mocks';

describe('Table Component (Integrated Test)', () => {
  let fixture: ComponentFixture<TableComponent>;
  let invitesServiceSpy: jasmine.SpyObj<InvitesService>;
  let commonModalServiceSpy: jasmine.SpyObj<CommonModalService>;

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', [
      'deleteInvite',
      'bulkDeleteInvites',
    ]);

    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['open']);

    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [DataTablesModule],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    invitesServiceSpy = TestBed.inject(
      InvitesService
    ) as jasmine.SpyObj<InvitesService>;

    commonModalServiceSpy = TestBed.inject(
      CommonModalService
    ) as jasmine.SpyObj<CommonModalService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    fixture.detectChanges();
  });

  it('should call openModal when delete button is clicked', () => {
    fixture.componentInstance.invites = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const buttons = table.queryAll(By.css('button'));
    const deleteButton = buttons[1];

    deleteButton.nativeElement.click();
    fixture.detectChanges();

    expect(commonModalServiceSpy.open)
      .withContext(
        'open method from CommonModalService should have been called'
      )
      .toHaveBeenCalled();
  });

  it('should call deleteInvite when delete button is clicked', () => {
    commonModalServiceSpy.open.and.returnValue(of(CommonModalResponse.Confirm));
    invitesServiceSpy.deleteInvite.and.returnValue(of(messageResponseMock));

    fixture.componentInstance.invites = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const buttons = table.queryAll(By.css('button'));
    const deleteButton = buttons[1];

    deleteButton.nativeElement.click();
    fixture.detectChanges();

    expect(invitesServiceSpy.deleteInvite)
      .withContext(
        'deleteInvite method from InvitesService should have been called'
      )
      .toHaveBeenCalled();
  });

  it('should call bulkDeleteInvites when delete invites button is clicked', () => {
    invitesServiceSpy.bulkDeleteInvites.and.returnValue(
      of(messageResponseMock)
    );

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: true,
        },
      ],
    };

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons[4];

    deleteButton.nativeElement.click();

    expect(invitesServiceSpy.bulkDeleteInvites)
      .withContext(
        'bulkDeleteInvites method from InvitesService should have been called'
      )
      .toHaveBeenCalled();
  });
});
