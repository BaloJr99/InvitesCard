import { TestBed } from '@angular/core/testing';
import { EntriesComponent } from './entries.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [EntriesComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(EntriesComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'invites'`, () => {
    const fixture = TestBed.createComponent(EntriesComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('invites');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(EntriesComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('invites app is running!');
  });
});
