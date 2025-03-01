import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { NotAuthorizedComponent } from 'src/app/shared/components/not-authorized/not-authorized.component';

describe('Not Authorized Component (Shallow Test)', () => {
  let fixture: ComponentFixture<NotAuthorizedComponent>;

  beforeEach(async () => {
    const tokenSpy = jasmine.createSpyObj('TokenStorageService', ['signOut']);

    await TestBed.configureTestingModule({
      imports: [NotAuthorizedComponent],
      providers: [
        provideRouter([]),
        { provide: TokenStorageService, useValue: tokenSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotAuthorizedComponent);
    fixture.detectChanges();
  });

  it('created a page with a header, logout button and paragraph', () => {
    const header = fixture.debugElement.query(By.css('h1'));
    const warningParagraph = fixture.debugElement.query(By.css('p'));
    const logoutButton = fixture.debugElement.query(By.css('button'));

    expect(header).withContext("Header shouldn't be null").not.toBeNull();
    expect(warningParagraph)
      .withContext("Warning Paragraph input shouldn't be null")
      .not.toBeNull();
    expect(logoutButton)
      .withContext("Logout button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect logout button trigger logout', () => {
    spyOn(fixture.componentInstance, 'logout');

    const form = fixture.debugElement.query(By.css('button'));
    form.nativeElement.click();

    fixture.detectChanges();

    expect(fixture.componentInstance.logout)
      .withContext('Logout method should have been called')
      .toHaveBeenCalled();
  });
});
