import {
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
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import { ISettingAction } from 'src/app/core/models/settings';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-save-the-date-settings',
  templateUrl: './save-the-date-settings.component.html',
  styleUrl: './save-the-date-settings.component.css',
})
export class SaveTheDateSettingsComponent {
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
    eventId: ['', Validators.required],
    primaryColor: ['', Validators.required],
    secondaryColor: ['', Validators.required],
    receptionPlace: ['', Validators.required],
    copyMessage: ['', Validators.required],
    hotelName: ['', Validators.required],
    hotelInformation: ['', Validators.required],
  });

  constructor(
    private loaderService: LoaderService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  clearInformation(): void {
    this.createEventSettingsForm.reset({
      eventId: '',
      primaryColor: '',
      secondaryColor: '',
      receptionPlace: '',
      copyMessage: '',
      hotelName: '',
      hotelInformation: '',
    });
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
      this.createEventSettingsForm.markAllAsTouched();
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
}
