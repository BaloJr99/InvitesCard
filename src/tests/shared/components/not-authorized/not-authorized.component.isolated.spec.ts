import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NotAuthorizedComponent } from 'src/app/shared/components/not-authorized/not-authorized.component';

describe('Not Authorized Component (Isolated Test)', () => {
  let component: NotAuthorizedComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['']);
  const tokenStorageServiceSpy = jasmine.createSpyObj('TokenStorageService', [
    '',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TokenStorageService, useValue: tokenStorageServiceSpy },
      ],
    });

    component = TestBed.createComponent(NotAuthorizedComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
