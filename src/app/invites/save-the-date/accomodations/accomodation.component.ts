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
} from '@angular/forms';
import { ISaveTheDateConfirmation, ISaveTheDateUserInvite } from 'src/app/core/models/invites';
import { SocketService } from 'src/app/core/services/socket.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ActivatedRoute } from '@angular/router';
import { EventType } from 'src/app/core/models/enum';
import { ISaveTheDateSetting } from 'src/app/core/models/settings';

@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrls: ['./accomodation.component.css'],
})
export class AccomodationComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @Input() invite!: ISaveTheDateUserInvite;
  @Input() inviteSettings!: ISaveTheDateSetting;
  @Input() set deadlineMet(value: boolean) {
    this.blockAccomodationForm = value;
    if (value === true) {
      this.accomodationForm.disable();
    }
  }
  @Output() newInvite = new EventEmitter<FormGroup>();

  blockAccomodationForm = false;
  accomodationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invitesService: InvitesService,
    private socket: SocketService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute
  ) {
    this.accomodationForm = this.fb.group({
      needsAccomodation: ['true', Validators.required],
    });
  }

  saveInformation(): void {
    const assist =
      this.accomodationForm.controls['needsAccomodation'].value === 'true';
    this.accomodationForm.patchValue({ needsAccomodation: assist });
    this.sendUserResponse();
  }

  sendUserResponse() {
    if (this.invite.id) {
      this.loaderService.setLoading(true, $localize`Enviando confirmación`);
      this.invitesService
        .sendConfirmation(
          this.accomodationForm.value as ISaveTheDateConfirmation,
          this.invite.id,
          EventType.SaveTheDate
        )
        .subscribe({
          next: () => {
            this.showDiv();
            const inviteInfo = {
              ...this.accomodationForm.value,
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
    this.invite.needsAccomodation = this.accomodationForm.get('needsAccomodation')?.value;
  }
}
