import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntry, IEntryAction, IFamilyGroup, IFamilyGroupAction, IMessageResponse } from 'src/shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';
import { FamilyGroupsService } from 'src/core/services/familyGroups.service';

@Component({
  selector: 'app-entry-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class EntryModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  @Input() entryAction!: IEntryAction;
  @Input() eventId!: string;
  @Input() familyGroups!: IFamilyGroup[];
  @Output() updateEntries: EventEmitter<IEntryAction> = new EventEmitter();
  @Output() updateFamilyGroups: EventEmitter<IFamilyGroupAction> = new EventEmitter();

  createEntryForm!: FormGroup;
  createFamilyGroupForm!: FormGroup;
  errorMessage = '';
  isCreatingNewFormGroup = false;
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private entriesService: EntriesService, 
    private familyGroupsService: FamilyGroupsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService) { 
    this.validationMessages = {
      family: {
        required: 'Ingresar familia'
      },
      entriesNumber: {
        required: 'Ingresar numero de invitaciones'
      },
      phoneNumber: {
        required: 'Ingresar numero de telefono',
        pattern: 'Numero de telefono invalido'
      },
      familyGroupId: {
        required: 'Seleccionar grupo'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createEntryForm = this.fb.group({
      id: [''],
      family: ['Familia', Validators.required],
      entriesNumber: [1, Validators.required],
      phoneNumber: ['878', [Validators.required, Validators.pattern("[0-9]{10}")]],
      familyGroupId: ['', Validators.required],
      kidsAllowed: [true, Validators.required],
      eventId: ['']
    })
    
    $('#confirmationModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entryAction"] && changes["entryAction"].currentValue) {
      if (!changes["entryAction"].currentValue.delete) {
        const entry: IEntry = changes["entryAction"].currentValue.entry;
        this.createEntryForm.patchValue({ 
          ...entry
        })
      }
    }
  }

  saveEntry() {
    if (this.createEntryForm.valid) {
      if (this.createEntryForm.dirty) {
        if (this.createEntryForm.controls["id"].value !== "" && this.createEntryForm.controls["id"].value !== null) {
          this.updateEntry();
        } else {
          this.createEntry();
        }
      } else {
        $("#confirmationModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEntryForm, true);
    }
  }

  createEntry() {
    this.loaderService.setLoading(true);
    this.entriesService.createEntry(this.formatEntry()).subscribe({
      next: (response: IMessageResponse) => {
        $("#confirmationModal").modal('hide');
        this.updateEntries.emit({
          ...this.entryAction,
          entry: {
            ...this.formatEntry(),
            id: response.id
          },
          isNew: true
        });
        this.toastr.success("Se ha guardado la invitación");
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  updateEntry() {
    this.loaderService.setLoading(true);
    this.entriesService.updateEntry(this.formatEntry(), this.createEntryForm.controls["id"].value).subscribe({
      next: () => {
        $("#confirmationModal").modal('hide');
        this.updateEntries.emit({
          ...this.entryAction,
          entry: this.formatEntry(),
          isNew: false
        });
        this.toastr.success("Se ha actualizado la invitación");
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }

  clearInputs(): void {
    this.createEntryForm.reset({
      family: 'Familia',
      entriesNumber: 1,
      phoneNumber: '878',
      familyGroupId: '',
      kidsAllowed: true
    });

    this.displayMessage = {};

    this.isCreatingNewFormGroup = false;
  }

  formatEntry(): IEntry {
    return {
      ...this.createEntryForm.value,
      entriesNumber: parseInt(this.createEntryForm.controls['entriesNumber'].value),
      eventId: this.eventId,
    } as IEntry
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEntryForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createEntryForm)
    });
  }

  toggleIsCreatingNewFormGroup(): void {
    if (!this.isCreatingNewFormGroup) {
      this.createFamilyGroupForm = this.fb.group({
        id: [''],
        familyGroup: ['Familia', Validators.required],
      })
    }
    this.isCreatingNewFormGroup = !this.isCreatingNewFormGroup;
  }

  toggleIsEditingFormGroup(): void {
    if (!this.isCreatingNewFormGroup) {
      const selectedFamilyGroup = this.familyGroups.find(famGroup => 
        famGroup.id === this.createEntryForm.controls["familyGroupId"].value);
      this.createFamilyGroupForm = this.fb.group({
        id: [selectedFamilyGroup?.id],
        familyGroup: [selectedFamilyGroup?.familyGroup, Validators.required],
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
        this.createEntryForm.patchValue({ 
          familyGroupId: response.id,
        })
        this.toastr.success("Grupo creado");
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
        this.toastr.success("Grupo actualizado");
      }
    }).add(() => {
      this.loaderService.setLoading(false);
    });
  }
}
