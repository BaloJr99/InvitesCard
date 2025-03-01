import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AlbumModalComponent } from 'src/app/gallery/albums/album-modal/album-modal.component';
import { albumMock } from 'src/tests/mocks/mocks';

describe('AlbumModalComponent (Shallow Test)', () => {
  let fixture: ComponentFixture<AlbumModalComponent>;

  const updateFormUsingEvent = (nameOfAlbum: string) => {
    const nameOfAlbumInput = fixture.debugElement.query(By.css('#nameOfAlbum'));

    nameOfAlbumInput.nativeElement.value = nameOfAlbum;
    nameOfAlbumInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['']);

    await TestBed.configureTestingModule({
      imports: [AlbumModalComponent],
      providers: [
        {
          provide: ToastrService,
          useValue: toastrSpy,
        },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumModalComponent);
    fixture.detectChanges();
  });

  it('created a form with nameOfAlbum, 2 buttons (save, close)', () => {
    const nameOfAlbumInput = fixture.debugElement.query(By.css('#nameOfAlbum'));

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const closeButton = buttons[1];
    const saveButton = buttons[2];

    expect(nameOfAlbumInput)
      .withContext("name of album input shouldn't be null")
      .not.toBeNull();

    expect(closeButton)
      .withContext("close button shouldn't be null")
      .not.toBeNull();

    expect(saveButton)
      .withContext("save button shouldn't be null")
      .not.toBeNull();
  });

  it('Expect form controls to be filled when user fills inputs', () => {
    updateFormUsingEvent(albumMock.nameOfAlbum);

    expect(
      fixture.componentInstance.createAlbumForm.controls['nameOfAlbum'].value
    )
      .withContext('name of album control should be filled when input changes')
      .toBe(albumMock.nameOfAlbum);
  });

  it('Expect save button to trigger saveAlbum', () => {
    spyOn(fixture.componentInstance, 'saveAlbum');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const saveButton = buttons[2];

    saveButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.saveAlbum)
      .withContext('saveAlbum method should have been called')
      .toHaveBeenCalled();
  });

  it('Display error messages when fields are blank', () => {
    updateFormUsingEvent('');

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    const nameOfAlbumErrorSpan = errorSpans[0];

    expect(nameOfAlbumErrorSpan.nativeElement.innerHTML)
      .withContext('Name of album span for error should be filled')
      .toContain('El nombre del album es requerido');
  });

  it("Shouldn't display error message when fields are filled", () => {
    updateFormUsingEvent(albumMock.nameOfAlbum);
    fixture.detectChanges();

    const errorSpans = fixture.debugElement.queryAll(
      By.css('.invalid-feedback')
    );

    expect(errorSpans.length)
      .withContext('Should not display any error messages')
      .toBe(0);
  });
});
