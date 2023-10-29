import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { GenericValidator } from 'src/app/shared/generic-validator';
import { EntriesService } from 'src/core/services/entries.service';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Output() updateDashboard: EventEmitter<unknown> = new EventEmitter();
  @Output() getEntryToModifiy: EventEmitter<unknown> = new EventEmitter();
  @Input() entryToModify: IEntry | null = null;
  createEntrieForm!: FormGroup;
  errorMessage = '';
    
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private entriesService: EntriesService, private fb: FormBuilder) { 
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entryToModify"].currentValue) {
      const { entriesNumber, family, groupSelected, kidsAllowed, phoneNumber } = changes["entryToModify"].currentValue;
      this.createEntrieForm.patchValue({ 
        entriesNumber,
        family,
        groupSelected,
        kidsAllowed,
        phoneNumber
      })
    }
  }

  ngOnInit(): void {
    this.createEntrieForm = this.fb.group({
      family: ['Familia', Validators.required],
      entriesNumber: [1, Validators.required],
      phoneNumber: ['878', [Validators.required, Validators.pattern("[0-9]{10}")]],
      groupSelected: ['', Validators.required],
      kidsAllowed: [true, Validators.required]
    })
    
    $('#confirmationModal').on('hidden.bs.modal', () => {
      this.clearInputs();
    })
    
    $('#confirmationModal').on('show.bs.modal', () => {
      this.getEntryToModifiy.emit()
    })
  }

  

  saveEntry() {
    if (this.createEntrieForm.valid) {
      if (this.createEntrieForm.dirty) {
        const entriesNumber = parseInt(this.createEntrieForm.controls['entriesNumber'].value)
        this.createEntrieForm.get('entriesNumber')?.setValue(entriesNumber)
        const id = $("#entryId").val();
        if (id && typeof(id) === "string") {
          this.updateEntry(id);
        } else {
          this.createEntry();
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.createEntrieForm, true);
    }
  }

  createEntry() {
    const modal = document.getElementById("closeModal")
    if (modal) {
      this.entriesService.createEntry(this.createEntrieForm.value as IEntry).subscribe({
        next: () => {
          modal.click();
          this.onSaveComplete();
        }
      });
    }
  }

  updateEntry(id: string) {
    this.entriesService.updateEntry(this.createEntrieForm.value as IEntry, id).subscribe({
      next: () => {
        $("#confirmationModal").modal('hide');
        this.onSaveComplete();
      }
    });
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.clearInputs();
    this.displayMessage = {};
    this.updateDashboard.emit();
  }

  clearInputs(): void {
    this.createEntrieForm.reset({
      family: 'Familia',
      entriesNumber: 1,
      phoneNumber: '878',
      groupSelected: '',
      kidsAllowed: true
    });
    
    $("#entryId").val("")
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.createEntrieForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.createEntrieForm)
    });
  }
}
