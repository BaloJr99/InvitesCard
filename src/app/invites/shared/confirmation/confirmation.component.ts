import {
  Component,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { IConfirmation, IUserInvite } from 'src/app/core/models/invites';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { SocketService } from 'src/app/core/services/socket.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ActivatedRoute } from '@angular/router';
import { EventType } from 'src/app/core/models/enum';
import { dateTimeToUTCDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  invite: IUserInvite = {} as IUserInvite;
  @Input() set inviteValue(value: IUserInvite) {
    this.invite = value;
    const { entriesNumber } = value;
    const numberOfEntries = Array.from(
      { length: entriesNumber },
      (k, j) => j + 1
    ).sort((a, b) => b - a);
    this.numberOfEntries.next(numberOfEntries.map((entry) => entry.toString()));
  }

  blockConfirmationForm = false;
  @Input() set deadlineMet(value: boolean) {
    this.blockConfirmationForm = value;
    if (value === true) {
      this.confirmationForm.disable();
    }
  }

  @Output() newInvite = new EventEmitter<FormGroup>();

  private numberOfEntries = new BehaviorSubject<string[]>([]);
  numberOfEntries$ = this.numberOfEntries.asObservable();

  confirmationForm: FormGroup = this.fb.group({
    confirmation: ['true', Validators.required],
    entriesConfirmed: ['', Validators.required],
    message: [''],
  });

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private invitesService: InvitesService,
    private socket: SocketService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
  ) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      entriesConfirmed: {
        required: $localize`Favor de seleccionar`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  saveInformation(): void {
    if (this.confirmationForm.valid && this.confirmationForm.dirty) {
      const assist =
        this.confirmationForm.controls['confirmation'].value === 'true';
      const entriesConfirmed = parseInt(
        this.confirmationForm.controls['entriesConfirmed'].value
      );
      this.confirmationForm.get('confirmation')?.setValue(assist);
      this.confirmationForm
        .get('entriesConfirmed')
        ?.setValue(isNaN(entriesConfirmed) ? 0 : entriesConfirmed);
      this.confirmationForm.addControl(
        'dateOfConfirmation',
        new FormControl(dateTimeToUTCDate(new Date().toString()))
      );
      this.addnewInvite();
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.confirmationForm,
        true
      );
    }
  }

  addnewInvite() {
    if (this.invite.id) {
      this.loaderService.setLoading(true, $localize`Enviando confirmación`);
      this.invitesService
        .sendConfirmation(
          this.confirmationForm.value as IConfirmation,
          this.invite.id,
          EventType.Xv
        )
        .subscribe({
          next: () => {
            this.showDiv();
            const inviteInfo = {
              ...this.confirmationForm.value,
              id: this.activatedRoute.snapshot.paramMap.get('id'),
            };
            this.socket.sendNotification(inviteInfo);
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  showDiv(): void {
    this.invite.confirmation = this.confirmationForm.get('confirmation')?.value;
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(
      this.confirmationForm.get('confirmation')?.valueChanges,
      ...controlBlurs
    ).subscribe(() => {
      if (this.confirmationForm.controls['confirmation'].value === 'true') {
        const select = document.getElementById(
          'entriesConfirmed'
        ) as HTMLSelectElement;
        select.removeAttribute('disabled');
        if (this.confirmationForm.get('entriesConfirmed')?.value === '') {
          this.confirmationForm.patchValue({
            entriesConfirmed: '',
          });
        }
        this.confirmationForm
          .get('entriesConfirmed')
          ?.setValidators(Validators.required);
        this.confirmationForm.updateValueAndValidity();
      } else if (
        this.confirmationForm.controls['confirmation'].value === 'false'
      ) {
        const select = document.getElementById(
          'entriesConfirmed'
        ) as HTMLSelectElement;
        select.setAttribute('disabled', '');
        this.confirmationForm.patchValue({
          entriesConfirmed: '',
        });
        this.confirmationForm.get('entriesConfirmed')?.clearValidators();
        this.confirmationForm.get('entriesConfirmed')?.updateValueAndValidity();
      }
      this.displayMessage = this.genericValidator.processMessages(
        this.confirmationForm
      );
    });
  }
}
