import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import { EventsService } from 'src/app/core/services/events.service';
import { FileReaderService } from 'src/app/core/services/fileReader.service';
import { FilesService } from 'src/app/core/services/files.service';
import { FilesComponent } from 'src/app/dashboard/files/files.component';

describe('Files Component (Isolated Test)', () => {
  let component: FilesComponent;
  const eventsSpy = jasmine.createSpyObj('EventsService', [
    'getDropdownEvents',
  ]);
  const filesSpy = jasmine.createSpyObj('FilesService', ['']);
  const fileReaderSpy = jasmine.createSpyObj('FileReaderService', ['']);
  const commonModalSpy = jasmine.createSpyObj('CommonModalService', ['']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);
  const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

  beforeEach(() => {
    eventsSpy.getDropdownEvents.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: EventsService, useValue: eventsSpy },
        { provide: FilesService, useValue: filesSpy },
        { provide: FileReaderService, useValue: fileReaderSpy },
        { provide: CommonModalService, useValue: commonModalSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    component = TestBed.createComponent(FilesComponent).componentInstance;
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
