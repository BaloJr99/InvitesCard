import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { IDashboardInvite } from 'src/app/core/models/invites';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { createStatistics } from 'src/app/shared/utils/statistics/statistics';
import { toLocalDate } from 'src/app/shared/utils/tools';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent {
  private eventSelected = new BehaviorSubject<string>('');
  eventSelected$ = this.eventSelected.asObservable();
  private invites = new BehaviorSubject<IDashboardInvite[]>([]);
  invites$ = this.invites.asObservable();
  lastInvitesChart: Chart<'bar', number[], string> | undefined;
  historyChart: Chart<'pie', number[], string> | undefined;

  constructor(
    private invitesService: InvitesService,
    private eventsService: EventsService
  ) {}

  history$ = this.invites$.pipe(
    map((invites) => {
      return this.RenderChart(invites);
    })
  );

  vm$ = combineLatest([
    this.invitesService.getAllInvites().pipe(
      map((invites) => {
        return invites.map((invite) => {
          return {
            ...invite,
            dateOfConfirmation: invite.dateOfConfirmation
              ? toLocalDate(invite.dateOfConfirmation)
              : null,
          } as IDashboardInvite;
        });
      })
    ),
    this.eventsService.getDropdownEvents(),
    this.eventSelected$,
  ]).pipe(
    map(([invites, events, eventSelected]) => {
      events = events.filter(
        (event) => event.typeOfEvent !== EventType.SaveTheDate
      );

      const invitesByEvent = invites.filter((invite) =>
        eventSelected === '' ? true : invite.eventId === eventSelected
      );

      this.invites.next(invitesByEvent);
      return {
        events,
      };
    })
  );

  filterInvites(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.eventSelected.next(target.value);
  }

  RenderChart(invites: IDashboardInvite[]) {
    const statistics = createStatistics(invites);

    let percentaje = Math.trunc(
      (statistics[0].value / statistics[3].value) * 100
    );

    const percentajeOfConfirmation = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    percentaje = Math.trunc((statistics[1].value / statistics[3].value) * 100);

    const percentajeOfPendingResponse = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    const todayMinus31Days = new Date();
    todayMinus31Days.setDate(todayMinus31Days.getDate() - 31);

    const groupedByDate: { [key: string]: number } = {};
    const randomColors: string[] = [];

    const validInvites = invites.filter((invite) => {
      if (
        invite.dateOfConfirmation != null &&
        new Date(invite.dateOfConfirmation).getTime() >=
          todayMinus31Days.getTime()
      ) {
        return true;
      }
      return false;
    });

    const uniqueValidDates = [
      ...new Set(
        validInvites.reduce((result: string[], invite) => {
          if (invite.dateOfConfirmation) {
            result.push(invite.dateOfConfirmation.substring(0, 10));
          }
          return result;
        }, [])
      ),
    ];

    uniqueValidDates.forEach((date) => {
      groupedByDate[date] = validInvites.filter((invite) => {
        randomColors.push(
          `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`
        );
        if (invite.dateOfConfirmation) {
          const inviteDate = invite.dateOfConfirmation.substring(0, 10);

          if (inviteDate === date) {
            return true;
          }
        }
        return false;
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
