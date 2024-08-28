import { Component, AfterViewInit, ViewChildren, ElementRef, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import * as moment from 'moment';
import { IInvite, IUserInvite } from 'src/app/core/models/invites';
import { GenericValidator } from 'src/app/shared/utils/validators/generic-validator';
import { SocketService } from 'src/app/core/services/socket.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { InvitesService } from 'src/app/core/services/invites.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements AfterViewInit, OnChanges {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @Input() invite!: IUserInvite;
  @Input() set deadlineMet (value: boolean) {
    this.blockConfirmationForm = value;
    this.confirmationForm.disable();
  }
  @Output() newInvite = new EventEmitter<FormGroup>();

  blockConfirmationForm = false;

  private numberOfEntries = new BehaviorSubject<number[]>([])
  numberOfEntries$ = this.numberOfEntries.asObservable();

  confirmationForm: FormGroup;
  
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
    private invitesService: InvitesService,
    private socket: SocketService,
    private loaderService: LoaderService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      entriesConfirmed: {
        required: $localize `Favor de seleccionar`
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
    if (changes["invite"]) {
      const { entriesNumber } = changes["invite"].currentValue as IInvite;
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
        this.addnewInvite();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.displayMessage = this.genericValidator.processMessages(this.confirmationForm, true);
    }
  }

  addnewInvite() {
    if(this.invite.id) {
      this.loaderService.setLoading(true);
      this.invitesService.sendConfirmation(this.confirmationForm.value as IInvite, this.invite.id)
        .subscribe({
          next: (() => {
            this.showDiv();
            this.socket.sendNotification(this.invite.id)
          })
        }).add(() => {
          this.loaderService.setLoading(false);
        });
    }
  }

  showDiv(): void {
    this.invite.confirmation = this.confirmationForm.get('confirmation')?.value
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
