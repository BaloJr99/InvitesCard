import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';
import { IEvent } from 'src/shared/interfaces';
import { EventsService } from 'src/core/services/events.service';
import { UpdateEventService } from '../update-event.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class EventModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Output() getEventToModify: EventEmitter<unknown> = new EventEmitter();
  @Input() eventToModify: IEvent | null = null;
  createEventForm!: FormGroup;
  errorMessage = '';
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private eventsService: EventsService, 
    private updateEventService: UpdateEventService,
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["eventToModify"].currentValue) {
      const { nameOfEvent, dateOfEvent, maxDateOfConfirmation } = changes["eventToModify"].currentValue;
      this.createEventForm.patchValue({ 
        nameOfEvent,
        dateOfEvent,
        maxDateOfConfirmation
      })
    }
  }

  ngOnInit(): void {
    this.createEventForm = this.fb.group({
      nameOfEvent: ['', Validators.required],
      dateOfEvent: ['', Validators.required],
      maxDateOfConfirmation: ['', Validators.required]
    })
    
    $('#eventModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    })
    
    $('#eventModal').on('show.bs.modal', () => {
      this.getEventToModify.emit();
    })
  }

  saveEvent() {
    if (this.createEventForm.valid) {
      if (this.createEventForm.dirty) {
        const id = $("#eventId").val();
        this.createEventForm.get("dateOfEvent")?.setValue(`${this.createEventForm.get("dateOfEvent")?.value}:00Z`);
        this.createEventForm.get("maxDateOfConfirmation")?.setValue(`${this.createEventForm.get("maxDateOfConfirmation")?.value}:00Z`);
        if (id && typeof(id) === "string") {
          this.updateEvent(id);
        } else {
          this.createEvent();
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEventForm, true);
    }
  }

  createEvent() {
    this.loadingService.setLoading(true);
    this.eventsService.createEvent(this.createEventForm.value as IEvent).subscribe({
      next: () => {
        $("#eventModal").modal('hide');
        this.onSaveComplete();
        this.toastr.success("Se ha guardado el evento");
      }
    }).add(() => {
      this.loadingService.setLoading(false);
    });
  }

  updateEvent(id: string) {
    this.loadingService.setLoading(true);
    this.eventsService.updateEvent(this.createEventForm.value as IEvent, id).subscribe({
      next: () => {
        $("#eventModal").modal('hide');
        this.onSaveComplete();
        this.toastr.success("Se ha actualizado el evento");
      }
    }).add(() => {
      this.loadingService.setLoading(false);
    });
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.clearInputs();
    this.displayMessage = {};
    this.updateEventService.updateEvents();
  }

  clearInputs(): void {
    this.createEventForm.reset({
      nameOfEvent: '',
      dateOfEvent: '',
      maxDateOfConfirmation: ''
    });
    
    $("#eventId").val("");
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
