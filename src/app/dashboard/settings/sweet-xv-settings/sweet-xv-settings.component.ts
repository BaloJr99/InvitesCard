import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import { ISweetXvSetting, ISettingAction } from 'src/app/core/models/settings';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-sweet-xv-settings',
  templateUrl: './sweet-xv-settings.component.html',
  styleUrl: './sweet-xv-settings.component.css',
})
export class SweetXvSettingsComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set eventSettingAction(eventSettingAction: ISettingAction) {
    const eventId = eventSettingAction?.eventId;
    this.sweetXvSettings = {
      eventId: eventId,
      isNew: true,
      eventType: EventType.Xv,
    } as ISettingAction;

    this.getEventSetting();
  }

  sweetXvSettings: ISettingAction = {} as ISettingAction;

  createEventSettingsForm: FormGroup = this.fb.group({
    eventId: ['', Validators.required],
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
    dressCodeColor: ['', Validators.required],
  });

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private loaderService: LoaderService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.validationMessages = {
      primaryColor: {
        required: $localize`Ingresar color primario`,
      },
      secondaryColor: {
        required: $localize`Ingresar color secundario`,
      },
      parents: {
        required: $localize`Ingresar nombre de los padres`,
      },
      godParents: {
        required: $localize`Ingresar nombre de los padrinos`,
      },
      firstSectionSentences: {
        required: $localize`Ingresar datos de la primer sección`,
      },
      secondSectionSentences: {
        required: $localize`Ingresar datos de la segunda sección`,
      },
      massUrl: {
        required: $localize`Ingresar url de la ubicación de la misa`,
      },
      massTime: {
        required: $localize`Ingresar hora de la misa`,
      },
      massAddress: {
        required: $localize`Ingresar dirección de la misa`,
      },
      receptionUrl: {
        required: $localize`Ingresar url de la ubicación de recepción`,
      },
      receptionTime: {
        required: $localize`Ingresar hora de la recepción`,
      },
      receptionPlace: {
        required: $localize`Ingresar nombre de salón de eventos`,
      },
      receptionAddress: {
        required: $localize`Ingresar dirección de recepción`,
      },
      dressCodeColor: {
        required: $localize`Ingresar si existe restricción de color`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
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
      dressCodeColor: '',
    });

    this.displayMessage = {};
  }

  getEventSetting(): void {
    if (this.sweetXvSettings.eventId) {
      this.settingsService
        .getEventSettings(this.sweetXvSettings.eventId)
        .subscribe({
          next: (response) => {
            this.createEventSettingsForm.patchValue({
              ...JSON.parse(response.settings),
              eventId: response.eventId,
            });

            this.sweetXvSettings = {
              ...this.sweetXvSettings,
              isNew: false,
            };
          },
          error: () => {
            this.sweetXvSettings = {
              ...this.sweetXvSettings,
              isNew: true,
            };

            this.createEventSettingsForm.patchValue({
              eventId: this.sweetXvSettings.eventId,
            });
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  cancelChanges(): void {
    this.clearInformation();
    this.getEventSetting();
  }

  saveChanges(): void {
    if (
      this.createEventSettingsForm.valid &&
      this.createEventSettingsForm.dirty
    ) {
      if (this.sweetXvSettings.isNew) {
        this.createEventSettings();
      } else {
        this.updateEventSettings();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.createEventSettingsForm,
        true
      );
    }
  }

  createEventSettings() {
    this.loaderService.setLoading(true, $localize`Creando configuraciones`);
    this.settingsService
      .createEventSettings(
        this.formatEventSetting(),
        this.sweetXvSettings.eventType
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateEventSettings() {
    this.loaderService.setLoading(
      true,
      $localize`Actualizando configuraciones`
    );
    if (this.sweetXvSettings.eventId !== '') {
      this.settingsService
        .updateEventSettings(
          this.formatEventSetting(),
          this.sweetXvSettings.eventId,
          this.sweetXvSettings.eventType
        )
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastr.success(response.message);
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  formatEventSetting(): ISweetXvSetting {
    const updatedMassTime = this.createEventSettingsForm.get('massTime')
      ?.value as string;
    const updatedReceptionTime = this.createEventSettingsForm.get(
      'receptionTime'
    )?.value as string;

    return {
      ...this.createEventSettingsForm.value,
      massTime:
        updatedMassTime.length > 5
          ? this.createEventSettingsForm.get('massTime')?.value
          : `${this.createEventSettingsForm.get('massTime')?.value}:00`,
      receptionTime:
        updatedReceptionTime.length > 5
          ? this.createEventSettingsForm.get('receptionTime')?.value
          : `${this.createEventSettingsForm.get('receptionTime')?.value}:00`,
    } as ISweetXvSetting;
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEventSettingsForm.valueChanges, ...controlBlurs).subscribe(
      () => {
        this.displayMessage = this.genericValidator.processMessages(
          this.createEventSettingsForm
        );
      }
    );
  }
}
