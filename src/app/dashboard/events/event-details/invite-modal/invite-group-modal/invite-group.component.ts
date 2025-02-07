import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.css'],
})
export class InviteGroupComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private eventId: string = '';
  @Input() set eventIdValue(value: string) {
    this.eventId = value;
    this.createInviteGroupForm.patchValue({
      eventId: this.eventId,
    });
  }

  private inviteGroup: IInviteGroups | undefined;
  @Input() set inviteGroupValue(value: IInviteGroups | undefined) {
    if (value) {
      this.inviteGroup = value;
      this.createInviteGroupForm.patchValue({
        id: value.id,
        inviteGroup: value.inviteGroup,
      });
    }
  }

  @Output() updateInviteGroups: EventEmitter<IInviteGroupsAction> =
    new EventEmitter();
  @Output() isCreatingNewFormGroup: EventEmitter<boolean> = new EventEmitter();

  createInviteGroupForm = this.fb.group(
    {
      id: '',
      inviteGroup: ['', Validators.required],
      eventId: '',
      controlIsValid: true,
    },
    { validators: controlIsDuplicated }
  );

  constructor(
    private inviteGroupsService: InviteGroupsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  toggleIsCreatingNewFormGroup(): void {
    this.isCreatingNewFormGroup.emit(false);
  }

  saveInviteGroup(): void {
    if (this.createInviteGroupForm.valid && this.createInviteGroupForm.dirty) {
      if (this.createInviteGroupForm.controls['id'].value !== '') {
        this.updateInviteGroup();
      } else {
        this.createInviteGroup();
      }
    } else {
      this.createInviteGroupForm.markAllAsTouched();
    }
  }

  createInviteGroup() {
    this.loaderService.setLoading(true, $localize`Creando grupo`);
    this.createInviteGroupForm.patchValue({
      eventId: this.eventId,
    });
    this.inviteGroupsService
      .createInviteGroup(this.createInviteGroupForm.value as IInviteGroups)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateInviteGroups.emit({
            inviteGroup: {
              ...(this.createInviteGroupForm.value as IInviteGroups),
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateInviteGroup() {
    this.loaderService.setLoading(true, $localize`Actualizando grupo`);
    this.inviteGroupsService
      .updateInviteGroup(
        this.createInviteGroupForm.value as IInviteGroups,
        this.createInviteGroupForm.controls['id'].value as string
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateInviteGroups.emit({
            inviteGroup: {
              ...(this.createInviteGroupForm.value as IInviteGroups),
            },
            isNew: false,
          });
          this.toastr.success(response.message);
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  checkInviteGroup(event: Event) {
    const inviteGroup = (event.target as HTMLInputElement).value;
    if (inviteGroup === this.inviteGroup?.inviteGroup) {
      this.createInviteGroupForm.patchValue({ controlIsValid: true });
      return;
    }

    if (inviteGroup === '') {
      this.createInviteGroupForm.patchValue({ controlIsValid: true });
      return;
    }

    this.inviteGroupsService
      .checkInviteGroup(this.eventId, inviteGroup)
      .subscribe({
        next: (response: boolean) => {
          this.createInviteGroupForm.patchValue({ controlIsValid: !response });
          this.createInviteGroupForm.updateValueAndValidity();
        },
      });
  }
}
