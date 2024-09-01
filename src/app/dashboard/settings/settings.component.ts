import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { IDropdownEvent } from 'src/app/core/models/events';
import { ISetting } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  events: IDropdownEvent[] = [];
  eventSelected: IDropdownEvent | undefined = undefined;
  isNewSetting = true;

  createEventSettingsForm!: FormGroup;
  errorMessage = '';
  isAdmin = false;
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private loaderService: LoaderService,
    private eventsService: EventsService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private toastr: ToastrService,
  ) {
    this.validationMessages = {
      primaryColor: {
        required: $localize `Ingresar color primario`
      },
      secondaryColor: {
        required: $localize `Ingresar color secundario`
      },
      parents: {
        required: $localize `Ingresar nombre de los padres`
      },
      godParents: {
        required: $localize `Ingresar nombre de los padrinos`
      },
      firstSectionSentences: {
        required: $localize `Ingresar datos de la primer sección`
      },
      secondSectionSentences: {
        required: $localize `Ingresar datos de la segunda sección`
      },
      massUrl: {
        required: $localize `Ingresar url de la ubicación de la misa`
      },
      massTime: {
        required: $localize `Ingresar hora de la misa`
      },
      massAddress: {
        required: $localize `Ingresar dirección de la misa`
      },
      receptionUrl: {
        required: $localize `Ingresar url de la ubicación de recepción`
      },
      receptionTime: {
        required: $localize `Ingresar hora de la recepción`
      },
      receptionPlace: {
        required: $localize `Ingresar nombre de salón de eventos`
      },
      receptionAddress: {
        required: $localize `Ingresar dirección de recepción`
      },
      dressCodeColor: {
        required: $localize `Ingresar si existe restricción de color`
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit (): void {
    this.createEventSettingsForm = this.fb.group({
      eventId: [''],
      primaryColor: ['', Validators.required],
      secondaryColor: ['', Validators.required],
      parents: ['', Validators.required],
      godParents: ['', Validators.required],
      firstSectionSentences: ['', Validators.required],
      secondSectionSentences: ['', Validators.required],
      massUrl: ['', Validators.required],
      massTime: ['', Validators.required],
      massAddress: ['', Validators.required],
      receptionUrl: ['', Validators.required],
      receptionTime: ['', Validators.required],
      receptionPlace: ['', Validators.required],
      receptionAddress: ['', Validators.required],
      dressCodeColor: ['', Validators.required]
    });

    this.loaderService.setLoading(true, $localize `Cargando configuraciones`);

    this.eventsService.getDropdownEvents().subscribe({
      next: (events) => {
        this.events = events;
      }
    }).add(() => {
      this.loaderService.setLoading(false, '');
    })
  }

  loadEventSettings () {
    this.clearInformation();
    this.eventSelected = this.events.find(event => event.id === $("#event-select").val());
    this.getEventSetting();
  }

  clearInformation(): void {
    this.createEventSettingsForm.reset({
      eventId: '',
      primaryColor: '',
      secondaryColor: '',
      parents: '',
      godParents: '',
      firstSectionSentences: '',
      secondSectionSentences: '',
      massUrl: '',
      massTime: '',
      massAddress: '',
      receptionUrl: '',
      receptionTime: '',
      receptionPlace: '',
      receptionAddress: '',
      dressCodeColor: ''
    });

    this.displayMessage = {};
  }

  getEventSetting(): void {
    if (this.eventSelected) {
      this.createEventSettingsForm.patchValue({
        eventId: this.eventSelected.id
      })
      this.settingsService.getEventSettings(this.eventSelected.id).subscribe({
        next: (response) => {
          this.createEventSettingsForm.patchValue({
            ...response
          });

          this.isNewSetting = false;
        },
        error: () => {
          this.isNewSetting = true;
        }
      }).add(() => {
        this.loaderService.setLoading(false, '');
      })
    }
  }

  cancelChanges(): void {
    this.loadEventSettings();
  }

  saveChanges(): void {
    if (this.createEventSettingsForm.valid) {
      if (this.createEventSettingsForm.dirty) {
        if (this.isNewSetting) {
          this.createEventSettings();
        } else {
          this.updateEventSettings();
        }
      } else {
        $("#eventModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEventSettingsForm, true);
    }
  }

  createEventSettings() {
    this.loaderService.setLoading(true, $localize `Creando configuraciones`);
    this.settingsService.createEventSettings(this.formatEventSetting()).subscribe({
      next: (response: IMessageResponse) => {
        this.toastr.success(response.message);
      }
    }).add(() => {
      this.loaderService.setLoading(false, '');
    });
  }

  updateEventSettings() {
    this.loaderService.setLoading(true, $localize `Actualizando configuraciones`);
    if (this.eventSelected) {
      this.settingsService.updateEventSettings(this.formatEventSetting(), this.eventSelected?.id).subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        }
      }).add(() => {
        this.loaderService.setLoading(false, '');
      });
    }
  }

  formatEventSetting(): ISetting {
    const updatedMassTime = this.createEventSettingsForm.get("massTime")?.value as string;
    const updatedReceptionTime = this.createEventSettingsForm.get("receptionTime")?.value as string;
    if (updatedMassTime.length > 5) {
      return {
        ...this.createEventSettingsForm.value  
      }
    }

    if (updatedReceptionTime.length > 5) {
      return {
        ...this.createEventSettingsForm.value  
      }
    }
    
    return {
      ...this.createEventSettingsForm.value,
      massTime: `${this.createEventSettingsForm.get("massTime")?.value}:00`,
      receptionTime: `${this.createEventSettingsForm.get("receptionTime")?.value}:00`,
    } as ISetting
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEventSettingsForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createEventSettingsForm);
    });
  }
}
