import { FilterComponent } from 'src/app/shared/components/table/filter/filter.component';

describe('Filter Component (Isolated Test)', () => {
  let component: FilterComponent;

  beforeEach(() => {
    component = new FilterComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render initial values', () => {
    expect(component.text).withContext('text should be empty').toBe('');
    expect(component.index).withContext('index should be 0').toBe(0);
    expect(component.filterIsVisible)
      .withContext('filterIsVisible should be false')
      .toBeFalse();
  });
});
