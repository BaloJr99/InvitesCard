import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';

describe('Page Not Found Component (Integrated Test)', () => {
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent],
      providers: [
        provideRouter([
          {
            path: 'auth/login',
            loadChildren: () =>
              import('../../../../app/auth/login/login.component').then(
                (m) => m.LoginComponent
              ),
          },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();
  });

  it('should route to dashboard', () => {
    spyOn(router, 'navigate');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(router.navigate)
      .withContext('Should redirect to /dashboard')
      .toHaveBeenCalledWith(['/dashboard']);
  });
});
