import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import { IMessageResponse } from 'src/app/core/models/common';
import { IUpsertInvite, IInviteAction } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css'],
})
export class InviteModalComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private inviteAction = new BehaviorSubject<IInviteAction>({
    invite: {
      id: '',
      family: '',
      entriesNumber: 1,
      phoneNumber: '',
      inviteGroupId: '',
      kidsAllowed: true,
      eventId: '',
    },
    isNew: false,
  });
  inviteAction$ = this.inviteAction.asObservable();

  private inviteGroups = new BehaviorSubject<IInviteGroups[]>([]);
  inviteGroups$ = this.inviteGroups.asObservable();

  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set inviteGroupsValue(inviteGroups: IInviteGroups[]) {
    this.inviteGroups.next(inviteGroups);
  }
  @Input() set inviteActionValue(inviteAction: IInviteAction) {
    this.inviteAction.next(inviteAction);
  }
  @Input() set showModalValue(showModal: boolean) {
    this.showModal.next(showModal);
  }

  @Output() updateInvites: EventEmitter<IInviteAction> = new EventEmitter();
  @Output() updateInviteGroups: EventEmitter<IInviteGroupsAction> =
    new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  createInviteForm: FormGroup = this.fb.group({
    id: '',
    family: ['', Validators.required],
    entriesNumber: [1, Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    inviteGroupId: ['', Validators.required],
    kidsAllowed: [true, Validators.required],
    eventId: '',
    inviteViewed: null,
  });

  showNewGroupForm = false;
  groupSelected!: IInviteGroups;

  constructor(
    private invitesService: InvitesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  vm$ = combineLatest([
    this.inviteAction$,
    this.inviteGroups$,
    this.showModal$,
  ]).pipe(
    map(([inviteAction, inviteGroups, showModal]) => {
      if (showModal) {
        $('#inviteModal').modal('show');

        // Emit event to close modal when it's closed
        $('#inviteModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        $('#inviteModal').modal('hide');
      }

      this.clearInputs();
      this.createInviteForm.patchValue(inviteAction.invite);
      return {
        inviteAction,
        inviteGroups,
      };
    })
  );

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
      this.createInviteForm.markAllAsTouched();
    }
  }

  createInvite() {
    this.invitesService.createInvite(this.formatInvite()).subscribe({
      next: (response: IMessageResponse) => {
        this.updateInvites.emit({
          invite: {
            ...this.formatInvite(),
            id: response.id,
          },
          isNew: true,
        });
        this.toastr.success(response.message);
        this.closeModal.emit();
      },
    });
  }

  updateInvite() {
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
          this.closeModal.emit();
        },
      });
  }

  clearInputs(): void {
    this.createInviteForm.reset({
      family: '',
      entriesNumber: 1,
      phoneNumber: '',
      inviteGroupId: '',
      kidsAllowed: true,
    });

    this.showNewGroupForm = false;
  }

  formatInvite(): IUpsertInvite {
    return {
      ...this.createInviteForm.value,
      entriesNumber: parseInt(
        this.createInviteForm.controls['entriesNumber'].value
      ),
    } as IUpsertInvite;
  }

  inviteGroupAction(isEditing: boolean, showNewGroupForm: boolean) {
    const eventId = this.inviteAction.value.invite.eventId;
    if (isEditing) {
      this.groupSelected = {
        ...(this.inviteGroups.value.find(
          (famGroup) =>
            famGroup.id ===
            this.createInviteForm.controls['inviteGroupId'].value
        ) as IInviteGroups),
        eventId,
      };
      this.showNewGroupForm = showNewGroupForm;
    } else if (!isEditing && showNewGroupForm) {
      this.groupSelected = {
        id: '',
        inviteGroup: '',
        eventId,
      };
      this.showNewGroupForm = showNewGroupForm;
    } else {
      this.showNewGroupForm = showNewGroupForm;
    }
  }

  updateCurrentInviteGroup(event: IInviteGroupsAction) {
    this.showNewGroupForm = false;
    this.updateInviteGroups.emit(event);
    this.createInviteForm.patchValue({
      inviteGroupId: event.inviteGroup.id,
    });
  }
}
