import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUpsertInvite, IInviteAction } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css'],
})
export class InviteModalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set inviteActionValue(inviteAction: IInviteAction) {
    if (inviteAction) {
      this.createInviteForm.patchValue({
        id: inviteAction.invite.id,
        family: inviteAction.invite.family,
        entriesNumber: inviteAction.invite.entriesNumber,
        phoneNumber: inviteAction.invite.phoneNumber,
        inviteGroupId: inviteAction.invite.inviteGroupId,
        kidsAllowed: inviteAction.invite.kidsAllowed,
        eventId: inviteAction.invite.eventId,
      });
    }
  }
  @Input() eventId!: string;
  @Input() inviteGroups!: IInviteGroups[];
  @Output() updateInvites: EventEmitter<IInviteAction> = new EventEmitter();
  @Output() updateInviteGroups: EventEmitter<IInviteGroupsAction> =
    new EventEmitter();

  createInviteForm: FormGroup = this.fb.group({
    id: '',
    family: [$localize`Familia`, Validators.required],
    entriesNumber: [1, Validators.required],
    phoneNumber: [
      '878',
      [Validators.required, Validators.pattern('[0-9]{10}')],
    ],
    inviteGroupId: ['', Validators.required],
    kidsAllowed: [true, Validators.required],
    eventId: '',
    inviteViewed: null,
  });

  showNewGroupForm = false;
  groupSelected: IInviteGroups | undefined = undefined;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private invitesService: InvitesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    this.validationMessages = {
      family: {
        required: $localize`Ingresar familia`,
      },
      entriesNumber: {
        required: $localize`Ingresar numero de invitaciones`,
      },
      phoneNumber: {
        required: $localize`Ingresar numero de telefono`,
        pattern: $localize`Numero de telefono invalido`,
      },
      inviteGroupId: {
        required: $localize`Seleccionar grupo`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    $('#inviteModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    });
  }

  saveInvite() {
    if (this.createInviteForm.valid && this.createInviteForm.dirty) {
      if (
        this.createInviteForm.controls['id'].value !== '' &&
        this.createInviteForm.controls['id'].value !== null
      ) {
        this.updateInvite();
      } else {
        this.createInvite();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.createInviteForm,
        true
      );
    }
  }

  createInvite() {
    this.loaderService.setLoading(true, $localize`Creando invitación`);
    this.invitesService
      .createInvite(this.formatInvite())
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateInvites.emit({
            invite: {
              ...this.formatInvite(),
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
          $('#inviteModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateInvite() {
    this.loaderService.setLoading(true, $localize`Actualizando invitación`);
    this.invitesService
      .updateInvite(
        this.formatInvite(),
        this.createInviteForm.controls['id'].value
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateInvites.emit({
            invite: this.formatInvite(),
            isNew: false,
          });
          this.toastr.success(response.message);
          $('#inviteModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  clearInputs(): void {
    this.createInviteForm.reset({
      family: $localize`Familia`,
      entriesNumber: 1,
      phoneNumber: '878',
      inviteGroupId: '',
      kidsAllowed: true,
    });

    this.displayMessage = {};

    this.showNewGroupForm = false;
  }

  formatInvite(): IUpsertInvite {
    return {
      ...this.createInviteForm.value,
      entriesNumber: parseInt(
        this.createInviteForm.controls['entriesNumber'].value
      ),
      eventId: this.eventId,
    } as IUpsertInvite;
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createInviteForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(
        this.createInviteForm
      );
    });
  }

  inviteGroupAction(isEditing: boolean, showNewGroupForm: boolean) {
    if (isEditing) {
      this.groupSelected = this.inviteGroups.find(
        (famGroup) =>
          famGroup.id === this.createInviteForm.controls['inviteGroupId'].value
      );
      this.showNewGroupForm = showNewGroupForm;
    } else if (!isEditing && showNewGroupForm) {
      this.groupSelected = undefined;
      this.showNewGroupForm = showNewGroupForm;
    } else {
      this.showNewGroupForm = showNewGroupForm;
    }
  }

  updateCurrentInviteGroup(event: IInviteGroupsAction) {
    this.createInviteForm.patchValue({
      inviteGroupId: event.inviteGroup.id,
    });
    this.updateInviteGroups.emit(event);
    this.showNewGroupForm = false;
  }
}
