import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import getClima from '@salesforce/apex/ClimaService.getClima';

import TEMPERATURA from '@salesforce/schema/Talhao__c.Temperatura_Atual__c';
import CONDICAO from '@salesforce/schema/Talhao__c.Condicao_Climatica__c';
import DATA_PLANTIO from '@salesforce/schema/Talhao__c.Data_Plantio__c';
import DATA_COLHEITA from '@salesforce/schema/Talhao__c.Data_Prevista_Colheita__c';

export default class SafraProgress extends LightningElement {
    @api recordId;

    @wire(getRecord, { 
        recordId: '$recordId', 
        fields: [DATA_PLANTIO, DATA_COLHEITA, TEMPERATURA, CONDICAO] 
    })
    talhao;

    get temperatura() { return getFieldValue(this.talhao.data, TEMPERATURA); }
    get condicao() { return getFieldValue(this.talhao.data, CONDICAO); }

    // O connectedCallback chama o novo método
    connectedCallback() {
        if (this.recordId) {
            this.executarIntegracao();
        }
    }

    // AQUI ESTÁ O MÉTODO NOVO (Substituindo o buscarClima)
    async executarIntegracao() {
        try {
            // 1. Avisa o Apex para colocar a integração na fila
            await getClima({ cidade: 'Paracatu', recordId: this.recordId });
            
            // 2. Cria o "vigia" que vai atualizar a tela sozinho
            let tentativas = 0;
            const intervalo = setInterval(async () => {
                tentativas++;
                
                // Força o LWC a buscar dados novos no banco
                await notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
                
                // Se o dado chegou ou cansamos de esperar (9 segundos), para o vigia
                if (this.temperatura || tentativas >= 3) {
                    clearInterval(intervalo);
                }
            }, 3000); // Tenta a cada 3 segundos

        } catch (error) {
            console.error('Erro na integração:', error);
        }
    }

    get daysRemaining() {
        const val = getFieldValue(this.talhao.data, DATA_COLHEITA);
        if (!val) return 0;
        const diff = new Date(val) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    get progressValue() {
        const p = new Date(getFieldValue(this.talhao.data, DATA_PLANTIO));
        const c = new Date(getFieldValue(this.talhao.data, DATA_COLHEITA));
        const h = new Date();
        if (!p || !c || p >= c) return 0;
        return Math.floor(((h - p) / (c - p)) * 100);
    }
}