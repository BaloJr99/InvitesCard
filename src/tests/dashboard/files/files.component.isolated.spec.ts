import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { FilesComponent } from 'src/app/dashboard/files/files.component';

describe('Files Component (Isolated Test)', () => {
  let component: FilesComponent;

  beforeEach(() => {
    const eventsSpy = jasmine.createSpyObj('EventsService', [
      'getDropdownEvents',
    ]);
    const filesSpy = jasmine.createSpyObj('FilesService', ['']);
    eventsSpy.getDropdownEvents.and.returnValue(of([]));
    const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);
    const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    component = new FilesComponent(
      eventsSpy,
      filesSpy,
      fileReaderSpy,
      commonModalSpy,
      new FormBuilder(),
      toastrSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the initial values', () => {
    expect(component.events)
      .withContext('should have events to be an empty array')
      .toEqual([]);

    expect(component.eventSelected)
      .withContext('should have eventSelected to be undefined')
      .toBeUndefined();

    expect(component.scaleImageUrl)
      .withContext('should have scaleImageUrl to be an empty string')
      .toBe('');

    expect(component.filesUpdateForm)
      .withContext('should have imageUpdateForm to be defined')
      .toBeDefined();

    expect(component.saveFilesForm)
      .withContext('should have saveFilesForm to be defined')
      .toBeDefined();
  });
});
