import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { IEmitAction, ITable, ITableHeaders } from 'src/app/core/models/common';
import { ButtonAction } from 'src/app/core/models/enum';
import { ILog } from 'src/app/core/models/logs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LoggerService } from 'src/app/core/services/logger.service';
Chart.register(...registerables);

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
})
export class LogsComponent implements OnInit {
  logs: ILog[] = [];
  logSelected: ILog | undefined = undefined;
  numberOfErrorsLast31Days = 0;
  numberOfErrorsToday = 0;
  groupedByDate: { [key: string]: number } = {};

  table: ITable = {
    headers: [] as ITableHeaders[],
    data: [] as { [key: string]: string }[],
  } as ITable;

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
          this.logs = logs;
          this.table = this.getTableConfiguration(this.logs);
          this.RenderChart();
        },
      })
      .add(() => this.loaderService.setLoading(false));
  }

  RenderChart() {
    this.numberOfErrorsLast31Days = this.logs.length;
    this.numberOfErrorsToday = this.logs.filter(
      (log) => new Date().getDay() === new Date(log.dateOfError).getDate()
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
      this.groupedByDate[date] = this.logs.filter((log) => {
        randomColors.push(
          `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`
        );
        const errorDate = new Date(log.dateOfError).toLocaleDateString();

        if (errorDate === date) {
          return true;
        }

        return false;
      }).length;
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

  clearSelectedLog() {
    this.logSelected = undefined;
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    if (action.action === ButtonAction.View) {
      const logId = data[$localize`Acciones`];
      this.logSelected = this.logs.find((log) => log.id === logId);
      $('#logModal').modal('show');
    }
  }

  getTableConfiguration(logs: ILog[]): ITable {
    const headers = this.getHeaders();

    return {
      tableId: 'logsTable',
      headers: headers,
      data: logs.map((log) => {
        return this.getLogRow(log, headers);
      }),
      buttons: [
        {
          isDisabled: false,
          accessibleText: $localize`Ver log`,
          action: ButtonAction.View,
          innerHtml: '<i class="fa-solid fa-eye" aria-hidden="true"></i>',
          styles: 'background-color: #ADB5BD;',
        },
      ],
      useCheckbox: false,
      tableIndex: 0,
    };
  }

  getHeaders(): ITableHeaders[] {
    return [
      {
        text: $localize`Fecha del error`,
        sortable: true,
      },
      {
        text: $localize`Error`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`Usuario`,
        sortable: true,
        filterable: true,
      },
      {
        text: $localize`Acciones`,
      },
    ];
  }

  getLogRow(log: ILog, headers: ITableHeaders[]): { [key: string]: string } {
    const row: { [key: string]: string } = {};

    headers.forEach(({ text }) => {
      switch (text) {
        case $localize`Fecha del error`:
          row[text] = log.dateOfError;
          break;
        case $localize`Error`:
          row[text] = log.customError;
          break;
        case $localize`Usuario`:
          row[text] = log.userId;
          break;
        default:
          row[text] = log.id;
          break;
      }
    });

    return row;
  }
}
