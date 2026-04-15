/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-15-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class ClimaService {
    
    @AuraEnabled // Isso permite que o LWC chame esse método
    public static Map<String, Object> getClima(String cidade) {
        // No futuro, aqui entrará o Http request para a API real
        // Por enquanto, vamos simular a resposta para você testar o LWC
        Map<String, Object> resultado = new Map<String, Object>();
        
        resultado.put('temperatura', 28);
        resultado.put('condicao', 'Ensolarado');
        resultado.put('cidade', cidade);
        
        return resultado;
    }
}