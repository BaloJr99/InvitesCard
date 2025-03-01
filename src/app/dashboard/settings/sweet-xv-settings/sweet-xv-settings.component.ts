import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, mergeMap, tap } from 'rxjs';
import { IMessageResponse } from 'src/app/core/models/common';
import { EventType } from 'src/app/core/models/enum';
import {
  IInviteSection,
  IInviteSectionsProperties,
} from 'src/app/core/models/invites';
import { ISweetXvSetting, ISettingAction } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { dateTimeToUTCDate, toLocalDate } from 'src/app/shared/utils/tools';
import { CommonModule } from '@angular/common';
import { ValidationPipe } from '../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../shared/pipes/validation-error.pipe';

@Component({
  selector: 'app-sweet-xv-settings',
  templateUrl: './sweet-xv-settings.component.html',
  styleUrl: './sweet-xv-settings.component.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationPipe,
    ValidationErrorPipe,
  ],
})
export class SweetXvSettingsComponent {
  private sweetXvSettingsAction = {
    isNew: undefined,
    eventType: EventType.Xv,
    eventId: '',
  } as ISettingAction;

  @Input() set eventSettingActionValue(value: ISettingAction) {
    this.sweetXvSettingsAction = value;
    this.reloadSettings.next(true);
  }

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

  baseSections: IInviteSection[] = [];

  private sectionsConfig = new BehaviorSubject<IInviteSection[]>([]);
  sectionsConfig$ = this.sectionsConfig.asObservable();

  private reloadSettings = new BehaviorSubject<boolean>(false);
  reloadSettings$ = this.reloadSettings.asObservable();

  vm$ = this.reloadSettings$.pipe(
    mergeMap(() =>
      combineLatest([
        this.settingsService
          .getEventSettings(this.sweetXvSettingsAction.eventId)
          .pipe(
            tap((response) => {
              const settings = JSON.parse(response.settings);
              if (
                Object.keys(settings).length === 0 &&
                this.sweetXvSettingsAction.isNew === undefined
              ) {
                this.sweetXvSettingsAction = {
                  ...this.sweetXvSettingsAction,
                  isNew: true,
                };
              }
            })
          ),
        this.eventsService.getEventById(this.sweetXvSettingsAction.eventId),
      ])
    ),
    tap(([eventSettings, eventInfo]) => {
      this.eventDate = toLocalDate(eventInfo.dateOfEvent).split('T')[0];
      const parsedSettings = JSON.parse(eventSettings.settings);

      this.createEventSettingsForm.patchValue({
        eventId: this.sweetXvSettingsAction.eventId,
      });

      let sections = [] as IInviteSection[];
      if (!parsedSettings.sections) {
        sections = this.updateSections(this.baseSections);
      } else {
        const sectionsFound = parsedSettings.sections.map(
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
            !sectionsFound.some((s) => s.sectionId === baseSection.sectionId)
          ) {
            sectionsFound.push(baseSection);
          }
        });

        sections = this.updateSections(sectionsFound);

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

      this.createEventSettingsForm.patchValue({
        ...parsedSettings,
      });

      this.sectionsConfig.next(sections);
    })
  );

  constructor(
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

  cancelChanges(): void {
    this.clearInformation();
    this.reloadSettings.next(true);
  }

  saveChanges(): void {
    if (
      this.createEventSettingsForm.valid &&
      this.createEventSettingsForm.dirty
    ) {
      if (this.sweetXvSettingsAction.isNew) {
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
        this.formatEventSetting(),
        this.sweetXvSettingsAction.eventType
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      });
  }

  updateEventSettings() {
    this.settingsService
      .updateEventSettings(
        this.formatEventSetting(),
        this.sweetXvSettingsAction.eventId,
        this.sweetXvSettingsAction.eventType
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.toastr.success(response.message);
        },
      });
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

  sectionEnabled(sectionId: string) {
    return this.sectionsConfig.value.find((s) => s.sectionId === sectionId)
      ?.selected;
  }

  updateSection(sectionId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const oldSections = this.sectionsConfig.value;

    const sectionIndex = oldSections.findIndex(
      (section) => section.sectionId === sectionId
    );

    oldSections[sectionIndex].selected = target.checked;

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

    this.createEventSettingsForm.updateValueAndValidity();
    this.createEventSettingsForm.markAsDirty();
    this.sectionsConfig.next(oldSections);
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

    return sectionsCopy;
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

    this.sectionsConfig.next(sections);
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
