import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  IInviteGroups,
  IInviteGroupsAction,
} from 'src/app/core/models/inviteGroups';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { InviteGroupsService } from 'src/app/core/services/inviteGroups.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { controlIsDuplicated } from 'src/app/shared/utils/validators/controlIsDuplicated';

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.css'],
})
export class InviteGroupComponent implements AfterViewInit {
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

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private inviteGroupsService: InviteGroupsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {
    this.validationMessages = {
      inviteGroup: {
        required: $localize`El nombre del grupo es requerido`,
      },
      controlValueDuplicated: {
        duplicated: $localize`Ya existe un grupo con este nombre`,
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createInviteGroupForm.valueChanges, ...controlBlurs).subscribe(
      () => {
        this.displayMessage = this.genericValidator.processMessages(
          this.createInviteGroupForm
        );
      }
    );
  }

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
      this.displayMessage = this.genericValidator.processMessages(
        this.createInviteGroupForm,
        true
      );
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
      this.createInviteGroupForm.patchValue({ controlIsValid: false });
      return;
    }

    this.inviteGroupsService
      .checkInviteGroup(this.eventId, inviteGroup)
      .subscribe({
        next: (response: boolean) => {
          this.createInviteGroupForm.patchValue({ controlIsValid: !response });
          this.displayMessage = this.genericValidator.processMessages(
            this.createInviteGroupForm
          );
        },
      });
  }
}
