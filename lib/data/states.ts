export type State = {
  uf: string;
  name: string;
  capital: string;
  region: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
};

export const STATES: State[] = [
  { uf: "AC", name: "Acre", capital: "Rio Branco", region: "Norte" },
  { uf: "AL", name: "Alagoas", capital: "Maceió", region: "Nordeste" },
  { uf: "AM", name: "Amazonas", capital: "Manaus", region: "Norte" },
  { uf: "AP", name: "Amapá", capital: "Macapá", region: "Norte" },
  { uf: "BA", name: "Bahia", capital: "Salvador", region: "Nordeste" },
  { uf: "CE", name: "Ceará", capital: "Fortaleza", region: "Nordeste" },
  { uf: "DF", name: "Distrito Federal", capital: "Brasília", region: "Centro-Oeste" },
  { uf: "ES", name: "Espírito Santo", capital: "Vitória", region: "Sudeste" },
  { uf: "GO", name: "Goiás", capital: "Goiânia", region: "Centro-Oeste" },
  { uf: "MA", name: "Maranhão", capital: "São Luís", region: "Nordeste" },
  { uf: "MG", name: "Minas Gerais", capital: "Belo Horizonte", region: "Sudeste" },
  { uf: "MS", name: "Mato Grosso do Sul", capital: "Campo Grande", region: "Centro-Oeste" },
  { uf: "MT", name: "Mato Grosso", capital: "Cuiabá", region: "Centro-Oeste" },
  { uf: "PA", name: "Pará", capital: "Belém", region: "Norte" },
  { uf: "PB", name: "Paraíba", capital: "João Pessoa", region: "Nordeste" },
  { uf: "PE", name: "Pernambuco", capital: "Recife", region: "Nordeste" },
  { uf: "PI", name: "Piauí", capital: "Teresina", region: "Nordeste" },
  { uf: "PR", name: "Paraná", capital: "Curitiba", region: "Sul" },
  { uf: "RJ", name: "Rio de Janeiro", capital: "Rio de Janeiro", region: "Sudeste" },
  { uf: "RN", name: "Rio Grande do Norte", capital: "Natal", region: "Nordeste" },
  { uf: "RO", name: "Rondônia", capital: "Porto Velho", region: "Norte" },
  { uf: "RR", name: "Roraima", capital: "Boa Vista", region: "Norte" },
  { uf: "RS", name: "Rio Grande do Sul", capital: "Porto Alegre", region: "Sul" },
  { uf: "SC", name: "Santa Catarina", capital: "Florianópolis", region: "Sul" },
  { uf: "SE", name: "Sergipe", capital: "Aracaju", region: "Nordeste" },
  { uf: "SP", name: "São Paulo", capital: "São Paulo", region: "Sudeste" },
  { uf: "TO", name: "Tocantins", capital: "Palmas", region: "Norte" }
];

export const findState = (uf: string) =>
  STATES.find((s) => s.uf.toLowerCase() === uf.toLowerCase());

export const STATE_UFS = STATES.map((s) => s.uf.toLowerCase());
