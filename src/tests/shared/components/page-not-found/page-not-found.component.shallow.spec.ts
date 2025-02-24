import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';

describe('Page Not Found (Shallow Test)', () => {
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [
        provideRouter([
          {
            path: 'dashboard',
            loadComponent: () =>
              import('src/app/dashboard/dashboard.component').then(
                (m) => m.DashboardComponent
              ),
          },
        ]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();
  });

  it('created a page with a header, image, paragraph and go to dashboard button', () => {
    const header = fixture.debugElement.query(By.css('h1'));
    const image = fixture.debugElement.query(By.css('img'));
    const warningParagraph = fixture.debugElement.query(By.css('p'));
    const logoutButton = fixture.debugElement.query(By.css('button'));

    expect(header).withContext("Header shouldn't be null").not.toBeNull();
    expect(header.nativeElement.innerHTML)
      .withContext('Header should contain 404')
      .toContain('404');
    expect(image).withContext("Image shouldn't be null").not.toBeNull();
    expect(warningParagraph)
      .withContext("Warning Paragraph input shouldn't be null")
      .not.toBeNull();
    expect(logoutButton)
      .withContext("Logout button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect Go to Dashboard button trigger goToDashboard', () => {
    spyOn(fixture.componentInstance, 'goToDashboard');

    const goToDashboardButton = fixture.debugElement.query(By.css('button'));
    goToDashboardButton.nativeElement.click();

    fixture.detectChanges();

    expect(fixture.componentInstance.goToDashboard)
      .withContext('GoToDashboard method should have been called')
      .toHaveBeenCalled();
  });
});
