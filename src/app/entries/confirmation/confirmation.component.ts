import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, debounceTime, fromEvent, merge } from 'rxjs';
import { GenericValidator } from '../../shared/generic-validator';
import { IEntry } from 'src/shared/interfaces';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Input() entry!: IEntry[] | null;
  @Output() newEntry = new EventEmitter<FormGroup>();

  private numberOfEntries = new BehaviorSubject<number[]>([])
  numberOfEntries$ = this.numberOfEntries.asObservable();

  confirmationForm!: FormGroup;
  errorMessage = '';
  
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      entriesConfirmed: {
        required: 'Favor de seleccionar'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entry"]) {
      const length = changes["entry"].currentValue[0]["entriesNumber"];
      this.numberOfEntries.next(Array.from({ length }, (k, j) => j + 1).sort((a, b) => b - a))
    }
  }

  ngOnInit(): void {
    this.confirmationForm = this.fb.group({
      confirmation: 'true',
      entriesConfirmed: ['', Validators.required],
      message: ['']
    })
  }

  saveInformation(): void {
    if (this.confirmationForm.valid) {
      if(this.confirmationForm.dirty) {
        const assist = this.confirmationForm.controls['confirmation'].value === 'true'
        const entriesConfirmed = parseInt(this.confirmationForm.controls['entriesConfirmed'].value)
        this.confirmationForm.get('confirmation')?.setValue(assist)
        this.confirmationForm.get('entriesConfirmed')?.setValue(entriesConfirmed)
        this.newEntry.emit(this.confirmationForm)
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.confirmationForm, true);
    }
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.confirmationForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.confirmationForm)
    });
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.confirmationForm.reset();
  }
}
