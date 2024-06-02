export interface CreateClientRequest {
    nome: string,
    cnpj: string,
    razaoSocial: string,
    endereco: string,
    quantidadeProjetos:number,
    quantidadePessoas:number,
    uf: string,
    cep: string,
    cidade: string,
}