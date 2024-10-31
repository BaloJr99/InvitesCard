import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NotAuthorizedComponent } from 'src/app/shared/components/not-authorized/not-authorized.component';

describe('Not Authorized Component (Integrated Test)', () => {
  let fixture: ComponentFixture<NotAuthorizedComponent>;
  let router: Router;
  let tokenStorageServiceSpy: jasmine.SpyObj<TokenStorageService>;

  beforeEach(waitForAsync(() => {
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['signOut']);

    TestBed.configureTestingModule({
      declarations: [NotAuthorizedComponent],
      providers: [
        { provide: TokenStorageService, useValue: tokenSpy },
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
    tokenStorageServiceSpy = TestBed.inject(
      TokenStorageService
    ) as jasmine.SpyObj<TokenStorageService>;
  }));

  beforeEach(() => {
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
    const navigateSpy = spyOn(router, 'navigate');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(navigateSpy)
      .withContext('Should redirect to auth/login')
      .toHaveBeenCalledWith(['/auth/login']);
  });
});
