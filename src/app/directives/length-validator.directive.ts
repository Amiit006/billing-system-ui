import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function lengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value?.toString().length != 10 ? { lengthError: control.value?.toString().length } : null;
  };
}