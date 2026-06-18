import { Component, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { IDashboardInvite } from 'src/app/core/models/invites';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { createStatistics } from 'src/app/shared/utils/statistics/statistics';
import { SharedModule } from 'src/app/shared/shared.module';
import { DatePipe } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [SharedModule],
})
export class HomeComponent {
  private invitesService = inject(InvitesService);
  private eventsService = inject(EventsService);
  private datePipe = inject(DatePipe);

  private eventSelected = new BehaviorSubject<string>('');
  eventSelected$ = this.eventSelected.asObservable();
  private invites = new BehaviorSubject<IDashboardInvite[]>([]);
  invites$ = this.invites.asObservable();
  lastInvitesChart: Chart<'bar', number[], string> | undefined;
  historyChart: Chart<'pie', number[], string> | undefined;

  history$ = this.invites$.pipe(
    map((invites) => {
      return this.RenderChart(invites);
    }),
  );

  vm$ = combineLatest([
    this.invitesService.getAllInvites().pipe(
      map((invites) => {
        return invites.map((invite) => {
          return {
            ...invite,
            dateOfConfirmation: invite.dateOfConfirmation
              ? invite.dateOfConfirmation
              : null,
          } as IDashboardInvite;
        });
      }),
    ),
    this.eventsService.getDropdownEvents(),
    this.eventSelected$,
  ]).pipe(
    map(([invites, events, eventSelected]) => {
      events = events.filter(
        (event) => event.typeOfEvent !== EventType.SaveTheDate,
      );

      const invitesByEvent = invites.filter((invite) =>
        eventSelected === '' ? true : invite.eventId === eventSelected,
      );

      this.invites.next(invitesByEvent);
      return {
        events,
      };
    }),
  );

  filterInvites(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.eventSelected.next(target.value);
  }

  RenderChart(invites: IDashboardInvite[]) {
    const statistics = createStatistics(invites);

    let percentaje = Math.trunc(
      (statistics[0].value / statistics[3].value) * 100,
    );

    const percentajeOfConfirmation = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    percentaje = Math.trunc((statistics[1].value / statistics[3].value) * 100);

    const percentajeOfPendingResponse = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    const todayMinus31Days = new Date();
    todayMinus31Days.setHours(0, 0, 0, 0);
    todayMinus31Days.setDate(todayMinus31Days.getDate() - 31);

    const groupedByDate: { [key: string]: number } = {};
    const randomColors: string[] = [];

    const validDates: string[] = [];
    const startDate = new Date();

    for (let i = 0; i <= 31; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() - i);
      validDates.push(this.datePipe.transform(date, 'shortDate') as string);
    }

    validDates.forEach((date) => {
      groupedByDate[date] = invites.filter((invite) => {
        randomColors.push(
          `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`,
        );

        return (
          invite.dateOfConfirmation &&
          this.datePipe.transform(invite.dateOfConfirmation, 'shortDate') ===
            date
        );
      }).length;
    });

    if (this.lastInvitesChart) {
      this.lastInvitesChart.destroy();
    }

    this.lastInvitesChart = new Chart('lastInvitesData', {
      type: 'bar',
      data: {
        labels: Object.keys(groupedByDate),
        datasets: [
          {
            data: Object.values(groupedByDate),
            backgroundColor: randomColors,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: $localize`# de invitaciones respondidas`,
              font: {
                size: 20,
              },
            },
            beginAtZero: true,
            suggestedMax: 10,
          },
          x: {
            title: {
              display: true,
              text: $localize`Fecha`,
              font: {
                size: 20,
              },
            },
          },
        },
      },
    });

    if (this.historyChart) {
      this.historyChart.destroy();
    }

    this.historyChart = new Chart('historyChart', {
      type: 'pie',
      data: {
        labels: [
          $localize`Confirmadas`,
          $localize`Pendientes`,
          $localize`Canceladas`,
        ],
        datasets: [
          {
            label: $localize`# de pases`,
            data: [
              statistics[0].value,
              statistics[1].value,
              statistics[2].value,
            ],
            backgroundColor: ['#43cd63', '#facf4f', '#ff5d6d'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
        responsive: true,
      },
    });

    return {
      statistics,
      percentajeOfConfirmation,
      percentajeOfPendingResponse,
    };
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }
}
