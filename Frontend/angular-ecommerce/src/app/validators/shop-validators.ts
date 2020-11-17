import { FormControl, ValidationErrors } from '@angular/forms';

export class ShopValidators {
    // whitespace validation
    // if validation check fails, then return validation error(s)
    // if validation check passes, then return null
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        // check if string only contains whitepaces
        if((control.value != null) && (control.value.trim().length === 0)) {
            // invalid, return error object
            // the HTML template will check for this error key
            return {'notOnlyWhitespace': true };
        } else {
            // valid, return null
            return null;
        }
    }
}
