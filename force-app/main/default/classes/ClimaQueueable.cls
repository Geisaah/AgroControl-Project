public class ClimaQueueable implements Queueable, Database.AllowsCallouts {
    
    private Id recordId;
    private String cidade;

    // Construtor para receber os dados do Talhão
    public ClimaQueueable(Id recordId, String cidade) {
        this.recordId = recordId;
        this.cidade = cidade;
    }

    public void execute(QueueableContext context) {
        // Aqui chamamos a lógica que você já criou na ClimaService
        // Vou assumir que sua classe de serviço se chama ClimaService
        ClimaService.atualizarClimaNoRegistro(this.recordId, this.cidade);
    }
}