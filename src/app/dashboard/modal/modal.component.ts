import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChildren } from '@angular/core';
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
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Output() updateDashboard: EventEmitter<any> = new EventEmitter();
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

  ngOnInit(): void {
    this.createEntrieForm = this.fb.group({
      family: ['Familia', Validators.required],
      entriesNumber: [1, Validators.required],
      phoneNumber: ['878', [Validators.required, Validators.pattern("[0-9]{10}")]],
      groupSelected: ['', Validators.required],
      kidsAllowed: [true, Validators.required]
    })
    
    $('#confirmationModal').on('hidden.bs.modal', () => {
      this.onSaveComplete();
    })
  }

  saveEntry() {
    if (this.createEntrieForm.valid) {
      if (this.createEntrieForm.dirty) {
        const entriesNumber = parseInt(this.createEntrieForm.controls['entriesNumber'].value)
        this.createEntrieForm.get('entriesNumber')?.setValue(entriesNumber)
        this.createEntry();
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
          modal.click()
          this.onSaveComplete();
        }
      });
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.createEntrieForm.reset({
      family: 'Familia',
      entriesNumber: 1,
      phoneNumber: '878',
      groupSelected: '',
      kidsAllowed: true
    });
    this.displayMessage = {};
    this.updateDashboard.emit();
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
