import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NotAuthorizedComponent } from 'src/app/shared/components/not-authorized/not-authorized.component';

describe('Not Authorized Component (Integrated Test)', () => {
  let fixture: ComponentFixture<NotAuthorizedComponent>;
  let router: Router;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  beforeEach(async () => {
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['signOut']);

    await TestBed.configureTestingModule({
      imports: [NotAuthorizedComponent],
      providers: [
        { provide: TokenStorageService, useValue: tokenSpy },
        provideRouter([
          {
            path: 'auth/login',
            loadComponent: () =>
              import('../../../../app/auth/login/login.component').then(
                (m) => m.LoginComponent
              ),
          },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;

    fixture = TestBed.createComponent(NotAuthorizedComponent);
    fixture.detectChanges();
  });

  it('token storage service signOut() should called', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    fixture.detectChanges();

    expect(tokenStorageServiceSpy.signOut)
      .withContext(
        "signOut method from TokenStorageService should've been called"
      )
      .toHaveBeenCalled();
  });

  it('should route to auth login', () => {
    spyOn(router, 'navigate');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(router.navigate)
      .withContext('Should redirect to auth/login')
      .toHaveBeenCalledWith(['/auth/login']);
  });
});
