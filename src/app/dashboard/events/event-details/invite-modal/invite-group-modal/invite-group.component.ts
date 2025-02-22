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
import { IMessageResponse } from 'src/app/core/models/common';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.css'],
  standalone: false,
})
export class InviteGroupComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private inviteGroup!: IInviteGroups;
  @Input() set inviteGroupValue(value: IInviteGroups) {
    this.inviteGroup = value;
    this.createInviteGroupForm.patchValue({
      id: value.id,
      inviteGroup: value.inviteGroup,
      eventId: value.eventId,
    });
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
    private toastr: ToastrService
  ) {}

  toggleIsCreatingNewFormGroup(): void {
    this.isCreatingNewFormGroup.emit(false);
  }

  saveInviteGroup(): void {
    if (this.createInviteGroupForm.valid && this.createInviteGroupForm.dirty) {
      this.inviteGroupDuplicated(
        this.createInviteGroupForm.controls['inviteGroup'].value as string
      ).subscribe({
        next: (isDuplicated: boolean) => {
          if (!isDuplicated) {
            if (this.createInviteGroupForm.controls['id'].value !== '') {
              this.updateInviteGroup();
            } else {
              this.createInviteGroup();
            }
          }
        },
      });
    } else {
      this.createInviteGroupForm.markAllAsTouched();
    }
  }

  createInviteGroup() {
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
      });
  }

  updateInviteGroup() {
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
      });
  }

  inviteGroupDuplicated(newInviteGroup: string): Observable<boolean> {
    if (newInviteGroup === this.inviteGroup.inviteGroup) {
      this.createInviteGroupForm.patchValue({ controlIsValid: true });
      this.createInviteGroupForm.updateValueAndValidity();
      return of(false);
    } else {
      return this.inviteGroupsService
        .checkInviteGroup(this.inviteGroup.eventId, newInviteGroup)
        .pipe(
          map((response: boolean) => {
            this.createInviteGroupForm.patchValue({
              controlIsValid: !response,
            });
            this.createInviteGroupForm.updateValueAndValidity();
            return response;
          })
        );
    }
  }

  removeValidation(): void {
    this.createInviteGroupForm.patchValue({ controlIsValid: true });
  }
}
