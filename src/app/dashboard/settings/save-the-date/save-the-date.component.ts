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
import { ISettingAction } from 'src/app/core/models/settings';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrl: './save-the-date.component.css',
})
export class SaveTheDateComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set eventSettingAction(eventSettingAction: ISettingAction) {
    const eventId = eventSettingAction.eventId;
    this.saveTheDateSettings = {
      eventId: eventId,
      isNew: true,
      eventType: EventType.SaveTheDate,
    } as ISettingAction;

    this.getEventSetting();
  }

  saveTheDateSettings: ISettingAction = {} as ISettingAction;

  createEventSettingsForm: FormGroup = this.fb.group({
    eventId: [''],
    primaryColor: ['', Validators.required],
    secondaryColor: ['', Validators.required],
    receptionPlace: ['', Validators.required],
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
      receptionPlace: {
        required: $localize`Ingresar lugar del evento`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  clearInformation(): void {
    this.createEventSettingsForm.reset({
      eventId: '',
      primaryColor: '',
      secondaryColor: '',
      receptionPlace: '',
    });

    this.displayMessage = {};
  }

  getEventSetting(): void {
    if (this.saveTheDateSettings.eventId) {
      this.settingsService
        .getEventSettings(this.saveTheDateSettings.eventId)
        .subscribe({
          next: (response) => {
            this.createEventSettingsForm.patchValue({
              ...JSON.parse(response.settings),
              eventId: response.eventId,
            });

            this.saveTheDateSettings = {
              ...this.saveTheDateSettings,
              isNew: false,
            };
          },
          error: () => {
            this.saveTheDateSettings = {
              ...this.saveTheDateSettings,
              isNew: true,
            };

            this.createEventSettingsForm.patchValue({
              eventId: this.saveTheDateSettings.eventId,
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
      if (this.saveTheDateSettings.isNew) {
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
        this.createEventSettingsForm.value,
        this.saveTheDateSettings.eventType
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
    if (this.saveTheDateSettings.eventId !== '') {
      this.settingsService
        .updateEventSettings(
          this.createEventSettingsForm.value,
          this.saveTheDateSettings.eventId,
          this.saveTheDateSettings.eventType
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
