import { buildMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Política de privacidade",
  description: `Como o ${SITE.name} trata dados pessoais conforme a LGPD.`,
  path: "/privacidade"
});

export default function PrivacidadePage() {
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-6">
        Política de privacidade
      </h1>
      <article className="prose max-w-none text-brand-ink/85 space-y-4 leading-relaxed">
        <p>
          <strong>1. Dados coletados.</strong> Coletamos nome, CPF, OAB, e-mail, telefone, endereço
          profissional, cidade, estado, áreas de atuação e senha. Os dados são fornecidos
          voluntariamente pelo usuário no momento do cadastro.
        </p>
        <p>
          <strong>2. Finalidade.</strong> Os dados são utilizados para criação e manutenção do
          perfil no diretório, exibição pública de informações profissionais (nome, OAB, cidade,
          telefone, WhatsApp e endereço), gerenciamento do plano premium e comunicação com o
          usuário.
        </p>
        <p>
          <strong>3. Base legal.</strong> O tratamento é realizado com base no consentimento do
          titular (art. 7º, I, da LGPD) e na execução de contrato (art. 7º, V).
        </p>
        <p>
          <strong>4. Compartilhamento.</strong> Dados profissionais são exibidos publicamente no
          diretório. CPF e senha não são exibidos publicamente em nenhuma circunstância. Não
          vendemos dados a terceiros.
        </p>
        <p>
          <strong>5. Armazenamento.</strong> Os dados são armazenados de forma segura pelo tempo
          necessário à manutenção do cadastro ou até solicitação de exclusão pelo titular.
        </p>
        <p>
          <strong>6. Direitos do titular.</strong> O titular pode, a qualquer momento, solicitar
          acesso, correção, exclusão, portabilidade ou anonimização dos seus dados pessoais,
          mediante contato pelo formulário de suporte ou pelo e-mail {SITE.email}.
        </p>
        <p>
          <strong>7. Segurança.</strong> Adotamos medidas técnicas e administrativas para proteger
          os dados contra acessos não autorizados, perda ou destruição. Senhas são armazenadas com
          hash criptográfico.
        </p>
        <p>
          <strong>8. Encarregado de proteção de dados (DPO).</strong> Para questões relativas à
          proteção de dados, entre em contato pelo e-mail {SITE.email} com o assunto &quot;DPO&quot;.
        </p>
        <p>
          <strong>9. Cookies.</strong> Utilizamos cookies estritamente necessários para
          autenticação. Não usamos cookies de rastreamento publicitário.
        </p>
        <p className="text-sm text-brand-ink/60 mt-8">
          Última atualização — 17 de maio de 2026.
        </p>
      </article>
    </div>
  );
}
