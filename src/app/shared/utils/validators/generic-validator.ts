import { FormGroup } from '@angular/forms';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
// NOTE: This validator does NOT support validation of controls or groups within a FormArray.
export class GenericValidator {
  // Provide the set of valid validation messages
  // Stucture:
  // controlName1: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // },
  // controlName2: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // }
  constructor(
    private validationMessages: { [key: string]: { [key: string]: string } }
  ) {}

  // Processes each control within a FormGroup
  // And returns a set of validation messages to display
  // Structure
  // controlName1: 'Validation Message.',
  // controlName2: 'Validation Message.'
  processMessages(
    container: FormGroup,
    savingForm = false
  ): { [key: string]: string } {
    const messages: { [key: string]: '' } = {};
    for (const controlKey in container.controls) {
      if (
        Object.prototype.hasOwnProperty.call(container.controls, controlKey)
      ) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else {
          // Only validate if there are validation messages for the control
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if (
              ((c.dirty || c.touched) && c.errors) ||
              (savingForm && c.errors)
            ) {
              Object.keys(c.errors).map((messageKey) => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] +=
                    this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }

    if (container.errors && container.errors['passwordMatchError']) {
      messages['passwordMatch'] = '';
      messages['passwordMatch'] +=
        this.validationMessages['passwordMatch']['matchError'];
    }

    if (container.errors && container.errors['controlDuplicatedError']) {
      messages['controlValueDuplicated'] = '';
      messages['controlValueDuplicated'] +=
        this.validationMessages['controlValueDuplicated']['duplicated'];
    }

    return messages;
  }
}
