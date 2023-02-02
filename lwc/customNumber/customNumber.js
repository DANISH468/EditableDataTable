import { LightningElement,api } from 'lwc';

export default class CustomNumber extends LightningElement {

    @api scale;
    @api maxLength;
    @api value;
    @api fieldApiName;
    @api recordId;
 

    handleChange(event){
        
        let inputField = event.target;

        let isDecimalError = false;
        //to check if decimal number is there
        isDecimalError = !inputField.value.includes('.');
        //reset all errors
        inputField.setCustomValidity('');
        inputField.reportValidity();
     
        if(isDecimalError){
           
            let inputValueLength = inputField.value.length;
            let decimalLength = this.scale.toString().length;
            // when decimal is not enabled
            if(decimalLength == 1){
                decimalLength = 0;
            }
            else{
                // to igonre  deimal and first ZERO such as 0.02 we need02 only for length
                decimalLength -= 2;
            }
            let totalDigitsEntered = decimalLength + inputValueLength;

            if(totalDigitsEntered > this.maxLength){
                inputField.setCustomValidity('Invalid Number');
                inputField.reportValidity();
                return;
            }
        }
        //if there is an error dont update the value
        if(!inputField.checkValidity() ){
            return;
        }
      
        // call custom events to update the value
        const custEvent = CustomEvent('customfieldchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail : {
                value : inputField.value,
                selectedId : this.recordId,
                fieldApiName : this.fieldApiName
            }
        });
      this.dispatchEvent(custEvent);
    }
}
