import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, mergeMap, tap } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import { ISettingAction } from 'src/app/core/models/settings';
import { SettingsService } from 'src/app/core/services/settings.service';
import { CommonModule } from '@angular/common';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../shared/pipes/validation-error.pipe';

@Component({
  selector: 'app-save-the-date-settings',
  templateUrl: './save-the-date-settings.component.html',
  styleUrl: './save-the-date-settings.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationPipe,
    ValidationErrorPipe,
  ],
})
export class SaveTheDateSettingsComponent {
  @Input() set eventSettingActionValue(eventSettingAction: ISettingAction) {
    this.saveTheDateSettingsAction = eventSettingAction;
    this.reloadSettings.next(true);
  }

  private saveTheDateSettingsAction = {
    isNew: undefined,
    eventType: EventType.SaveTheDate,
    eventId: '',
  } as ISettingAction;

  private reloadSettings = new BehaviorSubject<boolean>(false);
  reloadSettings$ = this.reloadSettings.asObservable();

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

  vm$ = this.reloadSettings$.pipe(
    mergeMap(() =>
      this.settingsService
        .getEventSettings(this.saveTheDateSettingsAction.eventId)
        .pipe(
          tap((response) => {
            const settings = JSON.parse(response.settings);
            if (
              Object.keys(settings).length === 0 &&
              this.saveTheDateSettingsAction.isNew === undefined
            ) {
              this.saveTheDateSettingsAction = {
                ...this.saveTheDateSettingsAction,
                isNew: true,
              };
            }
          })
        )
    ),
    tap((eventSettings) => {
      this.createEventSettingsForm.patchValue({
        ...JSON.parse(eventSettings.settings),
        eventId: eventSettings.eventId,
      });
    })
  );

  cancelChanges(): void {
    this.clearInformation();
    this.reloadSettings.next(true);
  }

  saveChanges(): void {
    if (
      this.createEventSettingsForm.valid &&
      this.createEventSettingsForm.dirty
    ) {
      if (this.saveTheDateSettingsAction.isNew) {
        this.createEventSettings();
      } else {
        this.updateEventSettings();
      }
    } else {
      this.createEventSettingsForm.markAllAsTouched();
    }
  }

  createEventSettings() {
    this.settingsService
      .createEventSettings(
        this.createEventSettingsForm.value,
        this.saveTheDateSettingsAction.eventType
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      });
  }

  updateEventSettings() {
    if (this.saveTheDateSettingsAction.eventId !== '') {
      this.settingsService
        .updateEventSettings(
          this.createEventSettingsForm.value,
          this.saveTheDateSettingsAction.eventId,
          this.saveTheDateSettingsAction.eventType
        )
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastr.success(response.message);
          },
        });
    }
  }
}
