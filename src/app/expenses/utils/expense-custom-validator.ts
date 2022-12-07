import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

export const validateProperty = (
  property: string, validators: ValidatorFn,
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
  // get the value and assign it to a new form control
  const propertyVal = control.value && control.value[property];
  const newFc = new FormControl(propertyVal);
  // run the validators on the new control and keep the ones that fail
  const failedValidators = validators(newFc);
  // if any fail, return the list of failures, else valid
  return failedValidators;
};

export const multipleValidateProperty = (
  property: string, validators: ValidatorFn[],
): ValidatorFn => (control: AbstractControl): { [key: string]: any } | null => {
  // get the value and assign it to a new form control
  const propertyVal = control.value && control.value[property];
  const newFc = new FormControl(propertyVal);
  // run the validators on the new control and keep the ones that fail
  const failedValidators = validators.map((v) => v(newFc)).filter((v) => !!v);
  // if any fail, return the list of failures, else valid
  return failedValidators.length ? { invalidProperty: failedValidators } : null;
};
