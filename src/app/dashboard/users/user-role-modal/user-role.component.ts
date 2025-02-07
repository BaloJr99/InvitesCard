import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/services/roles.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';
import { RoleActionEvent } from 'src/app/core/models/enum';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  private role: IRole | undefined;
  @Input() set roleValue(value: IRole | undefined) {
    if (value) {
      this.createRoleForm.patchValue({
        id: value.id,
        name: value.name,
        isActive: value.isActive,
        controlIsValid: true,
      });
    }
  }
  @Output() updateRoles: EventEmitter<IRoleAction> = new EventEmitter();
  currentRoleAction = RoleActionEvent.None;

  createRoleForm = this.fb.group(
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
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    $('#rolesModal').on('show.bs.modal', () => {
      this.currentRoleAction = RoleActionEvent.None;
    });

    $('#rolesModal').on('hidden.bs.modal', () => {
      this.createRoleForm.reset();
      this.createRoleForm.patchValue({ isActive: true, controlIsValid: true });
      if (this.currentRoleAction === RoleActionEvent.None) {
        this.updateRoles.emit({
          role: undefined,
          action: this.currentRoleAction,
        });
      }
    });
  }

  saveRole(): void {
    if (this.createRoleForm.valid && this.createRoleForm.dirty) {
      if (this.createRoleForm.controls['id'].value !== '') {
        this.updateRole();
      } else {
        this.createRole();
      }
    } else {
      this.createRoleForm.markAllAsTouched();
    }
  }

  createRole() {
    this.loaderService.setLoading(true, $localize`Creando rol`);
    this.rolesService
      .createRole(this.createRoleForm.value as IRole)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.currentRoleAction = RoleActionEvent.Create;
          this.updateRoles.emit({
            role: {
              ...(this.createRoleForm.value as IRole),
            },
            action: this.currentRoleAction,
          });
          this.toastr.success(response.message);
          $('#rolesModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateRole() {
    this.loaderService.setLoading(true, $localize`Actualizando rol`);
    this.rolesService
      .updateRole(
        this.createRoleForm.value as IRole,
        this.createRoleForm.controls['id'].value as string
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.currentRoleAction = RoleActionEvent.Update;
          this.updateRoles.emit({
            role: {
              ...(this.createRoleForm.value as IRole),
            },
            action: this.currentRoleAction,
          });
          this.toastr.success(response.message);
          $('#rolesModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  checkRole(event: Event) {
    const roleName = (event.target as HTMLInputElement).value;
    if (this.role && roleName === this.role.name) {
      this.createRoleForm.patchValue({ controlIsValid: true });
      if (this.createRoleForm.valid) {
        this.createRoleForm.markAsPristine();
      }
      return;
    }

    if (roleName === '') {
      this.createRoleForm.patchValue({ controlIsValid: false });
      return;
    }

    this.rolesService.checkRoleName(roleName).subscribe({
      next: (response: boolean) => {
        this.createRoleForm.patchValue({ controlIsValid: !response });
        this.createRoleForm.updateValueAndValidity();
      },
    });
  }
}
