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
import { IConfirmation, IUserInvite } from 'src/app/core/models/invites';
import { SocketService } from 'src/app/core/services/socket.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InvitesService } from 'src/app/core/services/invites.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accomodation',
  templateUrl: './accomodation.component.html',
  styleUrls: ['./accomodation.component.css'],
})
export class AccomodationComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  @Input() invite!: IUserInvite;
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
      confirmation: ['true', Validators.required],
    });
  }

  saveInformation(): void {
    const assist =
      this.accomodationForm.controls['confirmation'].value === 'true';
    this.accomodationForm.patchValue({ confirmation: assist });
    this.accomodationForm.addControl(
      'dateOfConfirmation',
      new FormControl(new Date().toISOString())
    );
    this.addnewInvite();
  }

  addnewInvite() {
    if (this.invite.id) {
      this.loaderService.setLoading(true, $localize`Enviando confirmación`);
      this.invitesService
        .sendConfirmation(
          this.accomodationForm.value as IConfirmation,
          this.invite.id
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
    this.invite.confirmation = this.accomodationForm.get('confirmation')?.value;
  }
}
