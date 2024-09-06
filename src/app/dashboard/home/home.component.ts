import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IStatistic } from 'src/app/core/models/events';
import { IInvite } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { createStatistics } from 'src/app/shared/utils/statistics/statistics';
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  invites: IInvite[] = [];
  statistics: IStatistic = {
    canceledEntries: 0,
    confirmedEntries: 0,
    pendingEntries: 0,
    totalEntries: 0
  };
  percentajeOfConfirmation: string = "0";
  percentajeOfPendingResponse: string = "0";
  groupedByDate: { [key: string]: number } = {};

  constructor (
    private invitesService: InvitesService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize `Cargando página principal`);
    this.invitesService.getAllInvites()
    .subscribe({
      next: (invites) => {
        this.invites = invites;
        this.RenderChart();
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  RenderChart() {
    this.statistics = createStatistics(this.invites);
    this.percentajeOfConfirmation = (Math.trunc((this.statistics.confirmedEntries / this.statistics.totalEntries) * 100)).toString(); 
    this.percentajeOfPendingResponse = (Math.trunc((this.statistics.pendingEntries / this.statistics.totalEntries) * 100)).toString(); 

    const todayMinus31Days = new Date();
    todayMinus31Days.setDate(todayMinus31Days.getDate() - 31);

    this.groupedByDate = {};
    const randomColors: string[] = [];

    const validInvites = this.invites.filter((invite) => {
      if (invite.dateOfConfirmation != null && new Date(invite.dateOfConfirmation).getTime() >= todayMinus31Days.getTime()) {
        return true;
      }
      return false;
    });

    const uniqueValidDates = [...new Set(
      validInvites.reduce((result: string[], invite) => {
        if (invite.dateOfConfirmation) {
          result.push(new Date(invite.dateOfConfirmation).toISOString().substring(0, 10));
        }
        return result;
      }, []))
    ]

    uniqueValidDates.forEach((date) => {
      this.groupedByDate[date] = validInvites.filter((invite) => {
        randomColors.push(`rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`)
        if (invite.dateOfConfirmation) {
          const inviteDate = new Date(invite.dateOfConfirmation).toISOString().substring(0, 10);

          if (inviteDate === date) {
            return true;
          }
        }
        return false;
      }).length
    });


    new Chart("lastInvitesData", {
      type: 'bar',
      data: {
        labels: Object.keys(this.groupedByDate),
        datasets: [
          {
            data: Object.values(this.groupedByDate),
            backgroundColor: randomColors
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: $localize `# de invitaciones respondidas`,
              font: {
                size: 20
              }
            },
            beginAtZero: true,
            suggestedMax: 10
          },
          x: {
            title: {
              display: true,
              text: $localize `Fecha`,
              font: {
                size: 20
              }
            }
          }
        }
      },
    });

    new Chart('historyChart', {
      type: 'pie',
      data: {
        labels: [$localize `Confirmadas`, $localize `Pendientes`, $localize `Canceladas`],
        datasets: [
          {
            label: $localize `# de entradas`,
            data: [
              this.statistics.confirmedEntries,
              this.statistics.pendingEntries,
              this.statistics.canceledEntries
            ],
            backgroundColor: ["#43cd63", "#facf4f", "#ff5d6d"],
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        responsive: true
      }
    });
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }
}
