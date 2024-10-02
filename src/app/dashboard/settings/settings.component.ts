import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IDropdownEvent } from 'src/app/core/models/events';
import { ISettingAction } from 'src/app/core/models/settings';
import { EventsService } from 'src/app/core/services/events.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  events: IDropdownEvent[] = [];
  eventSettingAction: ISettingAction = {} as ISettingAction;

  constructor(
    private loaderService: LoaderService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando configuraciones`);

    this.eventsService
      .getDropdownEvents()
      .subscribe({
        next: (events) => {
          this.events = events;
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  loadEventSettings() {
    const eventFound = this.events.find(
      (event) => event.id === $('#event-select').val()
    );

    if (eventFound) {
      this.eventSettingAction = {
        eventId: eventFound.id,
        isNew: false,
        settingType: eventFound.typeOfEvent,
      } as ISettingAction;
    }
  }
}
