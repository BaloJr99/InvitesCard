import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';

describe('Page Not Found Component (Integrated Test)', () => {
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      providers: [
        provideRouter([
          {
            path: 'auth/login',
            loadChildren: () =>
              import('../../../../app/auth/auth.module').then(
                (m) => m.AuthModule
              ),
          },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();
  });

  it('should route to dashboard', () => {
    const navigateSpy = spyOn(router, 'navigate');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy)
      .withContext('Should redirect to /dashboard')
      .toHaveBeenCalledWith(['/dashboard']);
  });
});
