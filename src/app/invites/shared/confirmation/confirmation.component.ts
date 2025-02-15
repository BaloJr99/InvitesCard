import {
  Component,
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
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { IConfirmation, IUserInvite } from 'src/app/core/models/invites';
import { SocketService } from 'src/app/core/services/socket.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ActivatedRoute } from '@angular/router';
import { EventType } from 'src/app/core/models/enum';
import { dateTimeToUTCDate } from 'src/app/shared/utils/tools';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private invite = new BehaviorSubject<IUserInvite>({} as IUserInvite);
  invite$ = this.invite.asObservable();

  private blockConfirmationForm = new BehaviorSubject<boolean>(false);
  blockConfirmationForm$ = this.blockConfirmationForm.asObservable();

  @Input() set inviteValue(value: IUserInvite) {
    this.invite.next(value);
  }

  @Input() set deadlineMetValue(value: boolean) {
    this.blockConfirmationForm.next(value);
  }

  @Output() newInvite = new EventEmitter<FormGroup>();

  vm$ = combineLatest([this.invite$, this.blockConfirmationForm$]).pipe(
    map(([invite, blockConfirmationForm]) => {
      const numberOfEntries = Array.from(
        { length: invite.entriesNumber },
        (k, j) => j + 1
      )
        .sort((a, b) => b - a)
        .map((entry) => entry.toString());

      if (blockConfirmationForm) this.confirmationForm.disable();

      return { invite, blockConfirmationForm, numberOfEntries };
    })
  );

  confirmationForm: FormGroup = this.fb.group({
    confirmation: ['true', Validators.required],
    entriesConfirmed: ['', Validators.required],
    message: [''],
  });

  constructor(
    private fb: FormBuilder,
    private invitesService: InvitesService,
    private socket: SocketService,
    private activatedRoute: ActivatedRoute
  ) {}

  saveInformation(): void {
    if (this.confirmationForm.valid && this.confirmationForm.dirty) {
      const assist =
        this.confirmationForm.controls['confirmation'].value === 'true';
      const entriesConfirmed = parseInt(
        this.confirmationForm.controls['entriesConfirmed'].value
      );
      this.confirmationForm.patchValue({
        confirmation: assist,
        entriesConfirmed: isNaN(entriesConfirmed) ? 0 : entriesConfirmed,
      });

      this.confirmationForm.addControl(
        'dateOfConfirmation',
        new FormControl(dateTimeToUTCDate(new Date().toString()))
      );
      this.addnewInvite();
    } else {
      this.confirmationForm.markAllAsTouched();
    }
  }

  addnewInvite() {
    this.invitesService
      .sendConfirmation(
        this.confirmationForm.value as IConfirmation,
        this.invite.value.id,
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
      });
  }

  showDiv(): void {
    this.invite.value.confirmation =
      this.confirmationForm.controls['confirmation'].value;
  }

  enableControls(): void {
    const select = document.getElementById(
      'entriesConfirmed'
    ) as HTMLSelectElement;
    select.removeAttribute('disabled');

    this.confirmationForm.patchValue({
      entriesConfirmed: '',
    });

    this.confirmationForm
      .get('entriesConfirmed')
      ?.setValidators(Validators.required);
    this.confirmationForm.markAllAsTouched();
  }

  disableControls(): void {
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
}
