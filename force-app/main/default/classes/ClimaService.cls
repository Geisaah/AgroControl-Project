/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-22-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class ClimaService {
    
    @AuraEnabled
    public static void getClima(String cidade, Id recordId) {
        if (recordId != null) {
            System.enqueueJob(new ClimaQueueable(recordId, cidade));
        }
    }

    // Adicionei um tratamento para garantir que o registro seja encontrado
    public static void atualizarClimaNoRegistro(Id recordId, String cidade) {
        String apiKey = 'c650fdebb2e14855b75195753261604'; 
        String endpoint = 'http://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + EncodingUtil.urlEncode(cidade, 'UTF-8') + '&aqi=no&Lang=pt';

        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('GET');
            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {
                Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                Map<String, Object> current = (Map<String, Object>) results.get('current');
                Map<String, Object> condition = (Map<String, Object>) current.get('condition');

                Decimal temp = (Decimal) current.get('temp_c');
                String cond = (String) condition.get('text');

                // Criamos o objeto para update de forma mais segura
                Talhao__c t = new Talhao__c();
                t.Id = recordId;
                t.Temperatura_Atual__c = temp;
                t.Condicao_Climatica__c = cond;
                
                update t;
                System.debug('Sucesso no Update do Talhão: ' + recordId);
            }
        } catch (Exception e) {
            // Isso vai nos ajudar a ver o erro nos Logs se algo falhar
            System.debug('ERRO NA INTEGRAÇÃO CLIMA: ' + e.getMessage());
        }
    }
}