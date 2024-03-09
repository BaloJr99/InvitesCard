import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntry, IEntryAction, IEvent, IMessageResponse } from 'src/shared/interfaces';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/core/services/loader.service';

@Component({
  selector: 'app-entry-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class EntryModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];

  @Input() entryAction!: IEntryAction;
  @Input() eventSelected!: IEvent;
  @Output() updateEntries: EventEmitter<IEntryAction> = new EventEmitter();

  createEntrieForm!: FormGroup;
  errorMessage = '';
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private entriesService: EntriesService, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loadingService: LoaderService) { 
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
      groupSelected: {
        required: 'Seleccionar grupo'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.createEntrieForm = this.fb.group({
      id: [''],
      family: ['Familia', Validators.required],
      entriesNumber: [1, Validators.required],
      phoneNumber: ['878', [Validators.required, Validators.pattern("[0-9]{10}")]],
      groupSelected: ['', Validators.required],
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
        this.createEntrieForm.patchValue({ 
          ...entry
        })
      }
    }
  }

  saveEntry() {
    if (this.createEntrieForm.valid) {
      if (this.createEntrieForm.dirty) {
        if (this.createEntrieForm.controls["id"].value !== "" && this.createEntrieForm.controls["id"].value !== null) {
          this.updateEntry();
        } else {
          this.createEntry();
        }
      } else {
        $("#confirmationModal").modal('hide');
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEntrieForm, true);
    }
  }

  createEntry() {
    this.loadingService.setLoading(true);
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
      this.loadingService.setLoading(false);
    });
  }

  updateEntry() {
    this.loadingService.setLoading(true);
    this.entriesService.updateEntry(this.formatEntry(), this.createEntrieForm.controls["id"].value).subscribe({
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
      this.loadingService.setLoading(false);
    });
  }

  clearInputs(): void {
    this.createEntrieForm.reset({
      family: 'Familia',
      entriesNumber: 1,
      phoneNumber: '878',
      groupSelected: '',
      kidsAllowed: true
    });
    
    $("#entryId").val("");

    this.displayMessage = {};
  }

  formatEntry(): IEntry {
    return {
      ...this.createEntrieForm.value,
      entriesNumber: parseInt(this.createEntrieForm.controls['entriesNumber'].value),
      eventId: this.eventSelected.id,
    } as IEntry
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEntrieForm.valueChanges, ...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createEntrieForm)
    });
  }
}
