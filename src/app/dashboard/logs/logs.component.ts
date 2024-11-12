import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { ILog } from 'src/app/core/models/logs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LoggerService } from 'src/app/core/services/logger.service';
Chart.register(...registerables);

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
})
export class LogsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  logSelected: ILog | undefined = undefined;
  numberOfErrorsLast31Days = 0;
  numberOfErrorsToday = 0;
  groupedByDate: { [key: string]: number } = {};

  dtOptions: ADTSettings = {
    searching: false,
    destroy: true,
    language: {
      lengthMenu: '_MENU_',
    },
    columnDefs: [
      {
        className: 'text-center',
        targets: '_all',
      },
    ],
    order: [[0, 'desc']],
    columns: [
      { title: $localize`Fecha del error`, data: 'dateOfError', width: '20%' },
      { title: $localize`Error`, data: 'customError', width: '50%' },
      { title: $localize`Usuario`, data: 'userId', width: '20%' },
      {
        title: $localize`Acciones`,
        data: 'id',
        render(data) {
          return `<button class="btn btn-secondary log-btn" data-id="${data}"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>`;
        },
      },
    ],
  };
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();

  constructor(
    private loggerService: LoggerService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.setLoading(true, $localize`Cargando Logs`);
    this.loggerService
      .getLogs()
      .subscribe({
        next: (logs) => {
          this.dtOptions.data = logs;
          this.RenderChart();
          this.rerender();
        },
      })
      .add(() => this.loaderService.setLoading(false));
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);

    // Delegate click event for edit buttons
    $(document).on('click', '.log-btn', (event) => {
      const logId = $(event.currentTarget).data('id');
      this.showException(logId);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  RenderChart() {
    this.numberOfErrorsLast31Days = (this.dtOptions.data as ILog[]).length;
    this.numberOfErrorsToday = (this.dtOptions.data as ILog[]).filter(
      (l) => new Date().getDay() === new Date(l.dateOfError).getDate()
    ).length;

    const randomColors: string[] = [];

    const validDates: string[] = [];
    const startDate = new Date();

    for (let i = 0; i <= 31; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() - i);
      validDates.push(date.toLocaleDateString());
    }

    validDates.forEach((date) => {
      this.groupedByDate[date] = (this.dtOptions.data as ILog[]).filter(
        (log) => {
          randomColors.push(
            `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`
          );
          const errorDate = new Date(log.dateOfError).toLocaleDateString();

          if (errorDate === date) {
            return true;
          }

          return false;
        }
      ).length;
    });

    new Chart('historyChart', {
      type: 'line',
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
              text: $localize`# de errores`,
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
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }

  showException(logId: string) {
    this.logSelected = (this.dtOptions.data as ILog[]).find(
      (l) => l.id === logId
    );
    $('#logModal').modal('show');
  }

  clearSelectedLog() {
    this.logSelected = undefined;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.destroy();
    });
    this.dtTrigger.next(this.dtOptions);
  }
}
