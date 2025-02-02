import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { combineLatest, map } from 'rxjs';
import { EventType } from 'src/app/core/models/enum';
import { IDropdownEvent, IStatistic } from 'src/app/core/models/events';
import { IDashboardInvite } from 'src/app/core/models/invites';
import { EventsService } from 'src/app/core/services/events.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { createStatistics } from 'src/app/shared/utils/statistics/statistics';
import { toLocalDate } from 'src/app/shared/utils/tools';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  invites: IDashboardInvite[] = [];
  statistics: IStatistic[] = [];
  percentajeOfConfirmation: string = '0';
  percentajeOfPendingResponse: string = '0';
  groupedByDate: { [key: string]: number } = {};
  events: IDropdownEvent[] = [];
  eventSelected: string = '';
  lastInvitesChart: Chart<'bar', number[], string> | undefined;
  historyChart: Chart<'pie', number[], string> | undefined;

  constructor(
    private invitesService: InvitesService,
    private loaderService: LoaderService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando página principal`);

    combineLatest([
      this.invitesService.getAllInvites().pipe(
        map((invites) => {
          return invites.map((invite) => {
            return {
              ...invite,
              dateOfConfirmation: invite.dateOfConfirmation
                ? toLocalDate(invite.dateOfConfirmation)
                : null,
            };
          });
        })
      ),
      this.eventsService.getDropdownEvents(),
    ])
      .subscribe({
        next: ([invites, events]) => {
          this.invites = invites;
          this.events = events.filter(
            (event) => event.typeOfEvent !== EventType.SaveTheDate
          );
          this.RenderChart();
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  filterInvites(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.eventSelected = target.value;
    this.RenderChart();
  }

  RenderChart() {
    const invitesByEvent = this.invites.filter((invite) =>
      this.eventSelected !== '' ? invite.eventId === this.eventSelected : true
    );

    this.statistics = createStatistics(invitesByEvent);

    let percentaje = Math.trunc(
      (this.statistics[0].value / this.statistics[3].value) * 100
    );

    this.percentajeOfConfirmation = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    percentaje = Math.trunc(
      (this.statistics[1].value / this.statistics[3].value) * 100
    );

    this.percentajeOfPendingResponse = (
      isNaN(percentaje) ? 0 : percentaje
    ).toString();

    const todayMinus31Days = new Date();
    todayMinus31Days.setDate(todayMinus31Days.getDate() - 31);

    this.groupedByDate = {};
    const randomColors: string[] = [];

    const validInvites = invitesByEvent.filter((invite) => {
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
      this.groupedByDate[date] = validInvites.filter((invite) => {
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
        labels: Object.keys(this.groupedByDate),
        datasets: [
          {
            data: Object.values(this.groupedByDate),
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
              this.statistics[0].value,
              this.statistics[1].value,
              this.statistics[2].value,
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
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }
}
