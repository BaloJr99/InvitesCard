import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IMessageResponse } from 'src/app/core/models/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { ValidationPipe } from '../../../../../shared/pipes/validation.pipe';
import { ValidationErrorPipe } from '../../../../../shared/pipes/validation-error.pipe';
import { CommonModule } from '@angular/common';
import { IOverwriteConfirmation } from 'src/app/core/models/invites';
import { InvitesService } from 'src/app/core/services/invites.service';
import { EventType } from 'src/app/core/models/enum';

@Component({
  selector: 'app-overwrite-confirmation-form',
  templateUrl: './overwrite-confirmation-form.component.html',
  styleUrls: ['./overwrite-confirmation-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ValidationPipe,
    ValidationErrorPipe,
  ],
})
export class OverwriteConfirmationFormComponent {
  private overwriteConfirmation = new BehaviorSubject<IOverwriteConfirmation>({
    id: '',
    entriesConfirmed: 0,
    entriesNumber: 0,
    confirmation: null,
  });
  overwriteConfirmation$ = this.overwriteConfirmation.asObservable();

  private showOverwriteConfirmation = new BehaviorSubject<boolean>(false);
  showOverwriteConfirmation$ = this.showOverwriteConfirmation.asObservable();

  private typeOfEvent = new BehaviorSubject<EventType>(EventType.None);
  typeOfEvent$ = this.typeOfEvent.asObservable();

  @Input() set showOverwriteConfirmationValue(value: boolean) {
    this.showOverwriteConfirmation.next(value);
  }

  @Input() set overwriteConfirmationValue(value: IOverwriteConfirmation) {
    this.overwriteConfirmation.next(value);
  }

  @Input() set typeOfEventValue(value: EventType) {
    this.typeOfEvent.next(value);
  }

  @Output() closeOverwriteConfirmationForm: EventEmitter<void> =
    new EventEmitter();
  @Output() updateInvites: EventEmitter<IOverwriteConfirmation> =
    new EventEmitter();

  overwriteConfirmationForm = this.fb.group({
    id: ['', Validators.required],
    entriesConfirmed: ['', Validators.required],
  });

  constructor(
    private invitesService: InvitesService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  vm$ = combineLatest([
    this.overwriteConfirmation$,
    this.showOverwriteConfirmation$,
  ]).pipe(
    map(([overwriteConfirmation, show]) => {
      const numberOfEntries = Array.from(
        { length: overwriteConfirmation.entriesNumber + 1 },
        (k, j) => j
      )
        .sort((a, b) => b - a)
        .map((entry) => entry.toString());

      this.overwriteConfirmationForm.patchValue({
        id: overwriteConfirmation.id,
      });
      return {
        numberOfEntries,
        showForm: show,
      };
    })
  );

  toggleIsOverridingConfirmation(): void {
    this.closeOverwriteConfirmationForm.emit();
  }

  saveOverwriteConfirmation(): void {
    if (
      this.overwriteConfirmationForm.valid &&
      this.overwriteConfirmationForm.dirty
    ) {
      this.invitesService
        .overwriteConfirmation(
          this.getConfirmationValues(),
          this.overwriteConfirmation.value.id
        )
        .subscribe({
          next: (response: IMessageResponse) => {
            this.updateInvites.emit(this.getConfirmationValues());
            this.closeOverwriteConfirmationForm.emit();
            this.toastr.success(response.message);
          },
        });
    } else {
      this.overwriteConfirmationForm.markAllAsTouched();
    }
  }

  getConfirmationValues(): IOverwriteConfirmation {
    const confirmationValues = this.overwriteConfirmation.value;
    const entriesConfirmed =
      this.overwriteConfirmationForm.controls['entriesConfirmed'].value;

    // Convert number or null to boolean
    return {
      id: confirmationValues.id,
      entriesConfirmed: !entriesConfirmed ? 0 : parseInt(entriesConfirmed),
      confirmation: !entriesConfirmed ? false : parseInt(entriesConfirmed) > 0,
      entriesNumber: confirmationValues.entriesNumber,
    } as IOverwriteConfirmation;
  }
}
