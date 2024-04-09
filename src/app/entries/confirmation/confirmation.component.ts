import { Component, AfterViewInit, ViewChildren, ElementRef, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { GenericValidator } from '../../shared/generic-validator';
import { IEntry, IInvite } from 'src/shared/interfaces';
import { EntriesService } from 'src/core/services/entries.service';
import * as moment from 'moment';
import { SocketService } from 'src/core/services/socket.service';
import { LoaderService } from 'src/core/services/loader.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Input() entry!: IInvite;
  @Output() newEntry = new EventEmitter<FormGroup>();

  private numberOfEntries = new BehaviorSubject<number[]>([])
  numberOfEntries$ = this.numberOfEntries.asObservable();

  confirmationForm: FormGroup;
  
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private entriesService: EntriesService,
    private socket: SocketService,
    private loaderService: LoaderService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      entriesConfirmed: {
        required: 'Favor de seleccionar'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.confirmationForm = this.fb.group({
      confirmation: ['true', Validators.required],
      entriesConfirmed: ['0', Validators.required],
      message: ['']
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["entry"]) {
      const { entriesNumber } = changes["entry"].currentValue as IEntry;
      this.numberOfEntries.next(Array.from({ length: entriesNumber}, (k, j) => j + 1).sort((a, b) => b - a))
    }
  }

  saveInformation(): void {
    if (this.confirmationForm.valid) {
      if(this.confirmationForm.dirty) {
        const assist = this.confirmationForm.controls['confirmation'].value === 'true';
        const entriesConfirmed = parseInt(this.confirmationForm.controls['entriesConfirmed'].value);
        this.confirmationForm.get('confirmation')?.setValue(assist)
        this.confirmationForm.get('entriesConfirmed')?.setValue(entriesConfirmed)
        this.confirmationForm.addControl('dateOfConfirmation', new FormControl(moment().format("YYYY-MM-DD[T]HH:mm:ss[Z]")))
        this.addNewEntry();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.confirmationForm, true);
    }
  }

  addNewEntry() {
    if(this.entry.id) {
      this.loaderService.setLoading(true);
      this.entriesService.sendConfirmation(this.confirmationForm.value as IEntry, this.entry.id)
        .subscribe({
          next: (() => {
            this.showDiv();
            this.socket.sendNotification(this.entry.id)
          })
        }).add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  showDiv(): void {
    this.entry.confirmation = this.confirmationForm.get('confirmation')?.value
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<unknown>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.confirmationForm.get("confirmation")?.valueChanges, ...controlBlurs).subscribe(() => {
      if (this.confirmationForm.controls['confirmation'].value === 'true') {
        const select = document.getElementById('my-select')
        select?.removeAttribute('disabled');
        if (this.confirmationForm.get('entriesConfirmed')?.value === '') {
          this.confirmationForm.get('entriesConfirmed')?.setValue('0')
        }
        this.confirmationForm.get('entriesConfirmed')?.setValidators(Validators.required)
        this.confirmationForm.get('entriesConfirmed')?.updateValueAndValidity()
      } else if (this.confirmationForm.controls['confirmation'].value === 'false') {
        const select = document.getElementById('my-select')
        select?.setAttribute('disabled', '');
        this.confirmationForm.patchValue({
          entriesConfirmed: '0'
        })
        this.confirmationForm.get('entriesConfirmed')?.clearValidators();
        this.confirmationForm.get('entriesConfirmed')?.updateValueAndValidity();
      }
      this.displayMessage = this.genericValidator.processMessages(this.confirmationForm)
    });
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.confirmationForm.reset();
  }
}
