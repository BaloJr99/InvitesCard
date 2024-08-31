import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder,FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IUser, IUserAction } from 'src/app/core/models/users';
import { IRole } from 'src/app/core/models/roles';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { UsersService } from 'src/app/core/services/users.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit, AfterViewInit, OnChanges {
  @HostListener('window:click', ['$event.target']) userModalListener (clickedElement: HTMLElement) {
    const filteredRoles = document.getElementById('filteredRoles') as HTMLElement;
    const roleFilter = document.getElementById('roleFilter') as HTMLElement;
    
    if (!filteredRoles.contains(clickedElement) && clickedElement !== roleFilter){
      this.filteredRoles = [];
    } 
  }

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  @Input() userAction!: IUserAction;
  @Output() updateUsers: EventEmitter<IUserAction> = new EventEmitter();
  
  createUserForm!: FormGroup;
  errorMessage = '';
  roles: IRole[] = [];
  userRoles: IRole[] = [];
  filteredRoles: IRole[] = [];
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService) { 
    this.validationMessages = {
      username: {
        required: $localize `Ingresar nombre de usuario`
      },
      email: {
        required: $localize `Ingresar correo electronico`
      },
      roles: {
        required: $localize `Seleccionar un rol`
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      _id: [''],
      username: ['', Validators.required],
      email: ['', Validators.required],
      roles: [[], Validators.minLength(1)],
      isActive: [true]
    });
    
    $('#usersModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    });

    $('#usersModal').on('shown.bs.modal', () => {
      this.loaderService.setLoading(true);

      this.rolesService.getAllRoles().subscribe({
        next: (roles) => {
          this.roles = roles;
        }
      }).add(() => {
        this.loaderService.setLoading(false)
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userAction"] && changes["userAction"].currentValue) {
      const user: IUser = changes["userAction"].currentValue.user;
      this.createUserForm.patchValue({ 
        ...user,
        roles: user.roles.map(r => r._id)
      });

      this.userRoles = user.roles;
    }
  }

  saveUser() {
    if (this.createUserForm.valid) {
      if (this.createUserForm.dirty) {
        if (this.createUserForm.controls["_id"].value !== "") {
          this.updateUser();
        } else {
          this.createUser();
        }
      } else {
        $("#usersModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createUserForm, true);
    }
  }

  createUser() {
    this.loaderService.setLoading(true);
    this.usersService.createUser(this.createUserForm.value).subscribe({
      next: (response: IMessageResponse) => {
        $("#usersModal").modal('hide');
        this.updateUsers.emit({
          user: {
            ...this.createUserForm.value,
            _id: response.id
          },
          isNew: true
        });
        this.toastr.success(response.message);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  updateUser() {
    this.loaderService.setLoading(true);
    this.usersService.updateUser(this.createUserForm.value, this.createUserForm.controls["_id"].value).subscribe({
      next: (response: IMessageResponse) => {
        $("#usersModal").modal('hide');
        this.updateUsers.emit({
          user: this.createUserForm.value,
          isNew: false
        });
        this.toastr.success(response.message);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  clearInputs(): void {
    this.createUserForm.reset({
      _id: '',
      username: '',
      email: '',
      roles: [],
      isActive: true
    });

    this.userRoles = [];
    this.displayMessage = {};
  }

  filterRoles(filter: boolean): void {
    const inputFilter = document.getElementById("roleFilter") as HTMLInputElement;
    if (filter) {
      // remove duplicated values
      this.filteredRoles = this.roles.filter(x => !this.userRoles.find(u => x.name === u.name));
      this.filteredRoles = this.filteredRoles.filter(f => f.name.includes(inputFilter.value));
    } else {
      this.filteredRoles = [];
    }
  }

  addRole(role: IRole): void {
    this.userRoles.push(role);
    this.filteredRoles = [];
    this.createUserForm.patchValue({
      roles: [
        ...this.userRoles.map(x => x._id)
      ]
    });
  }

  deleteRole(roleId: string): void {
    this.userRoles = this.userRoles.filter(r => r._id !== roleId);
    this.createUserForm.patchValue({
      roles: [
        ...this.userRoles.map(x => x._id)
      ]
    })
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createUserForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createUserForm);
    });
  }
}
