export interface CreateProjectRequest {
    nomeProjeto: string;
    tecnico: {
        id: number;
    };
    cliente: {
        id: number;
    };
    dataAbertura: string;
    dataFechamento: string;
    dataPrevista: string;
    status: string;
}
