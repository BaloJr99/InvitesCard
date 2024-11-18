import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IEventAction } from 'src/app/core/models/events';
import { IUserDropdownData } from 'src/app/core/models/users';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { CommonModalService } from 'src/app/core/services/commonModal.service';
import {
  CommonModalResponse,
  CommonModalType,
  EventType,
} from 'src/app/core/models/enum';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
})
export class EventModalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private eventAction: IEventAction | undefined;
  @Input() set eventActionValue(value: IEventAction | undefined) {
    if (value) {
      this.eventAction = value;

      this.createEventForm.patchValue({
        ...value.event,
        dateOfEvent: value.event.dateOfEvent.split('T')[0],
        maxDateOfConfirmation: value.event.maxDateOfConfirmation.split('T')[0],
      });

      if (!value.isNew) {
        this.originalEventType = value.event.typeOfEvent;
      }
    }
  }

  @Output() updateEvents: EventEmitter<IEventAction> = new EventEmitter();

  createEventForm: FormGroup = this.fb.group({
    id: [''],
    nameOfEvent: ['', Validators.required],
    dateOfEvent: ['', Validators.required],
    maxDateOfConfirmation: ['', Validators.required],
    nameOfCelebrated: ['', Validators.required],
    typeOfEvent: ['', Validators.required],
    userId: ['', Validators.required],
  });

  originalEventType: EventType | undefined = undefined;
  users: IUserDropdownData[] = [];
  userEmptyMessage = '';

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private eventsService: EventsService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonModalService: CommonModalService,
    private cd: ChangeDetectorRef
  ) {
    this.validationMessages = {
      nameOfEvent: {
        required: $localize`Ingresar nombre del evento`,
      },
      dateOfEvent: {
        required: $localize`Ingresar fecha del evento`,
      },
      maxDateOfConfirmation: {
        required: $localize`Ingresar fecha límite de confirmación`,
      },
      nameOfCelebrated: {
        required: $localize`Ingresar nombre del festejado o festejados`,
      },
      typeOfEvent: {
        required: $localize`Seleccionar tipo de evento`,
      },
      userId: {
        required: $localize`Seleccionar usuario`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    $('#eventModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    });

    $('#eventModal').on('show.bs.modal', () => {
      this.loaderService.setLoading(true, $localize`Cargando usuarios`);

      this.usersService
        .getUsersDropdownData()
        .subscribe({
          next: (users) => {
            this.users = users;
            if (users.length === 0) {
              this.userEmptyMessage = $localize`No hay usuarios disponibles`;
            } else {
              this.userEmptyMessage = '';
            }
            this.cd.detectChanges();
          },
        })
        .add(() => this.loaderService.setLoading(false));
    });
  }

  saveEvent() {
    if (this.createEventForm.valid && this.createEventForm.dirty) {
      if (
        this.createEventForm.controls['id'].value !== '' &&
        this.originalEventType
      ) {
        const weddingEventTypes = [EventType.Wedding, EventType.SaveTheDate];
        if (
          (weddingEventTypes.includes(this.originalEventType) &&
            this.createEventForm.controls['typeOfEvent'].value ===
              EventType.Xv) ||
          (this.originalEventType === EventType.Xv &&
            weddingEventTypes.includes(
              this.createEventForm.controls['typeOfEvent'].value
            ))
        ) {
          this.commonModalService
            .open({
              modalTitle: $localize`Sobreescribiendo evento`,
              modalBody: $localize`Usted esta cambiando el tipo de evento por uno que no es compatible, ¿está seguro de sobreescribir el evento ${this.createEventForm.controls['nameOfEvent'].value}? Esto causará que se borre la información capturada por los invitados y las configuraciones.`,
              modalType: CommonModalType.Confirm,
            })
            .subscribe((response) => {
              if (response === CommonModalResponse.Confirm) {
                this.updateEvent(true);
              } else {
                this.createEventForm.controls['typeOfEvent'].setValue(
                  this.originalEventType
                );
              }
            });
        } else {
          this.updateEvent();
        }
      } else {
        this.createEvent();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.createEventForm,
        true
      );
    }
  }

  createEvent() {
    this.loaderService.setLoading(true, $localize`Creando evento`);
    this.eventsService
      .createEvent(this.createEventForm.value)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateEvents.emit({
            event: {
              ...this.createEventForm.value,
              dateOfEvent: `${this.createEventForm.value.dateOfEvent}T00:00:00.000`,
              maxDateOfConfirmation: `${this.createEventForm.value.maxDateOfConfirmation}T00:00:00.000`,
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
          $('#eventModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateEvent(override: boolean = false) {
    this.loaderService.setLoading(true, $localize`Actualizando evento`);
    this.eventsService
      .updateEvent(
        this.createEventForm.value,
        this.createEventForm.controls['id'].value,
        override
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateEvents.emit({
            event: {
              ...this.createEventForm.value,
              dateOfEvent: `${this.createEventForm.value.dateOfEvent}T00:00:00.000`,
              maxDateOfConfirmation: `${this.createEventForm.value.maxDateOfConfirmation}T00:00:00.000`,
              allowCreateInvites: override
                ? false
                : this.eventAction?.event.allowCreateInvites,
            },
            isNew: false,
          });
          this.toastr.success(response.message);
          $('#eventModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  clearInputs(): void {
    this.createEventForm.reset({
      id: '',
      nameOfEvent: '',
      dateOfEvent: '',
      maxDateOfConfirmation: '',
      nameOfCelebrated: '',
      typeOfEvent: '',
      userId: '',
    });

    this.createEventForm.enable();

    this.displayMessage = {};
    this.eventAction = undefined;
    this.originalEventType = undefined;

    $('#eventId').val('');
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEventForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(
        this.createEventForm
      );
    });
  }
}
