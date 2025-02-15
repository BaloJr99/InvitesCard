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
import { RolesService } from 'src/app/core/services/roles.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';
import { RoleActionEvent } from 'src/app/core/models/enum';
import { BehaviorSubject, combineLatest, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private roleAction = new BehaviorSubject<IRoleAction>({
    action: RoleActionEvent.None,
    role: {
      id: '',
      name: '',
      isActive: true,
    },
  });
  roleAction$ = this.roleAction.asObservable();

  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  @Input() set roleActionValue(value: IRoleAction) {
    this.roleAction.next(value);
  }

  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  @Output() updateRoles: EventEmitter<IRoleAction> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  createRoleForm: FormGroup = this.fb.group(
    {
      id: '',
      name: ['', Validators.required],
      isActive: true,
      controlIsValid: true,
    },
    {
      validators: controlIsDuplicated,
    }
  );

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  vm$ = combineLatest([this.roleAction$, this.showModal]).pipe(
    tap(([roleAction, showModal]) => {
      this.createRoleForm.patchValue({
        ...roleAction.role,
      });

      if (showModal) {
        $('#rolesModal').modal('show');
        $('#rolesModal').on('hidden.bs.modal', () => {
          this.closeModal.emit();
        });
      } else {
        $('#rolesModal').modal('hide');
      }
    })
  );

  saveRole(): void {
    if (this.createRoleForm.valid && this.createRoleForm.dirty) {
      this.roleDuplicated(this.createRoleForm.controls['name'].value).subscribe(
        {
          next: (isDuplicated: boolean) => {
            if (!isDuplicated) {
              if (this.createRoleForm.controls['id'].value !== '') {
                this.updateRole();
              } else {
                this.createRole();
              }
            }
          },
        }
      );
    } else {
      this.createRoleForm.markAllAsTouched();
    }
  }

  createRole() {
    this.rolesService.createRole(this.createRoleForm.value as IRole).subscribe({
      next: (response: IMessageResponse) => {
        this.updateRoles.emit({
          action: RoleActionEvent.Create,
          role: this.createRoleForm.value as IRole,
        });
        this.toastr.success(response.message);
      },
    });
  }

  updateRole() {
    this.rolesService
      .updateRole(
        this.createRoleForm.value as IRole,
        this.createRoleForm.controls['id'].value as string
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateRoles.emit({
            action: RoleActionEvent.Update,
            role: this.createRoleForm.value as IRole,
          });
          this.toastr.success(response.message);
        },
      });
  }

  roleDuplicated(newRole: string): Observable<boolean> {
    if (newRole === this.roleAction.value.role.name) {
      this.createRoleForm.patchValue({ controlIsValid: true });
      this.createRoleForm.updateValueAndValidity();
      return of(false);
    } else {
      return this.rolesService.checkRoleName(newRole).pipe(
        map((response: boolean) => {
          this.createRoleForm.patchValue({
            controlIsValid: !response,
          });
          this.createRoleForm.updateValueAndValidity();
          return response;
        })
      );
    }
  }

  removeValidation(): void {
    this.createRoleForm.patchValue({ controlIsValid: true });
    this.createRoleForm.updateValueAndValidity();
  }
}
