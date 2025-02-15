import { LogsModalComponent } from 'src/app/dashboard/logs/logs-modal/logs-modal.component';

describe('Logs Modal Component (Isolated Test)', () => {
  let component: LogsModalComponent;

  beforeEach(() => {
    component = new LogsModalComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
