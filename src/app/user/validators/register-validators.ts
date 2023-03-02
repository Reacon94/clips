import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";


export class RegisterValidators {
    
    static match(controlName: string, matchControlName: string) : ValidatorFn  {
        return (group: AbstractControl) : ValidationErrors | null => {
            const control = group.get(controlName)
            const matchingControl = group.get(matchControlName) 
     
            if(!control || !matchingControl) {
             console.error("Form controls can not be found in the Formgroup")
             return { controlNotFound: false }
            }
     
            const error = control.value === matchingControl.value ?
             null : { noMatch: true }
            
            matchingControl.setErrors(error)

            return error

        }
      

    }
}
