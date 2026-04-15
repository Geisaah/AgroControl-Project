import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getClima from '@salesforce/apex/ClimaService.getClima';
import DATA_PLANTIO from '@salesforce/schema/Talhao__c.Data_Plantio__c';
import DATA_COLHEITA from '@salesforce/schema/Talhao__c.Data_Prevista_Colheita__c';

export default class SafraProgress extends LightningElement {
    @api recordId;
    @track climaDados;

    @wire(getRecord, { recordId: '$recordId', fields: [DATA_PLANTIO, DATA_COLHEITA] })
    talhao;

    get daysRemaining() {
        const dataColheitaVal = getFieldValue(this.talhao.data, DATA_COLHEITA);
        if (!dataColheitaVal) return 0;

        const colheita = new Date(dataColheitaVal);
        const hoje = new Date();
        const diff = colheita - hoje;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    get progressValue() {
        const plantio = new Date(getFieldValue(this.talhao.data, DATA_PLANTIO));
        const colheita = new Date(getFieldValue(this.talhao.data, DATA_COLHEITA));
        const hoje = new Date();

        if (!plantio || !colheita || plantio >= colheita) return 0;

        const totalCiclo = colheita - plantio;
        const decorrido = hoje - plantio;
        const progresso = Math.floor((decorrido / totalCiclo) * 100);

        // Garante que o progresso fique entre 0 e 100
        return progresso > 100 ? 100 : (progresso < 0 ? 0 : progresso);
    }

    connectedCallback() {
        this.buscarClima();
    }

    buscarClima() {
        // Passando a sua cidade como parâmetro para o Apex
        getClima({ cidade: 'Paracatu' }) 
            .then(result => {
                this.climaDados = result;
            })
            .catch(error => {
                console.error('Erro ao buscar clima:', error);
            });
    }
} 