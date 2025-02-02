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
import { ISettingAction, IWeddingSetting } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { dateTimeToUTCDate, toLocalDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-wedding-settings',
  templateUrl: './wedding-settings.component.html',
  styleUrl: './wedding-settings.component.css',
})
export class WeddingSettingsComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set eventSettingAction(eventSettingAction: ISettingAction) {
    const eventId = eventSettingAction.eventId;
    this.weddingSettings = {
      eventId: eventId,
      isNew: true,
      eventType: EventType.Wedding,
    } as ISettingAction;

    this.getEventSetting();
  }

  autoCompleteOptions: string[] = [
    '[invite_url]',
    '[family]',
    '[max_deadline]',
  ];

  weddingSettings: ISettingAction = {} as ISettingAction;
  eventDate: string = '';

  createEventSettingsForm: FormGroup = this.fb.group({
    eventId: ['', Validators.required],
    primaryColor: ['', Validators.required],
    secondaryColor: ['', Validators.required],
    weddingPrimaryColor: ['', Validators.required],
    weddingSecondaryColor: ['', Validators.required],
    weddingCopyMessage: ['', Validators.required],
    receptionPlace: ['', Validators.required],
    copyMessage: ['', Validators.required],
    hotelName: ['', Validators.required],
    hotelInformation: ['', Validators.required],
    groomParents: ['', Validators.required],
    brideParents: ['', Validators.required],
  });

  sectionsControls: { [key: string]: IInviteSectionsProperties } = {
    itineraryInfo: {
      validators: {
        massUrl: ['', Validators.required],
        massTime: ['', Validators.required],
        massPlace: ['', Validators.required],
        venueUrl: ['', Validators.required],
        venueTime: ['', Validators.required],
        venuePlace: ['', Validators.required],
        civilUrl: ['', Validators.required],
        civilTime: ['', Validators.required],
        civilPlace: ['', Validators.required],
        hotelUrl: ['', Validators.required],
        hotelAddress: ['', Validators.required],
        hotelPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      },
    },
    dressCodeInfo: {
      validators: {
        dressCodeColor: ['', Validators.required],
      },
    },
    giftsInfo: {
      validators: {
        cardNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{4}-\d{4}-\d{4}-\d{4}$/),
          ],
        ],
        clabeBank: ['', [Validators.required, Validators.pattern(/^\d{18}$/)]],
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
    private eventsService: EventsService,
    private loaderService: LoaderService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.baseSections = [
      {
        sectionId: 'inviteInfo',
        name: $localize`Información de la invitación`,
        draggable: false,
        disabled: true,
        selected: true,
        order: 0,
      },
      {
        sectionId: 'itineraryInfo',
        name: $localize`Itinerario`,
        draggable: true,
        disabled: false,
        selected: true,
        order: 1,
      },
      {
        sectionId: 'dressCodeInfo',
        name: $localize`Código de vestimenta`,
        draggable: true,
        disabled: false,
        selected: true,
        order: 2,
      },
      {
        sectionId: 'giftsInfo',
        name: $localize`Regalos`,
        draggable: true,
        disabled: false,
        selected: true,
        order: 3,
      },
      {
        sectionId: 'confirmationInfo',
        name: $localize`Formulario`,
        draggable: true,
        disabled: false,
        selected: true,
        order: 4,
      },
      {
        sectionId: 'accomodationInfo',
        name: $localize`Hospedaje`,
        draggable: true,
        disabled: true,
        selected: true,
        order: 5,
      },
      {
        sectionId: 'galleryInfo',
        name: $localize`Galería`,
        draggable: true,
        disabled: true,
        selected: true,
        order: 6,
      },
    ];

    this.validationMessages = {
      weddingCopyMessage: $localize`Ingresar mensaje para copiar`,
      weddingPrimaryColor: $localize`Ingresar color primario`,
      weddingSecondaryColor: $localize`Ingresar color secundario`,
      groomParents: $localize`Ingresar nombre de los padres del novio`,
      brideParents: $localize`Ingresar nombre de los padres de la novia`,
      massUrl: $localize`Ingresar url de la ubicación de la misa`,
      massTime: $localize`Ingresar hora de la misa`,
      massPlace: $localize`Ingresar nombre de la iglesia`,
      venueUrl: $localize`Ingresar url de la ubicación de recepción`,
      venueTime: $localize`Ingresar hora de la recepción`,
      venuePlace: $localize`Ingresar nombre de salón de eventos`,
      civilUrl: $localize`Ingresar url de la ubicación de recepción`,
      civilTime: $localize`Ingresar hora de la recepción`,
      civilPlace: $localize`Ingresar nombre de salón de eventos`,
      dressCodeColor: $localize`Ingresar si existe restricción de color`,
      copyMessage: $localize`Ingresar mensaje para copiar`,
      hotelName: $localize`Ingresar nombre del hotel`,
      hotelInformation: $localize`Ingresar url con información del hotel`,
      hotelUrl: $localize`Ingresar url de la ubicación hotel`,
      hotelAddress: $localize`Ingresar dirección del hotel`,
      hotelPhone: $localize`El teléfono del hotel debe tener 10 dígitos`,
      cardNumber: $localize`El número de tarjeta debe tener el formato XXXX-XXXX-XXXX-XXXX`,
      clabeBank: $localize`La CLABE debe tener 18 dígitos`,
    };
  }

  clearInformation(): void {
    this.createEventSettingsForm.reset({
      eventId: '',
      weddingPrimaryColor: '',
      weddingSecondaryColor: '',
      weddingCopyMessage: '',
      groomParents: '',
      brideParents: '',
      receptionPlace: '',
      copyMessage: '',
      hotelName: '',
      hotelInformation: '',
      massUrl: '',
      massTime: '',
      massPlace: '',
      venueUrl: '',
      venueTime: '',
      venuePlace: '',
      civilUrl: '',
      civilTime: '',
      civilPlace: '',
      dressCodeColor: '',
      cardNumber: '',
      clabeBank: '',
      hotelUrl: '',
      hotelAddress: '',
      hotelPhone: '',
    });
  }

  getEventSetting(): void {
    if (this.weddingSettings.eventId) {
      combineLatest([
        this.settingsService.getEventSettings(this.weddingSettings.eventId),
        this.eventsService.getEventById(this.weddingSettings.eventId),
      ])
        .subscribe({
          next: ([eventSettings, eventInfo]) => {
            this.eventDate = toLocalDate(eventInfo.dateOfEvent).split('T')[0];

            const parsedSettings = JSON.parse(eventSettings.settings);
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
            }

            if (parsedSettings.massTime) {
              const dateOfMassTime = parsedSettings.massTime.split(' ')[0];
              const timeOfMassTime = parsedSettings.massTime.split(' ')[1];

              parsedSettings.massTime = toLocalDate(
                `${dateOfMassTime}T${timeOfMassTime}.000Z`
              ).split('T')[1];
            }

            if (parsedSettings.venueTime) {
              const dateOfVenueTime = parsedSettings.venueTime.split(' ')[0];
              const timeOfVenueTime = parsedSettings.venueTime.split(' ')[1];

              parsedSettings.venueTime = toLocalDate(
                `${dateOfVenueTime}T${timeOfVenueTime}.000Z`
              ).split('T')[1];
            }

            if (parsedSettings.civilTime) {
              const dateOfCivilTime = parsedSettings.civilTime.split(' ')[0];
              const timeOfCivilTime = parsedSettings.civilTime.split(' ')[1];

              parsedSettings.civilTime = toLocalDate(
                `${dateOfCivilTime}T${timeOfCivilTime}.000Z`
              ).split('T')[1];
            }

            this.createEventSettingsForm.patchValue({
              ...parsedSettings,
              eventId: this.weddingSettings.eventId,
            });

            this.weddingSettings = {
              ...this.weddingSettings,
              isNew: false,
            };
          },
          error: () => {
            this.updateSections(this.baseSections);

            this.weddingSettings = {
              ...this.weddingSettings,
              isNew: true,
            };

            this.createEventSettingsForm.patchValue({
              eventId: this.weddingSettings.eventId,
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
      if (this.weddingSettings.isNew) {
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
        this.weddingSettings.eventType
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
    if (this.weddingSettings.eventId !== '') {
      this.settingsService
        .updateEventSettings(
          this.formatEventSetting(),
          this.weddingSettings.eventId,
          this.weddingSettings.eventType
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

  formatEventSetting(): IWeddingSetting {
    const sectionsDisplayed = this.sectionsConfig.value.filter(
      (s) => s.selected
    );
    const formValue = this.createEventSettingsForm.value;

    if (sectionsDisplayed.some((s) => s.sectionId === 'itineraryInfo')) {
      formValue['venueTime'] = dateTimeToUTCDate(
        `${this.eventDate}T${formValue['venueTime']}`
      );

      formValue['massTime'] = dateTimeToUTCDate(
        `${this.eventDate}T${formValue['massTime']}`
      );

      formValue['civilTime'] = dateTimeToUTCDate(
        `${this.eventDate}T${formValue['civilTime']}`
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
    } as IWeddingSetting;
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

  selectAutoCompleteItem(autoCompleteSelected: string): void {
    const textArea = document.querySelector('textarea') as HTMLTextAreaElement;
    textArea.value += autoCompleteSelected;

    textArea.focus();
  }
}
