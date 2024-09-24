import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { RolesService } from 'src/app/core/services/roles.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import { roleNameDuplicated } from 'src/app/shared/utils/validators/nameDuplicated';
import { RoleActionEvent } from 'src/app/core/models/enum';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() role: IRole | undefined = undefined;
  @Output() updateRoles: EventEmitter<IRoleAction> = new EventEmitter();
  currentRoleAction = RoleActionEvent.None;

  createRoleForm = this.fb.group({
    id: '',
    name: ['', Validators.required],
    isActive: true,
    nameIsValid: true
  },
  {
    validators: roleNameDuplicated,
  });

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    this.validationMessages = {
      name: {
        required: $localize`El nombre del rol es requerido`,
      },
      nameDuplicated: {
        duplicated: $localize`Ya existe un rol con este nombre`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    $('#rolesModal').on('show.bs.modal', () => {
      this.currentRoleAction = RoleActionEvent.None;
    });

    $('#rolesModal').on('hidden.bs.modal', () => {
      this.createRoleForm.reset();
      this.createRoleForm.patchValue({ isActive: true, nameIsValid: true });
      this.displayMessage = {};
      if (this.currentRoleAction === RoleActionEvent.None) {
        this.updateRoles.emit({
          role: undefined,
          action: this.currentRoleAction,
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && changes['role'].currentValue) {
      if (this.role) {
        this.createRoleForm.patchValue({
          id: this.role.id,
          name: this.role.name,
          isActive: this.role.isActive,
          nameIsValid: true,
        });
      }
    }
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createRoleForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(
        this.createRoleForm
      );
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
      this.displayMessage = this.genericValidator.processMessages(
        this.createRoleForm,
        true
      );
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
      this.createRoleForm.patchValue({ nameIsValid: true });
      if (this.createRoleForm.valid) {
        this.createRoleForm.markAsPristine();
      }
      return;
    }

    if (roleName === '') {
      this.createRoleForm.patchValue({ nameIsValid: false });
      return;
    }

    this.rolesService.checkRoleName(roleName).subscribe({
      next: (response: boolean) => {
        this.createRoleForm.patchValue({ nameIsValid: !response });
        this.displayMessage = this.genericValidator.processMessages(
          this.createRoleForm
        );
      },
    });
  }
}
