import { Component, ElementRef, Input, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import {
  IInviteSection,
  IInviteSectionsProperties,
} from 'src/app/core/models/invites';
import { ISweetXvSetting, ISettingAction } from 'src/app/core/models/settings';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-sweet-xv-settings',
  templateUrl: './sweet-xv-settings.component.html',
  styleUrl: './sweet-xv-settings.component.css',
})
export class SweetXvSettingsComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set eventSettingAction(eventSettingAction: ISettingAction) {
    const eventId = eventSettingAction.eventId;
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
    firstSectionSentences: ['', Validators.required],
  });

  sectionsControls: { [key: string]: IInviteSectionsProperties } = {
    ceremonyInfo: {
      validators: {
        parents: ['', Validators.required],
        godParents: ['', Validators.required],
        secondSectionSentences: ['', Validators.required],
        massUrl: ['', Validators.required],
        massTime: ['', Validators.required],
        massAddress: ['', Validators.required],
      },
    },
    receptionInfo: {
      validators: {
        receptionUrl: ['', Validators.required],
        receptionTime: ['', Validators.required],
        receptionPlace: ['', Validators.required],
        receptionAddress: ['', Validators.required],
      },
    },
    dressCodeInfo: {
      validators: {
        dressCodeColor: ['', Validators.required],
      },
    },
  };

  validationMessages: { [key: string]: string } = {};

  baseSections: IInviteSection[] = [
    {
      sectionId: 'inviteInfo',
      name: $localize`Información de la invitación`,
      disabled: true,
      selected: true,
      order: 0,
    },
    {
      sectionId: 'ceremonyInfo',
      name: $localize`Información de la ceremonia`,
      disabled: false,
      selected: true,
      order: 1,
    },
    {
      sectionId: 'receptionInfo',
      name: $localize`Información de la recepción`,
      disabled: false,
      selected: true,
      order: 1,
    },
    {
      sectionId: 'dressCodeInfo',
      name: $localize`Código de vestimenta`,
      disabled: false,
      selected: true,
      order: 3,
    },
    {
      sectionId: 'giftsInfo',
      name: $localize`Regalos`,
      disabled: false,
      selected: true,
      order: 4,
    },
  ];

  private sectionsConfig = new BehaviorSubject<IInviteSection[]>([]);
  sectionsConfig$ = this.sectionsConfig.asObservable();

  vm$ = combineLatest([this.sectionsConfig$]).pipe(
    map(([sections]) => {
      return {
        sections,
      };
    })
  );

  constructor(
    private loaderService: LoaderService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.validationMessages = {
      primaryColor: $localize`Ingresar color primario`,
      secondaryColor: $localize`Ingresar color secundario`,
      firstSectionSentences: $localize`Ingresar datos de la primer sección`,
      parents: $localize`Ingresar nombre de los padres`,
      godParents: $localize`Ingresar nombre de los padrinos`,
      secondSectionSentences: $localize`Ingresar datos de la segunda sección`,
      massUrl: $localize`Ingresar url de la ubicación de la misa`,
      massTime: $localize`Ingresar hora de la misa`,
      massAddress: $localize`Ingresar dirección de la misa`,
      receptionUrl: $localize`Ingresar url de la ubicación de recepción`,
      receptionTime: $localize`Ingresar hora de la recepción`,
      receptionPlace: $localize`Ingresar nombre de salón de eventos`,
      receptionAddress: $localize`Ingresar dirección de recepción`,
      dressCodeColor: $localize`Ingresar si existe restricción de color`,
    };
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
  }

  getEventSetting(): void {
    if (this.sweetXvSettings.eventId) {
      this.settingsService
        .getEventSettings(this.sweetXvSettings.eventId)
        .subscribe({
          next: (response) => {
            const parsedSettings = JSON.parse(response.settings);
            if (!parsedSettings.sections) {
              this.updateSections(this.baseSections);
            } else {
              const sections = parsedSettings.sections.map(
                (section: IInviteSection) => {
                  const baseSection = this.baseSections.find(
                    (s) => s.sectionId === section.sectionId
                  ) as IInviteSection;

                  return {
                    ...baseSection,
                    selected: section.selected,
                    order: section.order,
                  };
                }
              );
              this.updateSections(sections);
            }

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
            this.updateSections(this.baseSections);

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
      this.createEventSettingsForm.markAllAsTouched();
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
    const sectionsDisplayed = this.sectionsConfig.value.filter(
      (s) => s.selected
    );
    const formValue = this.createEventSettingsForm.value;

    if (sectionsDisplayed.some((s) => s.sectionId === 'ceremonyInfo')) {
      formValue['massTime'] =
        formValue['massTime'].length > 5
          ? formValue['massTime']
          : `${formValue['massTime']}:00`;
    }

    if (sectionsDisplayed.some((s) => s.sectionId === 'receptionInfo')) {
      formValue['receptionTime'] =
        formValue['receptionTime'].length > 5
          ? formValue['receptionTime']
          : `${formValue['receptionTime']}:00`;
    }

    return {
      sections: [
        ...this.sectionsConfig.value.map((s) => {
          return {
            sectionId: s.sectionId,
            selected: s.selected,
            order: s.order,
          };
        }),
      ],
      ...formValue,
    } as ISweetXvSetting;
  }

  sectionEnabled(sectionId: string, sections: IInviteSection[]) {
    return sections.find((s) => s.sectionId === sectionId)?.selected;
  }

  updateSection(sectionId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const updatedSections = this.sectionsConfig.value.map((section) => {
      if (section.sectionId === sectionId) {
        section.selected = target.checked;

        if (target.checked) {
          Object.keys(this.sectionsControls[sectionId].validators).forEach(
            (control) => {
              this.createEventSettingsForm.addControl(
                control,
                new FormControl(
                  '',
                  this.sectionsControls[sectionId].validators[control][1]
                )
              );
            }
          );
        } else {
          Object.keys(this.sectionsControls[sectionId].validators).forEach(
            (control) => {
              this.createEventSettingsForm.removeControl(control);
            }
          );
        }
      }

      return section;
    });
    this.createEventSettingsForm.updateValueAndValidity();
    this.sectionsConfig.next(updatedSections);
  }

  formControlIsInvalid(controlName: string, errorName: string): boolean {
    const control = this.createEventSettingsForm.get(controlName);
    return (
      control && control.errors && control.errors[errorName] && control.touched
    );
  }

  updateSections(sections: IInviteSection[]) {
    // Order the sections by order property
    sections.sort((a, b) => a.order - b.order);

    // Fill the form with default values
    Object.keys(this.sectionsControls).forEach((section) => {
      if (sections.some((s) => s.sectionId === section && s.selected)) {
        Object.keys(this.sectionsControls[section].validators).forEach(
          (control) => {
            this.createEventSettingsForm.addControl(
              control,
              new FormControl(
                '',
                this.sectionsControls[section].validators[control][1]
              )
            );
          }
        );
      }
    });

    this.sectionsConfig.next(sections);
  }
}
