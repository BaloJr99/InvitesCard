import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
import { IEventAction, IFullEvent } from 'src/app/core/models/events';
import { IUserDropdownData } from 'src/app/core/models/users';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { EventsService } from 'src/app/core/services/events.service';
import { UsersService } from 'src/app/core/services/users.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
})
export class EventModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() eventAction!: IEventAction;
  @Output() updateEvents: EventEmitter<IEventAction> = new EventEmitter();

  createEventForm!: FormGroup;
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
    this.createEventForm = this.fb.group({
      id: [''],
      nameOfEvent: ['', Validators.required],
      dateOfEvent: ['', Validators.required],
      maxDateOfConfirmation: ['', Validators.required],
      nameOfCelebrated: ['', Validators.required],
      typeOfEvent: ['', Validators.required],
      userId: ['', Validators.required],
    });

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventAction'] && changes['eventAction'].currentValue) {
      const event: IFullEvent = changes['eventAction'].currentValue.event;
      this.createEventForm.patchValue({
        ...event,
      });
    }
  }

  saveEvent() {
    if (this.createEventForm.valid && this.createEventForm.dirty) {
      if (this.createEventForm.controls['id'].value !== '') {
        this.updateEvent();
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
      .createEvent(this.formatEvent())
      .subscribe({
        next: (response: IMessageResponse) => {
          $('#eventModal').modal('hide');
          this.updateEvents.emit({
            event: {
              ...this.formatEvent(),
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateEvent() {
    this.loaderService.setLoading(true, $localize`Actualizando evento`);
    this.eventsService
      .updateEvent(
        this.formatEvent(),
        this.createEventForm.controls['id'].value
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          $('#eventModal').modal('hide');
          this.updateEvents.emit({
            event: this.formatEvent(),
            isNew: false,
          });
          this.toastr.success(response.message);
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

    this.displayMessage = {};

    $('#eventId').val('');
  }

  formatEvent(): IFullEvent {
    return {
      ...this.createEventForm.value,
      dateOfEvent: `${this.createEventForm.get('dateOfEvent')?.value}:00Z`,
      maxDateOfConfirmation: `${
        this.createEventForm.get('maxDateOfConfirmation')?.value
      }:00Z`,
    } as IFullEvent;
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
