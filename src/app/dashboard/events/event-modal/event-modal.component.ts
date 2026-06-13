import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IEventAction, IFullEvent } from 'src/app/core/models/events';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { CommonModalService } from 'src/app/core/services/common-modal.service';
import {
  CommonModalResponse,
  CommonModalType,
  EventType,
} from 'src/app/core/models/enum';
import { dateToUTCDate } from 'src/app/shared/utils/tools';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../shared/pipes/validation-error.pipe';
import { CommonModule } from '@angular/common';
import { EventTypesService } from 'src/app/core/services/event-types.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationErrorPipe,
    ValidationPipe,
  ],
})
export class EventModalComponent {
  private eventsService = inject(EventsService);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private commonModalService = inject(CommonModalService);
  private eventTypesService = inject(EventTypesService);

  private baseEvent = {
    id: '',
    nameOfEvent: '',
    dateOfEvent: '',
    maxDateOfConfirmation: '',
    nameOfCelebrated: '',
    eventTypeId: '',
    userId: '',
  };

  private eventAction = new BehaviorSubject<IEventAction>({
    event: { ...this.baseEvent },
    isNew: true,
  } as IEventAction);
  eventAction$ = this.eventAction.asObservable();

  @Input() set eventActionValue(value: IEventAction) {
    this.eventAction.next(value);
  }

  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  @Output() updateEvents: EventEmitter<IEventAction> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  private dictionaryEventTypes: Record<string, EventType> = {};

  createEventForm: FormGroup = this.fb.group({
    id: [''],
    nameOfEvent: ['', Validators.required],
    dateOfEvent: ['', Validators.required],
    maxDateOfConfirmation: ['', Validators.required],
    nameOfCelebrated: ['', Validators.required],
    eventTypeId: ['', Validators.required],
    userId: ['', Validators.required],
  });

  originalEventType: EventType | undefined = undefined;
  userEmptyMessage = '';

  vm$ = combineLatest([
    this.showModal$,
    this.usersService.getUsersDropdownData(),
    this.eventTypesService.getEventTypes(),
    this.eventAction$,
  ]).pipe(
    map(([showModal, users, eventTypes, eventAction]) => {
      this.dictionaryEventTypes = eventTypes.reduce<Record<string, EventType>>(
        (dict, eventType) => {
          dict[eventType.id] = eventType.name as EventType;
          return dict;
        },
        {},
      );

      this.createEventForm.patchValue({
        ...eventAction.event,
        dateOfEvent: eventAction.event.dateOfEvent.split('T')[0],
        maxDateOfConfirmation:
          eventAction.event.maxDateOfConfirmation.split('T')[0],
      });

      if (!eventAction.isNew) {
        // Guardamos el tipo de evento original para validar cambios posteriores
        this.originalEventType =
          this.dictionaryEventTypes[eventAction.event.eventTypeId];
      }

      if (showModal) {
        $('#eventModal').modal('show');
        $('#eventModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        this.clearInputs();
        $('#eventModal').modal('hide');
      }

      if (users.length === 0) {
        this.userEmptyMessage = $localize`No hay usuarios disponibles`;
      } else {
        this.userEmptyMessage = '';
      }

      return {
        users,
        eventTypes,
      };
    }),
  );

  saveEvent() {
    if (this.createEventForm.valid && this.createEventForm.dirty) {
      if (
        this.createEventForm.controls['id'].value !== '' &&
        this.originalEventType
      ) {
        const weddingEventTypes = [EventType.Wedding, EventType.SaveTheDate];
        const currentEventType =
          this.dictionaryEventTypes[
            this.createEventForm.controls['eventTypeId'].value
          ];
        if (
          (weddingEventTypes.includes(this.originalEventType) &&
            currentEventType === EventType.Xv) ||
          (this.originalEventType === EventType.Xv &&
            weddingEventTypes.includes(currentEventType))
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
                // Let's find the original event type id based on the original event type name
                const originalEventTypeId = Object.keys(
                  this.dictionaryEventTypes,
                ).find(
                  (key) =>
                    this.dictionaryEventTypes[key] === this.originalEventType,
                );
                this.createEventForm.controls['eventTypeId'].setValue(
                  originalEventTypeId,
                );
              }
            });
        } else {
          this.updateEvent(
            false,
            this.originalEventType === EventType.SaveTheDate &&
              currentEventType === EventType.Wedding,
          );
        }
      } else {
        this.createEvent();
      }
    } else {
      this.createEventForm.markAllAsTouched();
    }
  }

  createEvent() {
    this.eventsService
      .createEvent(this.formatEvent(this.createEventForm.value))
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateEvents.emit({
            event: {
              ...this.createEventForm.value,
              dateOfEvent: `${this.createEventForm.value.dateOfEvent}T00:00:00`,
              maxDateOfConfirmation: `${this.createEventForm.value.maxDateOfConfirmation}T00:00:00`,
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
        },
      });
  }

  formatEvent(event: IFullEvent): IFullEvent {
    return {
      ...event,
      dateOfEvent: dateToUTCDate(event.dateOfEvent),
      maxDateOfConfirmation: dateToUTCDate(event.maxDateOfConfirmation),
    };
  }

  updateEvent(override: boolean = false, overrideViewed: boolean = false) {
    this.eventsService
      .updateEvent(
        this.formatEvent(this.createEventForm.value),
        this.createEventForm.controls['id'].value,
        override,
        overrideViewed,
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateEvents.emit({
            event: {
              ...this.createEventForm.value,
              dateOfEvent: `${this.createEventForm.value.dateOfEvent}T00:00:00`,
              maxDateOfConfirmation: `${this.createEventForm.value.maxDateOfConfirmation}T00:00:00`,
            },
            isNew: false,
          });
          this.toastr.success(response.message);
        },
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

    this.originalEventType = undefined;
  }
}
