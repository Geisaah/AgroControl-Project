import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import DATA_PLANTIO from '@salesforce/schema/Talhao__c.Data_Plantio__c';
import DATA_COLHEITA from '@salesforce/schema/Talhao__c.Data_Prevista_Colheita__c';

export default class SafraProgress extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [DATA_PLANTIO, DATA_COLHEITA] })
    talhao;

    get daysRemaining() {
        const colheita = new Date(getFieldValue(this.talhao.data, DATA_COLHEITA));
        const hoje = new Date();
        const diff = colheita - hoje;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    get progressValue() {
        // Lógica simples de progresso (ex: 0 a 100)
        // Podemos refinar depois, mas por enquanto, vamos focar no visual!
        return 75; 
    }
}