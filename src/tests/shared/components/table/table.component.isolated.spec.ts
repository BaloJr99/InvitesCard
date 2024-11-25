import { TableComponent } from 'src/app/shared/components/table/table.component';

describe('Table Component (Isolated Test)', () => {
  let component: TableComponent;

  beforeEach(() => {
    component = new TableComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.containsData)
      .withContext('containsData should be false')
      .toBeFalse();
  });
});
