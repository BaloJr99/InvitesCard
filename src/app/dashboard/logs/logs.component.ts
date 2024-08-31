import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { ILog } from 'src/app/core/models/logs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LoggerService } from 'src/app/core/services/logger.service';
Chart.register(...registerables)

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  logs: ILog[] = [];
  logSelected: ILog | undefined = undefined;
  numberOfErrorsLast31Days = 0;
  numberOfErrorsToday = 0;
  groupedByDate: { [key: string]: number } = {};

  dtOptions: ADTSettings = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtTrigger: Subject<any> = new Subject<any>();

  constructor (
    private loggerService: LoggerService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      destroy: true,
      language: {
        lengthMenu: '_MENU_'
      },
      order: [[0, 'desc']],
      columns: [
        {
          width: '20%',
        },
        {
          width: '50%',
        },
        {
          width: '20%',
        },
        {
          width: '10%'
        }
      ]
    }

    this.loaderService.setLoading(true, 'Cargando Logs');
    this.loggerService.getLogs().subscribe({
      next: (logs) => {
        this.logs = logs;
        this.RenderChart();
        this.rerender();
      }
    }).add(() => this.loaderService.setLoading(false, ''));
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(false)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  RenderChart() {
    this.numberOfErrorsLast31Days = this.logs.length;
    this.numberOfErrorsToday = this.logs.filter(l => new Date().getDay() === new Date(l.dateOfError).getDate()).length;

    const randomColors: string[] = [];

    const validDates: string[] = [];
    const startDate = new Date();

    for (let i = 0; i <= 31; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() - i);
      validDates.push(date.toLocaleDateString());
    }

    validDates.forEach((date) => {
      this.groupedByDate[date] = this.logs.filter((log) => {
        randomColors.push(`rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`)
        const errorDate = new Date(log.dateOfError).toLocaleDateString();

        if (errorDate === date) {
          return true;
        }

        return false;
      }).length
    });


    new Chart("historyChart", {
      type: 'line',
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
              text: $localize `# de errores`,
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
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }

  showException(logId: string) {
    this.logSelected = this.logs.find(l => l.id === logId);
    $("#logModal").modal("show");
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(false);
  }
}
