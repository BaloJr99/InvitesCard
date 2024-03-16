import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';
import { IEvent, IEventAction, IMessageResponse } from 'src/shared/interfaces';
import { EventsService } from 'src/core/services/events.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class EventModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  @Input() eventAction!: IEventAction;
  @Output() updateEvents: EventEmitter<IEventAction> = new EventEmitter();
  
  createEventForm!: FormGroup;
  errorMessage = '';
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private eventsService: EventsService, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loadingService: LoaderService) { 
    this.validationMessages = {
      nameOfEvent: {
        required: 'Ingresar nombre del evento'
      },
      dateOfEvent: {
        required: 'Ingresar fecha del evento'
      },
      maxDateOfConfirmation: {
        required: 'Ingresar fecha límite de confirmación',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createEventForm = this.fb.group({
      id: [''],
      nameOfEvent: ['', Validators.required],
      dateOfEvent: ['', Validators.required],
      maxDateOfConfirmation: ['', Validators.required]
    })
    
    $('#eventModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["eventAction"] && changes["eventAction"].currentValue) {
      const event: IEvent = changes["eventAction"].currentValue.event;
      this.createEventForm.patchValue({ 
        id: event.id,
        nameOfEvent: event.nameOfEvent,
        dateOfEvent: this.convertDate(event.dateOfEvent),
        maxDateOfConfirmation: this.convertDate(event.maxDateOfConfirmation)
      })
    }
  }

  convertDate(date: string): string {
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 16);
  }

  saveEvent() {
    if (this.createEventForm.valid) {
      if (this.createEventForm.dirty) {
        if (this.createEventForm.controls["id"].value !== "") {
          this.updateEvent();
        } else {
          this.createEvent();
        }
      } else {
        $("#eventModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEventForm, true);
    }
  }

  createEvent() {
    this.loadingService.setLoading(true);
    this.eventsService.createEvent(this.formatEvent()).subscribe({
      next: (response: IMessageResponse) => {
        $("#eventModal").modal('hide');
        this.updateEvents.emit({
          event: {
            ...this.formatEvent(),
            id: response.id
          },
          isNew: true
        });
        this.toastr.success(response.message);
      }
    }).add(() => {
      this.loadingService.setLoading(false);
    });
  }

  updateEvent() {
    this.loadingService.setLoading(true);
    this.eventsService.updateEvent(this.formatEvent(), this.createEventForm.controls["id"].value).subscribe({
      next: (response: IMessageResponse) => {
        $("#eventModal").modal('hide');
        this.updateEvents.emit({
          event: this.formatEvent(),
          isNew: false
        });
        this.toastr.success(response.message);
      }
    }).add(() => {
      this.loadingService.setLoading(false);
    });
  }

  clearInputs(): void {
    this.createEventForm.reset({
      id: '',
      nameOfEvent: '',
      dateOfEvent: '',
      maxDateOfConfirmation: ''
    });

    this.displayMessage = {};
    
    $("#eventId").val("");
  }

  formatEvent(): IEvent {
    return {
      ...this.createEventForm.value,
      dateOfEvent: `${this.createEventForm.get("dateOfEvent")?.value}:00Z`,
      maxDateOfConfirmation: `${this.createEventForm.get("maxDateOfConfirmation")?.value}:00Z`,
    } as IEvent
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEventForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createEventForm);
    });
  }
}
