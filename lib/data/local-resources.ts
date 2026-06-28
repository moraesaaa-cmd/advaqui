type StateResource = {
  oab: { name: string; url: string };
  tj: { name: string; url: string };
  defensoria: { name: string; url: string };
  procon: { name: string; url: string };
  pje: string;
};

const RESOURCES: Record<string, StateResource> = {
  AC: {
    oab: { name: "OAB/AC", url: "https://oabac.org.br" },
    tj: { name: "TJAC", url: "https://www.tjac.jus.br" },
    defensoria: { name: "DPE/AC", url: "https://defensoria.ac.gov.br" },
    procon: { name: "Procon/AC", url: "https://www.ac.gov.br/procon" },
    pje: "https://pje.tjac.jus.br",
  },
  AL: {
    oab: { name: "OAB/AL", url: "https://oab-al.org.br" },
    tj: { name: "TJAL", url: "https://www.tjal.jus.br" },
    defensoria: { name: "DPE/AL", url: "https://defensoria.al.def.br" },
    procon: { name: "Procon/AL", url: "https://www.procon.al.gov.br" },
    pje: "https://pje.tjal.jus.br",
  },
  AM: {
    oab: { name: "OAB/AM", url: "https://oabam.org.br" },
    tj: { name: "TJAM", url: "https://www.tjam.jus.br" },
    defensoria: { name: "DPE/AM", url: "https://defensoria.am.def.br" },
    procon: { name: "Procon/AM", url: "https://www.procon.am.gov.br" },
    pje: "https://pje.tjam.jus.br",
  },
  AP: {
    oab: { name: "OAB/AP", url: "https://oabap.org.br" },
    tj: { name: "TJAP", url: "https://www.tjap.jus.br" },
    defensoria: { name: "DPE/AP", url: "https://defensoria.ap.def.br" },
    procon: { name: "Procon/AP", url: "https://www.procon.ap.gov.br" },
    pje: "https://pje.tjap.jus.br",
  },
  BA: {
    oab: { name: "OAB/BA", url: "https://oab-ba.org.br" },
    tj: { name: "TJBA", url: "https://www.tjba.jus.br" },
    defensoria: { name: "DPE/BA", url: "https://www.defensoria.ba.def.br" },
    procon: { name: "Procon/BA", url: "https://www.procon.ba.gov.br" },
    pje: "https://pje.tjba.jus.br",
  },
  CE: {
    oab: { name: "OAB/CE", url: "https://oabce.org.br" },
    tj: { name: "TJCE", url: "https://www.tjce.jus.br" },
    defensoria: { name: "DPE/CE", url: "https://www.defensoria.ce.def.br" },
    procon: { name: "Procon/CE", url: "https://www.procon.ce.gov.br" },
    pje: "https://pje.tjce.jus.br",
  },
  DF: {
    oab: { name: "OAB/DF", url: "https://oabdf.org.br" },
    tj: { name: "TJDFT", url: "https://www.tjdft.jus.br" },
    defensoria: { name: "DPE/DF", url: "https://www.defensoria.df.gov.br" },
    procon: { name: "Procon/DF", url: "https://www.procon.df.gov.br" },
    pje: "https://pje.tjdft.jus.br",
  },
  ES: {
    oab: { name: "OAB/ES", url: "https://oabes.org.br" },
    tj: { name: "TJES", url: "https://www.tjes.jus.br" },
    defensoria: { name: "DPE/ES", url: "https://www.defensoria.es.def.br" },
    procon: { name: "Procon/ES", url: "https://www.procon.es.gov.br" },
    pje: "https://pje.tjes.jus.br",
  },
  GO: {
    oab: { name: "OAB/GO", url: "https://oabgo.org.br" },
    tj: { name: "TJGO", url: "https://www.tjgo.jus.br" },
    defensoria: { name: "DPE/GO", url: "https://www.defensoriapublica.go.gov.br" },
    procon: { name: "Procon/GO", url: "https://www.procon.go.gov.br" },
    pje: "https://pje.tjgo.jus.br",
  },
  MA: {
    oab: { name: "OAB/MA", url: "https://oabma.org.br" },
    tj: { name: "TJMA", url: "https://www.tjma.jus.br" },
    defensoria: { name: "DPE/MA", url: "https://www.defensoria.ma.def.br" },
    procon: { name: "Procon/MA", url: "https://www.procon.ma.gov.br" },
    pje: "https://pje.tjma.jus.br",
  },
  MG: {
    oab: { name: "OAB/MG", url: "https://oabmg.org.br" },
    tj: { name: "TJMG", url: "https://www.tjmg.jus.br" },
    defensoria: { name: "DPMG", url: "https://www.defensoria.mg.def.br" },
    procon: { name: "Procon/MG", url: "https://www.procon.mg.gov.br" },
    pje: "https://pje.tjmg.jus.br",
  },
  MS: {
    oab: { name: "OAB/MS", url: "https://oabms.org.br" },
    tj: { name: "TJMS", url: "https://www.tjms.jus.br" },
    defensoria: { name: "DPE/MS", url: "https://www.defensoria.ms.def.br" },
    procon: { name: "Procon/MS", url: "https://www.procon.ms.gov.br" },
    pje: "https://pje.tjms.jus.br",
  },
  MT: {
    oab: { name: "OAB/MT", url: "https://oabmt.org.br" },
    tj: { name: "TJMT", url: "https://www.tjmt.jus.br" },
    defensoria: { name: "DPE/MT", url: "https://www.defensoria.mt.def.br" },
    procon: { name: "Procon/MT", url: "https://www.procon.mt.gov.br" },
    pje: "https://pje.tjmt.jus.br",
  },
  PA: {
    oab: { name: "OAB/PA", url: "https://oabpa.org.br" },
    tj: { name: "TJPA", url: "https://www.tjpa.jus.br" },
    defensoria: { name: "DPE/PA", url: "https://www.defensoria.pa.def.br" },
    procon: { name: "Procon/PA", url: "https://www.procon.pa.gov.br" },
    pje: "https://pje.tjpa.jus.br",
  },
  PB: {
    oab: { name: "OAB/PB", url: "https://oabpb.org.br" },
    tj: { name: "TJPB", url: "https://www.tjpb.jus.br" },
    defensoria: { name: "DPE/PB", url: "https://www.defensoria.pb.def.br" },
    procon: { name: "Procon/PB", url: "https://www.procon.pb.gov.br" },
    pje: "https://pje.tjpb.jus.br",
  },
  PE: {
    oab: { name: "OAB/PE", url: "https://oabpe.org.br" },
    tj: { name: "TJPE", url: "https://www.tjpe.jus.br" },
    defensoria: { name: "DPPE", url: "https://www.defensoria.pe.def.br" },
    procon: { name: "Procon/PE", url: "https://www.procon.pe.gov.br" },
    pje: "https://pje.tjpe.jus.br",
  },
  PI: {
    oab: { name: "OAB/PI", url: "https://oabpi.org.br" },
    tj: { name: "TJPI", url: "https://www.tjpi.jus.br" },
    defensoria: { name: "DPE/PI", url: "https://www.defensoria.pi.def.br" },
    procon: { name: "Procon/PI", url: "https://www.procon.pi.gov.br" },
    pje: "https://pje.tjpi.jus.br",
  },
  PR: {
    oab: { name: "OAB/PR", url: "https://oabpr.org.br" },
    tj: { name: "TJPR", url: "https://www.tjpr.jus.br" },
    defensoria: { name: "DPE/PR", url: "https://www.defensoriapublica.pr.def.br" },
    procon: { name: "Procon/PR", url: "https://www.procon.pr.gov.br" },
    pje: "https://projudi.tjpr.jus.br",
  },
  RJ: {
    oab: { name: "OAB/RJ", url: "https://oabrj.org.br" },
    tj: { name: "TJRJ", url: "https://www.tjrj.jus.br" },
    defensoria: { name: "DPGE/RJ", url: "https://defensoria.rj.def.br" },
    procon: { name: "Procon/RJ", url: "https://www.procon.rj.gov.br" },
    pje: "https://pje.tjrj.jus.br",
  },
  RN: {
    oab: { name: "OAB/RN", url: "https://oabrn.org.br" },
    tj: { name: "TJRN", url: "https://www.tjrn.jus.br" },
    defensoria: { name: "DPE/RN", url: "https://www.defensoria.rn.def.br" },
    procon: { name: "Procon/RN", url: "https://www.procon.rn.gov.br" },
    pje: "https://pje.tjrn.jus.br",
  },
  RO: {
    oab: { name: "OAB/RO", url: "https://oab-ro.org.br" },
    tj: { name: "TJRO", url: "https://www.tjro.jus.br" },
    defensoria: { name: "DPE/RO", url: "https://www.defensoria.ro.def.br" },
    procon: { name: "Procon/RO", url: "https://www.procon.ro.gov.br" },
    pje: "https://pje.tjro.jus.br",
  },
  RR: {
    oab: { name: "OAB/RR", url: "https://oab-rr.org.br" },
    tj: { name: "TJRR", url: "https://www.tjrr.jus.br" },
    defensoria: { name: "DPE/RR", url: "https://www.defensoria.rr.def.br" },
    procon: { name: "Procon/RR", url: "https://www.procon.rr.gov.br" },
    pje: "https://pje.tjrr.jus.br",
  },
  RS: {
    oab: { name: "OAB/RS", url: "https://oabrs.org.br" },
    tj: { name: "TJRS", url: "https://www.tjrs.jus.br" },
    defensoria: { name: "DPE/RS", url: "https://www.defensoria.rs.def.br" },
    procon: { name: "Procon/RS", url: "https://www.procon.rs.gov.br" },
    pje: "https://eproc.tjrs.jus.br",
  },
  SC: {
    oab: { name: "OAB/SC", url: "https://oab-sc.org.br" },
    tj: { name: "TJSC", url: "https://www.tjsc.jus.br" },
    defensoria: { name: "DPE/SC", url: "https://www.defensoria.sc.def.br" },
    procon: { name: "Procon/SC", url: "https://www.procon.sc.gov.br" },
    pje: "https://eproc.tjsc.jus.br",
  },
  SE: {
    oab: { name: "OAB/SE", url: "https://oab-se.org.br" },
    tj: { name: "TJSE", url: "https://www.tjse.jus.br" },
    defensoria: { name: "DPE/SE", url: "https://www.defensoria.se.def.br" },
    procon: { name: "Procon/SE", url: "https://www.procon.se.gov.br" },
    pje: "https://pje.tjse.jus.br",
  },
  SP: {
    oab: { name: "OAB/SP", url: "https://oabsp.org.br" },
    tj: { name: "TJSP", url: "https://www.tjsp.jus.br" },
    defensoria: { name: "DPESP", url: "https://www.defensoria.sp.def.br" },
    procon: { name: "Procon/SP", url: "https://www.procon.sp.gov.br" },
    pje: "https://esaj.tjsp.jus.br",
  },
  TO: {
    oab: { name: "OAB/TO", url: "https://oabto.org.br" },
    tj: { name: "TJTO", url: "https://www.tjto.jus.br" },
    defensoria: { name: "DPE/TO", url: "https://www.defensoria.to.def.br" },
    procon: { name: "Procon/TO", url: "https://www.procon.to.gov.br" },
    pje: "https://pje.tjto.jus.br",
  },
};

export function getStateResources(uf: string): StateResource | null {
  return RESOURCES[uf.toUpperCase()] ?? null;
}
