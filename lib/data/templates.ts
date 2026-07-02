import type { City } from "@/lib/data/cities";
import type { State } from "@/lib/data/states";
import type { Specialty } from "@/lib/data/specialties";

/**
 * Regra (playbook Bing/Copilot C1): TODA variante contém a keyword literal
 * na primeira frase — "advogado(s) em {cidade}" nas de cidade e
 * "advogado(s) {área} em {cidade}" nas de especialidade.
 */
const TEMPLATES_CITY: Array<(c: City, s: State) => string> = [
  (c, s) =>
    `Encontrar um advogado em ${c.name} ficou mais simples. Reunimos profissionais com inscrição ativa na OAB que atendem moradores e empresas da cidade e da região${s.name === c.name ? "" : ` do estado de ${s.name}`}. O diretório mostra dados de contato verificados, áreas de atuação e endereço profissional, para você falar direto com quem pode resolver seu caso.`,
  (c, s) =>
    `Advogados em ${c.name}, ${s.uf}, atendem nas principais áreas do direito. Aqui você consulta perfis verificados, vê especialidades, endereços e telefones, e entra em contato sem intermediário. Sem leilão, sem disputa de preço, apenas vitrine profissional.`,
  (c, s) =>
    `Buscar advogado em ${c.name} dispensa indicações de terceiros. No AdvAqui, cada perfil traz nome, número da OAB, áreas de atuação e dados de contato direto. Profissionais com plano destaque aparecem em primeiro, com perfil completo. Os demais aparecem em ordem alfabética.`,
  (c, s) =>
    `O AdvAqui lista advogados em ${c.name} e em cidades próximas. Cada cadastro passa por verificação de OAB. Você navega por especialidade, vê o endereço do escritório e entra em contato pelo telefone ou WhatsApp, sem precisar pagar nada pelo encontro.`,
  (c, s) =>
    `Quem precisa de um advogado em ${c.name} agora tem onde procurar com clareza. O diretório é gratuito para quem busca, e os profissionais cadastrados informam diretamente suas especialidades e contatos. Use o filtro por área do direito para chegar mais rápido ao perfil certo para o seu caso.`
];

const TEMPLATES_SPEC: Array<(c: City, s: State, sp: Specialty) => string> = [
  (c, s, sp) =>
    `Advogados ${sp.name.toLowerCase()} em ${c.name}, ${s.uf}, atendem diferentes tipos de demanda da área. ${sp.intro} No AdvAqui você encontra perfis verificados com contato direto, sem intermediação.`,
  (c, s, sp) =>
    `Um advogado ${sp.name.toLowerCase()} em ${c.name} é o profissional indicado para casos que pedem experiência específica na área. ${sp.intro} A lista abaixo reúne advogados cadastrados na cidade ou em municípios vizinhos.`,
  (c, s, sp) =>
    `Esta página reúne advogados ${sp.name.toLowerCase()} em ${c.name}, com atuação declarada na especialidade. ${sp.intro} Profissionais com plano destaque aparecem primeiro, com perfil completo.`,
  (c, s, sp) =>
    `Quem procura advogado ${sp.name.toLowerCase()} em ${c.name}, ${s.uf}, pode consultar os perfis abaixo. ${sp.intro} Cada cadastro inclui número da OAB, áreas atendidas e canal de contato direto.`,
  (c, s, sp) =>
    `Você encontra advogados ${sp.name.toLowerCase()} em ${c.name} nesta lista do AdvAqui. ${sp.intro} Veja perfis, especialidades complementares e entre em contato sem pagar taxas ao site.`
];

const TEMPLATES_STATE: Array<(s: State) => string> = [
  (s) =>
    `${s.name} (${s.uf}) reúne advogados em todas as cidades do estado, com forte presença em ${s.capital} e nas principais cidades de cada região. O AdvAqui lista profissionais por município, com filtros por especialidade jurídica.`,
  (s) =>
    `Encontre advogados em ${s.name}. O diretório cobre desde ${s.capital} até as cidades do interior, organizando os profissionais por especialidade e local de atuação. Cadastro gratuito para advogados e busca livre para clientes.`,
  (s) =>
    `Quem busca advogado no estado de ${s.name} pode navegar por cidade na lista abaixo. Cada cidade tem sua própria página com profissionais cadastrados, áreas de atuação e contato direto.`
];

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const pick = <T,>(arr: T[], seed: string): T => arr[hashString(seed) % arr.length];

export const cityIntro = (city: City, state: State): string =>
  pick(TEMPLATES_CITY, `${city.uf}-${city.slug}`)(city, state);

export const citySpecialtyIntro = (
  city: City,
  state: State,
  spec: Specialty
): string =>
  pick(TEMPLATES_SPEC, `${city.uf}-${city.slug}-${spec.slug}`)(city, state, spec);

export const stateIntro = (state: State): string =>
  pick(TEMPLATES_STATE, state.uf)(state);
