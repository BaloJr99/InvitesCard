import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterComponent } from 'src/app/shared/components/table/filter/filter.component';

describe('Filter Component (Shallow Test)', () => {
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
  });

  it('should render the filter button', () => {
    const filterButton = fixture.nativeElement.querySelector('button.filter');
    expect(filterButton)
      .withContext('The filter button should exist')
      .toBeTruthy();
  });

  it('should render the filter dialog', () => {
    fixture.componentRef.setInput('text', 'Name');
    fixture.componentRef.setInput('index', 0);

    let filterDialog = fixture.debugElement.query(
      By.css('.filter-dialog.show')
    );
    expect(filterDialog)
      .withContext(`The filter dialog shouldn't exist`)
      .toBeFalsy();

    const filterButton = fixture.debugElement.query(By.css('button.filter'));
    filterButton.nativeElement.click();
    fixture.detectChanges();

    filterDialog = fixture.debugElement.query(By.css('.filter-dialog.show'));
    expect(filterDialog)
      .withContext('The filter dialog should exist')
      .toBeTruthy();

    const header = filterDialog.query(By.css('.filter-dialog-header h3'));
    const input = filterDialog.query(By.css('.filter-dialog-body input'));
    const footer = filterDialog.query(By.css('.filter-dialog-footer'));
    const buttons = footer.queryAll(By.css('button'));

    expect(header.nativeElement.textContent)
      .withContext('The filter dialog header should be "Name"')
      .toContain('Name');

    expect(input)
      .withContext('The filter dialog should have an input')
      .toBeTruthy();

    expect(buttons.length)
      .withContext('The filter dialog should have two buttons')
      .toBe(2);
  });
});
