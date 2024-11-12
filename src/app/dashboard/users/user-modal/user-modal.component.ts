import {
  AfterViewInit,
  ChangeDetectorRef,
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
  ISavedUserRole,
  IUpsertUser,
  IUserAction,
} from 'src/app/core/models/users';
import { IRole, IRoleAction } from 'src/app/core/models/roles';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { UsersService } from 'src/app/core/services/users.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';
import { RoleActionEvent } from 'src/app/core/models/enum';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
})
export class UserModalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() set userActionValue(value: IUserAction | undefined) {
    if (value) {
      const user: IUpsertUser = value.user;
      this.createUserForm.patchValue({
        ...user,
        controlIsValid: true,
      });

      this.editedUser = user;
    }
  }
  
  @Output() updateUsers: EventEmitter<IUserAction> = new EventEmitter();
  @Output() selectRole: EventEmitter<ISavedUserRole> = new EventEmitter();

  createUserForm!: FormGroup;
  roles: IRole[] = [];
  userRoles: IRole[] = [];
  filteredRoles: IRole[] = [];
  roleSelected: IRole | undefined = undefined;
  editedUser: IUpsertUser | undefined = undefined;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private cd: ChangeDetectorRef
  ) {
    this.validationMessages = {
      username: {
        required: $localize`Ingresar nombre de usuario`,
      },
      email: {
        required: $localize`Ingresar correo electronico`,
      },
      roles: {
        required: $localize`Seleccionar un rol`,
      },
      controlValueDuplicated: {
        duplicated: $localize`Ya existe un usuario con este nombre de usuario`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createUserForm = this.fb.group(
      {
        id: [''],
        username: ['', Validators.required],
        email: ['', Validators.required],
        roles: [[], [Validators.required, Validators.minLength(1)]],
        isActive: [true],
        controlIsValid: [false],
      },
      {
        validators: controlIsDuplicated,
      }
    );

    $('#usersModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    });

    $('#usersModal').on('shown.bs.modal', () => {
      this.loaderService.setLoading(true, $localize`Cargando roles`);

      this.rolesService
        .getAllRoles()
        .subscribe({
          next: (roles) => {
            this.roles = roles;
            this.filteredRoles = roles;

            if (this.editedUser) {
              const user = this.editedUser;
              this.userRoles = this.roles.filter((r) =>
                user.roles.includes(r.id)
              );
              this.filterRoles();
            }
          },
        })
        .add(() => {
          this.loaderService.setLoading(false);
        });
    });
  }

  saveUser() {
    if (this.createUserForm.valid && this.createUserForm.dirty) {
      if (this.createUserForm.controls['id'].value !== '') {
        this.updateUser();
      } else {
        this.createUser();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(
        this.createUserForm,
        true
      );
    }
  }

  createUser() {
    this.loaderService.setLoading(true, $localize`Creando usuario`);
    this.usersService
      .createUser(this.createUserForm.value)
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateUsers.emit({
            user: {
              ...this.createUserForm.value,
              id: response.id,
            },
            isNew: true,
          });
          this.toastr.success(response.message);
          $('#usersModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  updateUser() {
    this.loaderService.setLoading(true, $localize`Actualizando usuario`);
    this.usersService
      .updateUser(
        this.createUserForm.value,
        this.createUserForm.controls['id'].value
      )
      .subscribe({
        next: (response: IMessageResponse) => {
          this.updateUsers.emit({
            user: this.createUserForm.value,
            isNew: false,
          });
          this.toastr.success(response.message);
          $('#usersModal').modal('hide');
        },
      })
      .add(() => {
        this.loaderService.setLoading(false);
      });
  }

  clearInputs(): void {
    this.createUserForm.reset({
      id: '',
      username: '',
      email: '',
      roles: [],
      isActive: true,
      controlIsValid: false,
    });

    this.userRoles = [];
    this.filteredRoles = [];
    this.displayMessage = {};
    this.roleSelected = undefined;

    const selectFilter = document.getElementById(
      'roleFilter'
    ) as HTMLSelectElement;
    selectFilter.value = '';
  }

  selectedRole(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const role = this.roles.find(
      (r) => r.id === selectElement.options[selectElement.selectedIndex].value
    );
    this.roleSelected = role;
  }

  addRole(): void {
    if (this.roleSelected) {
      this.userRoles.push(this.roleSelected);
      this.filterRoles();

      this.createUserForm.patchValue({
        roles: [...this.userRoles.map((x) => x.id)],
      });
      this.createUserForm.controls['roles'].markAsDirty();

      this.roleSelected = undefined;

      const selectFilter = document.getElementById(
        'roleFilter'
      ) as HTMLSelectElement;
      selectFilter.value = '';
    }
  }

  filterRoles() {
    this.filteredRoles = this.roles.filter(
      (f) => !this.userRoles.map((u) => u.id).includes(f.id)
    );

    this.cd.detectChanges();
  }

  deleteRole(roleId: string): void {
    this.userRoles = this.userRoles.filter((r) => r.id !== roleId);
    this.filterRoles();
    this.createUserForm.patchValue({
      roles: [...this.userRoles.map((x) => x.id)],
    });

    this.createUserForm.controls['roles'].markAsDirty();
    this.displayMessage = this.genericValidator.processMessages(
      this.createUserForm
    );
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createUserForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(
        this.createUserForm
      );
    });
  }

  checkUsername(event: Event) {
    const username = (event.target as HTMLInputElement).value;
    if (username === '') {
      this.createUserForm.patchValue({ controlIsValid: false });
      return;
    }

    this.usersService.checkUsername(username).subscribe({
      next: (response: boolean) => {
        this.createUserForm.patchValue({ controlIsValid: !response });
        this.displayMessage = this.genericValidator.processMessages(
          this.createUserForm
        );
      },
    });
  }

  roleAction(isEditingRole: boolean) {
    if (!isEditingRole) {
      this.roleSelected = undefined;
    } else {
      this.selectRole.emit({
        role: this.roleSelected as IRole,
        savedUser: this.createUserForm.value,
      });
    }
  }

  updateRoles(role: IRoleAction) {
    if (role.action === RoleActionEvent.Create) {
      this.roles.push(role.role as IRole);
    } else if (role.action === RoleActionEvent.Update) {
      const roleFromAction = role.role as IRole;
      this.roles = this.roles.map((r) =>
        r.id === roleFromAction.id ? roleFromAction : r
      );

      this.userRoles = this.userRoles.map((r) =>
        r.id === roleFromAction.id ? roleFromAction : r
      );
    }
  }
}
