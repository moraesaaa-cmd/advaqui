/**
 * Fluxogramas e quadros comparativos por artigo do blog.
 *
 * Mapa de slug → { fluxograma, comparativo }. Quando um artigo tem entrada
 * neste arquivo, o componente <Fluxograma /> renderiza no topo do artigo.
 *
 * Inicial — 5 artigos com fluxograma + 2 com quadro comparativo.
 * Expandir conforme novos artigos forem publicados.
 */

export type FluxogramaArtigo = {
  titulo: string;
  steps: Array<{ titulo: string; texto: string }>;
};

export type ComparativoArtigo = {
  titulo: string;
  colunaEsquerda: string;
  colunaDireita: string;
  rows: Array<{ topico: string; esquerda: string; direita: string }>;
};

export const FLUXOGRAMAS_POR_ARTIGO: Record<string, FluxogramaArtigo> = {
  "como-pedir-divorcio": {
    titulo: "Como pedir o divórcio — fluxograma",
    steps: [
      {
        titulo: "Reúna documentos e decida o tipo",
        texto:
          "Certidão de casamento atualizada, RGs, CPFs, lista de bens e dívidas. Decida — extrajudicial (cartório, mais rápido) se há acordo sem filhos menores, ou judicial nos demais casos."
      },
      {
        titulo: "Defina pontos do acordo",
        texto:
          "Partilha de bens, guarda e visitas dos filhos, pensão (entre cônjuges e/ou para filhos), uso do sobrenome. Quanto mais alinhado, mais rápido."
      },
      {
        titulo: "Contrate advogado(s)",
        texto:
          "Cada parte pode ter seu advogado — ou um único advogado de comum acordo no extrajudicial. Na defensoria pública, atendimento é gratuito pra baixa renda."
      },
      {
        titulo: "Protocole a ação",
        texto:
          "Extrajudicial — cartório de notas. Judicial — protocolada na Vara de Família da cidade onde mora o casal ou os filhos."
      },
      {
        titulo: "Aguarde audiência ou escritura",
        texto:
          "Extrajudicial — 30 a 90 dias até a escritura sair pronta. Judicial — audiência de conciliação em 30 a 60 dias, sentença em 4 a 12 meses (consensual) ou 12 a 36 meses (litigioso)."
      },
      {
        titulo: "Averbe no registro civil",
        texto:
          "Após escritura ou sentença, leve ao cartório onde foi registrado o casamento. O divórcio só fica oficial depois da averbação."
      }
    ]
  },
  "como-pedir-pensao-alimenticia": {
    titulo: "Como pedir pensão alimentícia — fluxograma",
    steps: [
      {
        titulo: "Reúna provas de necessidade e possibilidade",
        texto:
          "Comprovante de despesas do alimentando (escola, plano de saúde, atividades), comprovante de renda do alimentante (holerite, IR, movimentação bancária)."
      },
      {
        titulo: "Tente acordo amigável",
        texto:
          "Antes do processo, vale tentar mediação. Acordo formalizado em cartório ou homologado em juízo vale como sentença."
      },
      {
        titulo: "Procure advogado ou defensoria",
        texto:
          "Defensoria pública atende ações de alimentos gratuitamente em todo Brasil. Honorário advocatício varia R$ 1.500 a R$ 5.000 — ou na base do êxito."
      },
      {
        titulo: "Protocole a ação",
        texto:
          "Vara de Família da cidade onde mora o alimentando (princípio do melhor interesse). Pedido inicial pode incluir alimentos provisórios (urgência) e definitivos."
      },
      {
        titulo: "Audiência de conciliação",
        texto:
          "Em 30 a 60 dias. Se houver acordo, o juiz homologa. Se não, segue pra audiência de instrução com produção de provas."
      },
      {
        titulo: "Sentença e cumprimento",
        texto:
          "Sentença em 4 a 12 meses. Não pagamento autoriza protesto, inclusão no SPC/Serasa, prisão civil (até 3 meses) e bloqueio de salário."
      }
    ]
  },
  "como-fazer-inventario": {
    titulo: "Como fazer inventário — fluxograma",
    steps: [
      {
        titulo: "Levante bens e dívidas do falecido",
        texto:
          "Lista de imóveis (com matrículas), veículos, contas bancárias, investimentos, dívidas. Reúna certidão de óbito, casamento e nascimento dos herdeiros."
      },
      {
        titulo: "Avalie os bens",
        texto:
          "Imóveis pelo valor venal ou avaliação cartorial. Veículos pela tabela FIPE. Contas pelo extrato na data do óbito."
      },
      {
        titulo: "Recolha o ITCMD",
        texto:
          "Imposto estadual de transmissão (2% a 8% conforme UF). Em SP, 4%. Em MG, 5%. Pago antes da escritura ou homologação."
      },
      {
        titulo: "Escolha o tipo — extrajudicial ou judicial",
        texto:
          "Extrajudicial (cartório) — só se todos herdeiros maiores, em acordo, e sem testamento. Judicial obrigatório com menores ou testamento."
      },
      {
        titulo: "Contrate advogado",
        texto:
          "Honorário 3% a 6% do patrimônio. Em patrimônio alto (>R$ 1M), negociar pode reduzir."
      },
      {
        titulo: "Protocole e aguarde",
        texto:
          "Extrajudicial — escritura pronta em 30 a 120 dias. Judicial — sentença em 12 a 36 meses. Após, registra-se a partilha em cada cartório."
      }
    ]
  },
  "inss-negou-beneficio-o-que-fazer": {
    titulo: "INSS negou benefício — fluxograma de recurso",
    steps: [
      {
        titulo: "Leia a carta de negativa",
        texto:
          "Identifique o motivo do indeferimento — falta de carência, falta de qualidade de segurado, não comprovação de incapacidade, perícia desfavorável."
      },
      {
        titulo: "Junte os documentos faltantes",
        texto:
          "CNIS atualizado, exames médicos, laudos, comprovantes de pagamento de contribuição (autônomos e MEIs)."
      },
      {
        titulo: "Entre com recurso administrativo",
        texto:
          "Prazo — 30 dias da ciência da negativa. Protocole pelo Meu INSS ou pessoalmente. Recurso vai para a Junta de Recursos do INSS."
      },
      {
        titulo: "Aguarde decisão da Junta",
        texto:
          "3 a 18 meses. Se for revertida, INSS paga atrasados desde a DER (Data de Entrada do Requerimento)."
      },
      {
        titulo: "Se mantida a negativa — ação judicial",
        texto:
          "Justiça Federal. Honorário advocatício 20% a 30% sobre parcelas atrasadas, ou fixo R$ 1.500 a R$ 5.000. Justiça gratuita para baixa renda."
      },
      {
        titulo: "Acompanhamento até a sentença",
        texto:
          "12 a 36 meses no 1º grau. Após sentença favorável, INSS paga atrasados (RPV até 60 SM, precatório acima) e implanta benefício mensal."
      }
    ]
  },
  "fui-demitido-sem-justa-causa": {
    titulo: "Fui demitido sem justa causa — fluxograma de verbas",
    steps: [
      {
        titulo: "Receba documentos da rescisão",
        texto:
          "TRCT (Termo de Rescisão), CTPS baixada, guia GRRF do FGTS, guia do seguro-desemprego, comprovantes dos pagamentos."
      },
      {
        titulo: "Confira o cálculo",
        texto:
          "Saldo de salário + aviso prévio (30 dias + 3 dias por ano) + 13º proporcional + férias proporcionais com 1/3 + multa 40% sobre FGTS."
      },
      {
        titulo: "Receba o saque do FGTS",
        texto:
          "Conta automaticamente bloqueada após demissão sem justa causa. Saque pelo aplicativo CAIXA — código sacador. Em 5 a 10 dias úteis cai na conta."
      },
      {
        titulo: "Solicite o seguro-desemprego",
        texto:
          "Até 120 dias após a demissão. Pelo aplicativo Carteira Digital ou no SINE. 3 a 5 parcelas conforme tempo de empresa."
      },
      {
        titulo: "Procure novo emprego — registre experiência",
        texto:
          "Atualize CTPS digital. Quitação só prorroga benefícios trabalhistas — quitar aviso prévio prolonga FGTS, 13º e férias."
      },
      {
        titulo: "Verbas não pagas → Reclamação Trabalhista",
        texto:
          "Vara do Trabalho. Gratuita pro trabalhador no 1º grau. Prazo prescricional — 2 anos depois da demissão, em relação aos 5 anos anteriores."
      }
    ]
  },
  "multa-de-transito-como-recorrer": {
    titulo: "Multa de trânsito — fluxograma de recurso",
    steps: [
      {
        titulo: "Receba a notificação da autuação (NIT)",
        texto:
          "Chega em 30 dias do registro. Você pode indicar o condutor (se outro dirigia) ou apresentar defesa prévia."
      },
      {
        titulo: "Defesa prévia (1º recurso)",
        texto:
          "Prazo — 30 dias da notificação. Argumente erro material, sinalização inadequada, problema no aparelho de medição. Protocolo no Detran ou pela internet."
      },
      {
        titulo: "JARI (Junta Administrativa de Recursos de Infrações)",
        texto:
          "Se a defesa prévia foi indeferida, recurso à JARI em 30 dias. Análise por colegiado, geralmente em 60 a 90 dias."
      },
      {
        titulo: "CETRAN (Conselho Estadual de Trânsito)",
        texto:
          "Se a JARI manteve a multa, último recurso administrativo. Prazo 30 dias. Decisão definitiva em âmbito estadual."
      },
      {
        titulo: "Justiça comum (ação anulatória)",
        texto:
          "Após esgotar recursos administrativos, ação na Justiça Estadual. Custas e advogado se a multa for alta (acima de 20 SM) — abaixo, vai no juizado especial."
      },
      {
        titulo: "Pagamento com desconto enquanto recurso pendente",
        texto:
          "Pagar com 20% de desconto NÃO impede o recurso, mas pagar a multa sem recorrer extingue o direito ao recurso."
      }
    ]
  }
};

export const QUADROS_COMPARATIVOS_POR_ARTIGO: Record<string, ComparativoArtigo> = {
  "como-pedir-divorcio": {
    titulo: "Divórcio — extrajudicial × judicial",
    colunaEsquerda: "Extrajudicial (cartório)",
    colunaDireita: "Judicial",
    rows: [
      {
        topico: "Quando cabe",
        esquerda: "Casal sem filhos menores ou incapazes, em acordo",
        direita: "Filhos menores, sem acordo, ou com bens complexos"
      },
      {
        topico: "Tempo até finalizar",
        esquerda: "30 a 90 dias",
        direita: "4 a 12 meses (consensual) / 12-36 meses (litigioso)"
      },
      {
        topico: "Onde",
        esquerda: "Qualquer cartório de notas",
        direita: "Vara de Família da comarca do casal/filhos"
      },
      {
        topico: "Advogado",
        esquerda: "1 advogado para ambos OU um pra cada",
        direita: "1 advogado por parte — obrigatório, salvo defensoria"
      },
      {
        topico: "Custo estimado",
        esquerda: "R$ 1.500 a R$ 6.000 + custas cartório",
        direita: "R$ 3.500 a R$ 15.000 + custas judiciais"
      },
      {
        topico: "Audiência",
        esquerda: "Não há",
        direita: "Audiência de conciliação + de instrução (litigioso)"
      }
    ]
  },
  "como-fazer-inventario": {
    titulo: "Inventário — extrajudicial × judicial",
    colunaEsquerda: "Extrajudicial (cartório)",
    colunaDireita: "Judicial",
    rows: [
      {
        topico: "Quando cabe",
        esquerda: "Todos herdeiros maiores, em acordo, sem testamento",
        direita: "Herdeiros menores, sem acordo, ou com testamento"
      },
      {
        topico: "Tempo até finalizar",
        esquerda: "30 a 120 dias",
        direita: "12 a 36 meses"
      },
      {
        topico: "Onde",
        esquerda: "Qualquer cartório de notas",
        direita: "Vara de Sucessões / Família"
      },
      {
        topico: "ITCMD",
        esquerda: "Recolhido antes da escritura",
        direita: "Recolhido durante o processo"
      },
      {
        topico: "Honorário",
        esquerda: "3% a 5% do patrimônio",
        direita: "4% a 6% do patrimônio"
      },
      {
        topico: "Custas cartório/judicial",
        esquerda: "Tabela do cartório (em torno de 1% do patrimônio)",
        direita: "Custas judiciais (variam por TJ)"
      }
    ]
  }
};

export function getFluxogramaForSlug(slug: string): FluxogramaArtigo | null {
  return FLUXOGRAMAS_POR_ARTIGO[slug] || null;
}

export function getComparativoForSlug(slug: string): ComparativoArtigo | null {
  return QUADROS_COMPARATIVOS_POR_ARTIGO[slug] || null;
}
