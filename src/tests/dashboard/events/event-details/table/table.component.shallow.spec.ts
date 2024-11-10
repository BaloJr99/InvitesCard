import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { InvitesService } from 'src/app/core/services/invites.service';
import { TableComponent } from 'src/app/dashboard/events/event-details/table/table.component';
import {
  newInviteMock,
  fullInvitesGroupsMock,
  confirmedInviteMock,
} from 'src/tests/mocks/mocks';

describe('Table Component (Shallow Test)', () => {
  let fixture: ComponentFixture<TableComponent>;

  const markCheckbox = (rowIndex: number) => {
    const table = fixture.debugElement.query(By.css('table'));
    const checkboxes = table.queryAll(By.css('tbody input[type="checkbox"]'));
    const checkbox = checkboxes[rowIndex];

    checkbox.nativeElement.click();
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    const invitesSpy = jasmine.createSpyObj('InvitesService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    TestBed.configureTestingModule({
      declarations: [TableComponent],
      providers: [
        { provide: InvitesService, useValue: invitesSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      imports: [DataTablesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    fixture.detectChanges();
  });

  it("shouldn't create a table", () => {
    const table = fixture.debugElement.nativeElement;
    expect(table).not.toBeNull();
  });

  it('should create a table with thead and tbody', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.nativeElement;
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    expect(thead).not.toBeNull();
    expect(tbody).not.toBeNull();
  });

  it('should create a table with 1 row and a delete invites button', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.queryAll(By.css('tbody tr'));
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons[4];

    expect(rows.length).withContext('Table should have 1 row').toBe(1);
    expect(deleteButton.nativeElement.textContent)
      .withContext('Delete button should contain "Eliminar Invitaciones')
      .toContain('Eliminar Invitaciones');
  });

  it('should create a table with 1 row and 6 columns', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const columns = rows[0].queryAll(By.css('td'));

    expect(columns.length).toBe(5);
  });

  it('should create a table with the right content', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const columns = rows[0].queryAll(By.css('td'));

    expect(columns[0].nativeElement.innerHTML)
      .withContext('First column should have a checkbox')
      .toContain('checkbox');

    expect(columns[1].nativeElement.textContent)
      .withContext('Second column should have family')
      .toBe(newInviteMock.family);

    expect(columns[2].nativeElement.textContent)
      .withContext(
        'Third column should have entries confirmed / entries number'
      )
      .toBe(`0 / ${newInviteMock.entriesNumber}`);

    expect(columns[3].nativeElement.innerHTML)
      .withContext("Fourth column should't have an eye")
      .not.toContain('fa-eye');

    const buttons = columns[4].queryAll(By.css('button'));

    expect(buttons.length)
      .withContext('Fifth column should have 2 buttons')
      .toBe(3);

    expect(buttons[0].nativeElement.innerHTML)
      .withContext('First button should have a pencil icon')
      .toContain('fa-pen-to-square');

    expect(buttons[1].nativeElement.innerHTML)
      .withContext('Second button should have a trash icon')
      .toContain('fa-trash');

    expect(buttons[2].nativeElement.innerHTML)
      .withContext('Third button should have a copy icon')
      .toContain('fa-copy');
  });

  it('should have all the buttons disabled', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...confirmedInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons.forEach((button) => {
      expect(button.nativeElement.disabled)
        .withContext('Button should be disabled')
        .toBeTrue();
    });
  });

  it('first button should call editInvite', () => {
    const componentSpy = spyOn(fixture.componentInstance, 'openEditModal');

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[0].nativeElement.click();

    expect(componentSpy).toHaveBeenCalled();
  });

  it('second button should call showModal', () => {
    const componentSpy = spyOn(fixture.componentInstance, 'showModal');

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[1].nativeElement.click();

    expect(componentSpy).toHaveBeenCalled();
  });

  it('third button should call copyToClipBoard', () => {
    const componentSpy = spyOn(fixture.componentInstance, 'copyToClipBoard');

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const table = fixture.debugElement.query(By.css('table'));
    const rows = table.query(By.css('tbody')).queryAll(By.css('tr'));
    const buttons = rows[0].queryAll(By.css('button'));

    buttons[2].nativeElement.click();

    expect(componentSpy).toHaveBeenCalled();
  });

  it('deleteInvites should be disabled if there are no invites to delete', () => {
    const componentSpy = spyOn(fixture.componentInstance, 'bulkDeleteInvites');

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[4].nativeElement.click();

    expect(buttons[4].nativeElement.disabled)
      .withContext('Delete button should be disabled')
      .toBeTrue();

    expect(componentSpy)
      .withContext('deleteInvites should not be called')
      .not.toHaveBeenCalled();
  });

  it('should call deleteInvites', () => {
    const componentSpy = spyOn(fixture.componentInstance, 'bulkDeleteInvites');

    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          confirmation: null,
          beingDeleted: true,
        },
      ],
    };

    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[4].nativeElement.click();

    expect(componentSpy)
      .withContext('deleteInvites should be called')
      .toHaveBeenCalled();
  });

  it('markCheckbox should set the record beingDeleted to true ', () => {
    fixture.componentInstance.inviteGroup = {
      key: fullInvitesGroupsMock.inviteGroup,
      value: [
        {
          ...newInviteMock,
          beingDeleted: false,
        },
      ],
    };

    fixture.detectChanges();

    markCheckbox(0);

    expect(fixture.componentInstance.inviteGroup.value[0].beingDeleted)
      .withContext('Record should be marked for deletion')
      .toBeTrue();
  });
});
