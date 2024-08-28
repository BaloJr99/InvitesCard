import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IFamilyGroup, IFamilyGroupAction } from 'src/app/core/models/familyGroups';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { FamilyGroupsService } from 'src/app/core/services/familyGroups.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { IMessageResponse } from 'src/app/core/models/common';
import { IInvite, IInviteAction } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class InvitesModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  @Input() inviteAction!: IInviteAction;
  @Input() eventId!: string;
  @Input() familyGroups!: IFamilyGroup[];
  @Output() updateInvites: EventEmitter<IInviteAction> = new EventEmitter();
  @Output() updateFamilyGroups: EventEmitter<IFamilyGroupAction> = new EventEmitter();

  createInviteForm!: FormGroup;
  createFamilyGroupForm!: FormGroup;
  errorMessage = '';
  isCreatingNewFormGroup = false;
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private invitesService: InvitesService, 
    private familyGroupsService: FamilyGroupsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService) { 
    this.validationMessages = {
      family: {
        required: $localize `Ingresar familia`
      },
      entriesNumber: {
        required: $localize `Ingresar numero de invitaciones`
      },
      phoneNumber: {
        required: $localize `Ingresar numero de telefono`,
        pattern: $localize `Numero de telefono invalido`
      },
      familyGroupId: {
        required: $localize `Seleccionar grupo`
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createInviteForm = this.fb.group({
      id: '',
      family: [$localize `Familia`, Validators.required],
      entriesNumber: [1, Validators.required],
      phoneNumber: ['878', [Validators.required, Validators.pattern("[0-9]{10}")]],
      familyGroupId: ['', Validators.required],
      kidsAllowed: [true, Validators.required],
      eventId: ''
    })
    
    $('#inviteModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["inviteAction"] && changes["inviteAction"].currentValue) {
      if (!changes["inviteAction"].currentValue.delete) {
        const invite: IInvite = changes["inviteAction"].currentValue.invite;
        this.createInviteForm.patchValue({ 
          ...invite
        })
      }
    }
  }

  saveInvite() {
    if (this.createInviteForm.valid) {
      if (this.createInviteForm.dirty) {
        if (this.createInviteForm.controls["id"].value !== "" && this.createInviteForm.controls["id"].value !== null) {
          this.updateInvite();
        } else {
          this.createInvite();
        }
      } else {
        $("#inviteModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createInviteForm, true);
    }
  }

  createInvite() {
    this.loaderService.setLoading(true);
    this.invitesService.createInvite(this.formatInvite()).subscribe({
      next: (response: IMessageResponse) => {
        $("#inviteModal").modal('hide');
        this.updateInvites.emit({
          ...this.inviteAction,
          invite: {
            ...this.formatInvite(),
            id: response.id
          },
          isNew: true
        });
        this.toastr.success($localize `Se ha guardado la invitación`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  updateInvite() {
    this.loaderService.setLoading(true);
    this.invitesService.updateInvite(this.formatInvite(), this.createInviteForm.controls["id"].value).subscribe({
      next: () => {
        $("#inviteModal").modal('hide');
        this.updateInvites.emit({
          ...this.inviteAction,
          invite: this.formatInvite(),
          isNew: false
        });
        this.toastr.success($localize `Se ha actualizado la invitación`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  clearInputs(): void {
    this.createInviteForm.reset({
      family: $localize `Familia`,
      entriesNumber: 1,
      phoneNumber: '878',
      familyGroupId: '',
      kidsAllowed: true
    });

    this.displayMessage = {};

    this.isCreatingNewFormGroup = false;
  }

  formatInvite(): IInvite {
    return {
      ...this.createInviteForm.value,
      entriesNumber: parseInt(this.createInviteForm.controls['entriesNumber'].value),
      eventId: this.eventId,
    } as IInvite
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createInviteForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createInviteForm)
    });
  }

  toggleIsCreatingNewFormGroup(): void {
    if (!this.isCreatingNewFormGroup) {
      this.createFamilyGroupForm = this.fb.group({
        id: '',
        familyGroup: [$localize `Familia`, Validators.required],
        eventId: ''
      })
    }
    this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
  }

  toggleIsEditingFormGroup(): void {
    if (!this.isCreatingNewFormGroup) {
      const selectedFamilyGroup = this.familyGroups.find(famGroup => 
        famGroup.id === this.createInviteForm.controls["familyGroupId"].value);
      this.createFamilyGroupForm = this.fb.group({
        id: [selectedFamilyGroup?.id],
        familyGroup: [selectedFamilyGroup?.familyGroup, Validators.required]
      })
    }
    this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
  }

  saveFamilyGroup(): void {
    if (this.createFamilyGroupForm.valid) {
      if (this.createFamilyGroupForm.dirty) {
        if (this.createFamilyGroupForm.controls["id"].value !== "" && this.createFamilyGroupForm.controls["id"].value !== null) {
          this.updateFamilyGroup();
        } else {
          this.createFamilyGroup();
        }
      } else {
        this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createFamilyGroupForm, true);
    }
  }

  createFamilyGroup () {
    this.loaderService.setLoading(true);
    this.createFamilyGroupForm.patchValue({
      eventId: this.eventId
    })
    this.familyGroupsService.createFamilyGroup(this.createFamilyGroupForm.value as IFamilyGroup).subscribe({
      next: (response: IMessageResponse) => {
        this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
        this.updateFamilyGroups.emit({
          familyGroup: {
            ...this.createFamilyGroupForm.value as IFamilyGroup,
            id: response.id
          },
          isNew: true
        });
        this.createInviteForm.patchValue({ 
          familyGroupId: response.id,
        })
        this.toastr.success($localize `Grupo creado`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  updateFamilyGroup() {
    this.loaderService.setLoading(true);
    this.familyGroupsService.updateFamilyGroup(this.createFamilyGroupForm.value as IFamilyGroup, this.createFamilyGroupForm.controls["id"].value).subscribe({
      next: () => {
        this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
        this.updateFamilyGroups.emit({
          familyGroup: {
            ...this.createFamilyGroupForm.value as IFamilyGroup,
          },
          isNew: false
        });
        this.toastr.success($localize `Grupo actualizado`);
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
