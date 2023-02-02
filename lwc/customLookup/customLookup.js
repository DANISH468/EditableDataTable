import lookUp from '@salesforce/apex/CustomLookUpCtrl.search';
import { api, LightningElement, track, wire } from 'lwc';


export default class customLookUp extends LightningElement {

    @api value;
    @api objName;
    @api iconName;
    @api recordId;
    @api filter = '';
    @api searchPlaceholder='Search';
    @api fieldApiName;
    @track selectedName;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    searchTerm;
    hasRendered = false;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';
    @wire(lookUp, {searchTerm : '$searchTerm', myObject : '$objName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;

        } else if (error) {
            this.error = error;
            this.records = undefined;         
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {

        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        const custEvent = CustomEvent('customfieldchange', {
            composed: true,
            bubbles: true,
            cancelable: true,
            detail : {
                value : selectedId,
                selectedId : this.recordId,
                fieldApiName : this.fieldApiName
            }
        });
        this.dispatchEvent(custEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    handleRemovePill() {
        this.isValueSelected = false;
    }

    constructor(){
        super();
        this.searchTerm = '';
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

    renderedCallback(){

      
        if(this.value == null || this.records == undefined || this.hasRendered ) return;
        this.isValueSelected = true;
        let selectedRecord = this.records.find(record => record.Id == this.value);
        this.selectedName = selectedRecord.Name;
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
        this.hasRendered = true;

    }

   

}
