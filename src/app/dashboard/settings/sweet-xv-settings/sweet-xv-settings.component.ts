import { Component, ElementRef, Input, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, combineLatest, map, of } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import {
  IInviteSection,
  IInviteSectionsProperties,
} from 'src/app/core/models/invites';
import {
  ISweetXvSetting,
  ISettingAction,
  IBaseSettings,
} from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { dateTimeToUTCDate, toLocalDate } from 'src/app/shared/utils/tools';

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
  eventDate: string = '';

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

  baseSections: IInviteSection[] = [];

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
    private eventsService: EventsService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.baseSections = [
      {
        sectionId: 'inviteInfo',
        name: $localize`Información de la invitación`,
        disabled: true,
        draggable: false,
        selected: true,
        order: 0,
      },
      {
        sectionId: 'ceremonyInfo',
        name: $localize`Información de la ceremonia`,
        disabled: false,
        draggable: true,
        selected: true,
        order: 1,
      },
      {
        sectionId: 'receptionInfo',
        name: $localize`Información de la recepción`,
        disabled: false,
        draggable: true,
        selected: true,
        order: 2,
      },
      {
        sectionId: 'dressCodeInfo',
        name: $localize`Código de vestimenta`,
        disabled: false,
        draggable: true,
        selected: true,
        order: 3,
      },
      {
        sectionId: 'giftsInfo',
        name: $localize`Regalos`,
        disabled: false,
        draggable: true,
        selected: true,
        order: 4,
      },
      {
        sectionId: 'confirmationInfo',
        name: $localize`Formulario`,
        disabled: true,
        draggable: false,
        selected: true,
        order: 5,
      },
    ];

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
      combineLatest([
        this.settingsService
          .getEventSettings(this.sweetXvSettings.eventId)
          .pipe(
            catchError(() => {
              return of({
                eventId: this.sweetXvSettings.eventId,
                settings: JSON.stringify({}),
              } as IBaseSettings);
            })
          ),
        this.eventsService.getEventById(this.sweetXvSettings.eventId),
      ])
        .subscribe({
          next: ([eventSettings, eventInfo]) => {
            this.eventDate = toLocalDate(eventInfo.dateOfEvent).split('T')[0];
            const parsedSettings = JSON.parse(eventSettings.settings);
            if (!parsedSettings.sections) {
              this.updateSections(this.baseSections);

              this.sweetXvSettings = {
                ...this.sweetXvSettings,
                isNew: true,
              };

              this.createEventSettingsForm.patchValue({
                eventId: this.sweetXvSettings.eventId,
              });
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
              ) as IInviteSection[];

              // Add any missing section from the baseSections
              this.baseSections.forEach((baseSection) => {
                if (
                  !sections.some((s) => s.sectionId === baseSection.sectionId)
                ) {
                  sections.push(baseSection);
                }
              });

              this.updateSections(sections);

              this.createEventSettingsForm.patchValue({
                ...parsedSettings,
                eventId: this.sweetXvSettings.eventId,
              });

              this.sweetXvSettings = {
                ...this.sweetXvSettings,
                isNew: false,
              };

              if (parsedSettings.massTime) {
                const dateOfMassTime = parsedSettings.massTime.split(' ')[0];
                const timeOfMassTime = parsedSettings.massTime.split(' ')[1];

                parsedSettings.massTime = toLocalDate(
                  `${dateOfMassTime}T${timeOfMassTime}.000Z`
                ).split('T')[1];
              }

              if (parsedSettings.receptionTime) {
                const dateOfReceptionTime =
                  parsedSettings.receptionTime.split(' ')[0];
                const timeOfReceptionTime =
                  parsedSettings.receptionTime.split(' ')[1];

                parsedSettings.receptionTime = toLocalDate(
                  `${dateOfReceptionTime}T${timeOfReceptionTime}.000Z`
                ).split('T')[1];
              }
            }
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
      formValue['massTime'] = dateTimeToUTCDate(
        `${this.eventDate}T${formValue['massTime']}`
      );
    }

    if (sectionsDisplayed.some((s) => s.sectionId === 'receptionInfo')) {
      formValue['receptionTime'] = dateTimeToUTCDate(
        `${this.eventDate}T${formValue['receptionTime']}`
      );
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
    // Create a copy to avoid reference issues
    const sectionsCopy = JSON.parse(
      JSON.stringify(sections)
    ) as IInviteSection[];

    // Order the sections by order property
    sectionsCopy.sort((a, b) => a.order - b.order);

    // Fill the form with default values
    Object.keys(this.sectionsControls).forEach((section) => {
      if (sectionsCopy.some((s) => s.sectionId === section && s.selected)) {
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

    this.sectionsConfig.next(sectionsCopy);
  }

  dragStart(event: Event) {
    const target = event.target as HTMLUListElement;
    target.classList.add('dragging');
  }

  dragEnd(event: Event) {
    const target = event.target as HTMLUListElement;
    target.classList.remove('dragging');

    const listIndexIds = Array.from(
      document.querySelectorAll('.available-sections ul li input')
    ).map((li) => li.id.split('-')[1]);
    const sections = this.sectionsConfig.value.map((section) => {
      section.order = listIndexIds.indexOf(section.sectionId);
      return section;
    });

    this.createEventSettingsForm.markAsDirty();

    this.updateSections(sections);
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
    const container = document.querySelector(
      '.available-sections ul'
    ) as HTMLUListElement;

    const afterElement = this.getDragAfterElement(container, event.clientY);
    const draggable = document.querySelector('.dragging') as HTMLLIElement;

    if (afterElement === null) {
      // We need to insert it in the previous position of the last element
      container.insertBefore(draggable, container.lastElementChild);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  }

  getDragAfterElement(container: HTMLUListElement, y: number) {
    const draggableElements = [
      ...container.querySelectorAll('.draggable:not(.dragging)'),
    ] as HTMLLIElement[];

    let element: HTMLLIElement | null = null;

    draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          element = child;
          return { offset };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    );

    return element;
  }
}
