import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BehaviorSubject, map } from 'rxjs';
import { IEmitAction, ITable, ITableHeaders } from 'src/app/core/models/common';
import { ButtonAction } from 'src/app/core/models/enum';
import { ILog } from 'src/app/core/models/logs';
import { LoggerService } from 'src/app/core/services/logger.service';
import { toLocalDate } from 'src/app/shared/utils/tools';
Chart.register(...registerables);

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
})
export class LogsComponent {
  private logs = new BehaviorSubject<ILog[]>([]);
  logs$ = this.logs.asObservable();

  logSelected: ILog = {} as ILog;
  showLogModal = false;

  constructor(private loggerService: LoggerService) {}

  vm$ = this.loggerService.getLogs().pipe(
    map((logs) => {
      const formattedLogs = logs.map((log) => {
        return {
          ...log,
          dateOfError: toLocalDate(log.dateOfError),
        } as ILog;
      });
      this.logs.next(formattedLogs);

      return {
        table: this.getTableConfiguration(formattedLogs),
      };
    })
  );

  history$ = this.logs$.pipe(
    map((logs) => {
      return this.RenderChart(logs);
    })
  );

  RenderChart(logs: ILog[]) {
    const numberOfErrorsLast31Days = logs.length;
    const numberOfErrorsToday = logs.filter(
      (log) => new Date().getDay() === new Date(log.dateOfError).getDay()
    ).length;

    const groupedByDate: { [key: string]: number } = {};

    const randomColors: string[] = [];

    const validDates: string[] = [];
    const startDate = new Date();

    for (let i = 0; i <= 31; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() - i);
      validDates.push(date.toLocaleDateString());
    }

    validDates.forEach((date) => {
      groupedByDate[date] = logs.filter((log) => {
        randomColors.push(
          `rgb(${this.randomNum()}, ${this.randomNum()}, ${this.randomNum()})`
        );
        const errorDate = toLocalDate(log.dateOfError);

        if (errorDate === date) {
          return true;
        }

        return false;
      }).length;
    });

    new Chart('historyChart', {
      type: 'line',
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

    return { numberOfErrorsLast31Days, numberOfErrorsToday };
  }

  randomNum() {
    return Math.floor(Math.random() * (235 - 52 + 1) + 52);
  }

  closeLogModal() {
    this.showLogModal = false;
  }

  actionResponse(action: IEmitAction): void {
    const data = action.data as { [key: string]: string };
    if (action.action === ButtonAction.View) {
      const logId = data[$localize`Acciones`];
      this.logSelected = this.logs.value.find(
        (log) => log.id === logId
      ) as ILog;
      this.showLogModal = true;
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
