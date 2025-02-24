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
  FormControlName,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ISaveTheDateUserInvite } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { EventType } from 'src/app/core/models/enum';
import { ISaveTheDateSetting } from 'src/app/core/models/settings';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrls: ['./accomodation.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AccomodationComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private invite = new BehaviorSubject<ISaveTheDateUserInvite>(
    {} as ISaveTheDateUserInvite
  );
  invite$ = this.invite.asObservable();
  private inviteSettings = new BehaviorSubject<ISaveTheDateSetting>(
    {} as ISaveTheDateSetting
  );
  inviteSettings$ = this.inviteSettings.asObservable();
  private deadlineMet = new BehaviorSubject<boolean>(false);
  deadlineMet$ = this.deadlineMet.asObservable();

  @Input() set inviteValue(value: ISaveTheDateUserInvite) {
    this.invite.next(value);
  }

  @Input() set inviteSettingsValue(value: ISaveTheDateSetting) {
    this.inviteSettings.next(value);
  }

  @Input() set deadlineMetValue(value: boolean) {
    this.deadlineMet.next(value);
  }

  vm$ = combineLatest([
    this.invite$,
    this.inviteSettings$,
    this.deadlineMet$,
  ]).pipe(
    map(([invite, inviteSettings, deadlineMet]) => {
      if (deadlineMet === true) {
        this.accomodationForm.disable();
      }
      return {
        blockAccomodationForm: deadlineMet,
        invite,
        inviteSettings,
      };
    })
  );

  @Output() newInvite = new EventEmitter<FormGroup>();

  accomodationForm: FormGroup = this.fb.group({
    needsAccomodation: [true, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private invitesService: InvitesService
  ) {}

  saveInformation(): void {
    this.invitesService
      .sendConfirmation(
        this.formatForm(),
        this.invite.value.id,
        EventType.SaveTheDate
      )
      .subscribe({
        next: () => {
          this.invite.next({
            ...this.invite.value,
            needsAccomodation: true,
          });
        },
      });
  }

  formatForm() {
    return {
      ...this.accomodationForm.value,
      needsAccomodation: Boolean(
        JSON.parse(this.accomodationForm.controls['needsAccomodation'].value)
      ),
    };
  }
}
