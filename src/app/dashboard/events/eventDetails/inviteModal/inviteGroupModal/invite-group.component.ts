import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  Validators,
} from '@angular/forms';
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

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.css'],
})
export class InviteGroupComponent implements AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @Input() eventId: string = '';
  @Input() inviteGroup: IInviteGroups | undefined = undefined;

  @Output() updateInviteGroups: EventEmitter<IInviteGroupsAction> =
    new EventEmitter();
  @Output() isCreatingNewFormGroup: EventEmitter<boolean> = new EventEmitter();

  createInviteGroupForm = this.fb.group({
    id: '',
    inviteGroup: ['', Validators.required],
    eventId: '',
  });;

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
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inviteGroup'] && changes['inviteGroup'].currentValue) {
      if (this.inviteGroup) {
        this.createInviteGroupForm.patchValue({
          id: this.inviteGroup.id,
          inviteGroup: this.inviteGroup.inviteGroup,
        });
      }
    }

    if (changes['eventId'] && changes['eventId'].currentValue) {
      this.createInviteGroupForm.patchValue({
        eventId: this.eventId,
      });
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
}
