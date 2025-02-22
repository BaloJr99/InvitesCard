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
import { ISavedUserRole, IUserAction } from 'src/app/core/models/users';
import { IRole } from 'src/app/core/models/roles';
import { UsersService } from 'src/app/core/services/users.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';
import {
  BehaviorSubject,
  combineLatest,
  map,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
  standalone: false,
})
export class UserModalComponent {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  serverErrorMessage: string = '';

  private userAction = new BehaviorSubject<IUserAction>({
    isNew: undefined,
    user: {
      id: '',
      username: '',
      email: '',
      roles: [],
      isActive: true,
    },
    roleChanged: undefined,
  });
  userAction$ = this.userAction.asObservable();

  @Input() set userActionValue(value: IUserAction) {
    if (value.roleChanged) {
      const currentRoles = this.roles.value;

      const roleFound = currentRoles.find(
        (r) => r.id === value.roleChanged?.id
      );

      if (roleFound) {
        this.roles.next(
          currentRoles.map((r) =>
            r.id === value.roleChanged?.id ? value.roleChanged : r
          )
        );
      } else {
        this.roles.next([...currentRoles, value.roleChanged as IRole]);
      }
    }
    this.userAction.next(value);
  }

  @Input() set showModalValue(value: boolean) {
    this.showModal.next(value);
  }

  private showModal = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModal.asObservable();

  private roles = new BehaviorSubject<IRole[]>([]);
  roles$ = this.roles.asObservable();

  @Output() updateUsers: EventEmitter<IUserAction> = new EventEmitter();
  @Output() selectRole: EventEmitter<ISavedUserRole> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  vm$ = this.rolesService.getAllRoles().pipe(
    tap((roles) => this.roles.next(roles)),
    mergeMap(() =>
      combineLatest([this.userAction$, this.roles$, this.showModal$]).pipe(
        map(([userAction, roles, showModal]) => {
          const filteredRoles = roles.filter(
            (r) => !userAction.user.roles.map((ur) => ur).includes(r.id)
          );

          const userRoles = roles.filter((r) =>
            userAction.user.roles.map((ur) => ur).includes(r.id)
          );

          if (showModal) {
            this.createUserForm.patchValue({
              ...userAction.user,
            });

            $('#usersModal').modal('show');
            $('#usersModal').on('hidden.bs.modal', () => {
              this.closeModal.emit();
            });
          } else {
            this.clearInputs();
            $('#usersModal').modal('hide');
          }

          return {
            filteredRoles,
            userRoles,
          };
        })
      )
    )
  );

  createUserForm: FormGroup = this.fb.group(
    {
      id: '',
      username: ['', Validators.required],
      email: ['', Validators.required],
      roles: [[], [Validators.required, Validators.minLength(1)]],
      isActive: true,
      controlIsValid: true,
    },
    {
      validators: controlIsDuplicated,
    }
  );
  roleSelected: IRole | undefined = undefined;

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  saveUser() {
    this.serverErrorMessage = '';
    if (this.createUserForm.valid && this.createUserForm.dirty) {
      this.usernameDuplicated(
        this.createUserForm.controls['username'].value
      ).subscribe({
        next: (isDuplicated: boolean) => {
          if (!isDuplicated) {
            if (this.createUserForm.controls['id'].value !== '') {
              this.updateUser();
            } else {
              this.createUser();
            }
          }
        },
      });
    } else {
      this.createUserForm.markAllAsTouched();
    }
  }

  createUser() {
    this.usersService.createUser(this.createUserForm.value).subscribe({
      next: (response: IMessageResponse) => {
        this.updateUsers.emit({
          user: {
            ...this.createUserForm.value,
            id: response.id,
          },
          isNew: true,
          roleChanged: undefined,
        });
        this.toastr.success(response.message);
        $('#usersModal').modal('hide');
      },
      error: (error) => {
        if (error.status === 409) {
          this.serverErrorMessage = error.error.message;
        }
      },
    });
  }

  updateUser() {
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
            roleChanged: undefined,
          });
          this.toastr.success(response.message);
        },
        error: (error) => {
          if (error.status === 409) {
            this.serverErrorMessage = error.error.message;
          }
        },
      });
  }

  clearInputs(): void {
    const resetUser = {
      id: '',
      username: '',
      email: '',
      roles: [],
      isActive: true,
    };

    this.createUserForm.reset({
      ...resetUser,
      controlIsValid: true,
    });

    this.roleSelected = undefined;

    const selectFilter = document.getElementById(
      'roleFilter'
    ) as HTMLSelectElement;

    if (selectFilter) selectFilter.value = '';

    this.serverErrorMessage = '';
  }

  selectedRole(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const role = this.roles.value.find(
      (r) => r.id === selectElement.options[selectElement.selectedIndex].value
    );
    this.roleSelected = role;
  }

  addRole(): void {
    if (this.roleSelected) {
      const userActionValue = this.userAction.value;
      userActionValue.user = {
        ...this.createUserForm.value,
        roles: [...userActionValue.user.roles, this.roleSelected.id],
      };

      this.userAction.next(userActionValue);

      this.createUserForm.controls['roles'].markAsDirty();

      this.roleSelected = undefined;

      const selectFilter = document.getElementById(
        'roleFilter'
      ) as HTMLSelectElement;
      selectFilter.value = '';
    }
  }

  deleteRole(roleId: string): void {
    const userActionValue = this.userAction.value;
    userActionValue.user = {
      ...this.createUserForm.value,
      roles: userActionValue.user.roles.filter((r) => r !== roleId),
    };

    this.userAction.next(userActionValue);

    this.createUserForm.controls['roles'].markAsDirty();
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

  usernameDuplicated(newUsername: string): Observable<boolean> {
    if (newUsername === this.userAction.value.user.username) {
      this.createUserForm.patchValue({ controlIsValid: true });
      this.createUserForm.updateValueAndValidity();
      return of(false);
    } else {
      return this.usersService.checkUsername(newUsername).pipe(
        map((response: boolean) => {
          this.createUserForm.patchValue({
            controlIsValid: !response,
          });
          this.createUserForm.updateValueAndValidity();
          return response;
        })
      );
    }
  }

  removeValidation() {
    this.createUserForm.patchValue({ controlIsValid: true });
    this.createUserForm.updateValueAndValidity();
  }
}
