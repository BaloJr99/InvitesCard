import { Component, ElementRef, Input, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import { IBaseSettings, ISettingAction } from 'src/app/core/models/settings';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-save-the-date-settings',
  templateUrl: './save-the-date-settings.component.html',
  styleUrl: './save-the-date-settings.component.css',
})
export class SaveTheDateSettingsComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set eventSettingActionValue(eventSettingAction: ISettingAction) {
    this.saveTheDateSettings.next(eventSettingAction);
  }

  private saveTheDateSettings = new BehaviorSubject<ISettingAction>({
    isNew: undefined,
    eventType: EventType.SaveTheDate,
    eventId: '',
  });
  saveTheDateSettings$ = this.saveTheDateSettings.asObservable();

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

  vm$ = combineLatest([this.saveTheDateSettings$, this.reloadSettings$]).pipe(
    switchMap(([saveTheDateSettings]) =>
      this.settingsService
        .getEventSettings(saveTheDateSettings.eventId)
        .pipe(
          catchError(() => {
            if (saveTheDateSettings.isNew === undefined) {
              this.saveTheDateSettings.next({
                ...saveTheDateSettings,
                isNew: true,
              });
            }
            return of({
              eventId: saveTheDateSettings.eventId,
              settings: JSON.stringify({}),
            } as IBaseSettings);
          })
        )
        .pipe(
          tap((eventSettings) => {
            this.createEventSettingsForm.patchValue({
              ...JSON.parse(eventSettings.settings),
              eventId: eventSettings.eventId,
            });
          })
        )
    )
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
      if (this.saveTheDateSettings.value.isNew) {
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
        this.saveTheDateSettings.value.eventType
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      });
  }

  updateEventSettings() {
    if (this.saveTheDateSettings.value.eventId !== '') {
      this.settingsService
        .updateEventSettings(
          this.createEventSettingsForm.value,
          this.saveTheDateSettings.value.eventId,
          this.saveTheDateSettings.value.eventType
        )
        .subscribe({
          next: (response: IMessageResponse) => {
            this.toastr.success(response.message);
          },
        });
    }
  }
}
