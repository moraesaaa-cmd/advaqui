#!/usr/bin/env bash
# ============================================================================
# Deploy PONTE do AdvAqui — rodar NO VPS como root:
#   cd /var/www/advaqui && git pull && bash scripts/deploy-ponte.sh
#
# Protocolo validado (08/07): o build in-place com o next-server vivo trava;
# aqui o staging (/var/www/advaqui-build, já buildado e validado) serve o
# público na porta 3000 enquanto o live builda parado. Downtime ~segundos.
# Rollback automático se o build falhar ou a verificação reprovar.
# ============================================================================
set -u
cd /var/www/advaqui

echo "=== pré-condição: staging buildado? ==="
if [ ! -d /var/www/advaqui-build/.next ]; then
  echo "[ERRO] /var/www/advaqui-build/.next não existe. Rode antes:"
  echo "  rsync -a --exclude='.next*' --exclude=node_modules --exclude='.git' --exclude='.env*' /var/www/advaqui/ /var/www/advaqui-build/"
  echo "  cd /var/www/advaqui-build && npm run typecheck && npm run build"
  exit 1
fi

echo "=== backup .next (hardlink) ==="
if [ -d .next.livebak ]; then mv .next.livebak "/tmp/next.livebak.old.$(date +%s)"; fi
cp -al .next .next.livebak && echo "BACKUP_OK"

echo "=== PONTE: staging assume o público ==="
pm2 stop advaqui >/dev/null 2>&1
pm2 start npm --name advaqui-temp --cwd /var/www/advaqui-build -- start >/dev/null 2>&1
sleep 6
TEMP_CODE=$(curl -sk -o /dev/null -w '%{http_code}' https://advaqui.com/ --resolve advaqui.com:443:127.0.0.1)
echo "TEMP_HOME=$TEMP_CODE"
if [ "$TEMP_CODE" != "200" ]; then
  pm2 delete advaqui-temp >/dev/null 2>&1; pm2 start advaqui >/dev/null 2>&1
  echo "PONTE_FALHOU — advaqui retomado no build antigo"; exit 1
fi

echo "=== build live (server parado) ==="
timeout 1200 npm run build > /tmp/adv_live_build.log 2>&1
BUILD_EXIT=$?
echo "LIVE_BUILD_EXIT=$BUILD_EXIT"
tail -3 /tmp/adv_live_build.log
if [ "$BUILD_EXIT" != "0" ]; then
  mv .next "/tmp/next.bad.$(date +%s)" 2>/dev/null
  mv .next.livebak .next
  pm2 delete advaqui-temp >/dev/null 2>&1; pm2 start advaqui >/dev/null 2>&1
  echo "ROLLBACK_FEITO (build falhou — site no build antigo)"; exit 1
fi

echo "=== swap de volta ==="
pm2 delete advaqui-temp >/dev/null 2>&1
pm2 start advaqui >/dev/null 2>&1
sleep 8
pm2 save >/dev/null 2>&1

echo "=== verificação (retry até 3x por URL) ==="
FAILS=0
check() {
  want="$1"; url="$2"; tries=0; code=000
  while [ $tries -lt 3 ]; do
    code=$(curl -sk -o /dev/null -w '%{http_code}' --max-time 40 "$url" --resolve advaqui.com:443:127.0.0.1)
    [ "$code" = "$want" ] && break
    tries=$((tries+1)); sleep 7
  done
  if [ "$code" = "$want" ]; then echo "OK   $code $url"; else echo "FAIL want=$want got=$code $url"; FAILS=$((FAILS+1)); fi
  sleep 1
}
check 200 https://advaqui.com/
check 200 https://advaqui.com/advogados
check 200 https://advaqui.com/advogados/mg
check 200 https://advaqui.com/advogados/mg/almenara
check 200 https://advaqui.com/advogados/mg/almenara/administrativo
check 200 https://advaqui.com/advogados/mg/almenara/criminal
check 200 https://advaqui.com/advogado/kellsons-de-moraes-oliveira
check 200 https://advaqui.com/advogados-de/civil/em/almenara-mg
check 200 https://advaqui.com/glossario/fgts/em/almenara-mg
check 200 https://advaqui.com/blog/rescisao-indireta-como-funciona
check 200 https://advaqui.com/quanto-custa/divorcio/em/sao-paulo-sp
check 200 https://advaqui.com/calculadoras/rescisao-trabalhista
check 200 https://advaqui.com/ferramentas
check 200 https://advaqui.com/ferramentas/pdf
check 200 https://advaqui.com/planos
check 200 https://advaqui.com/cadastro
check 200 https://advaqui.com/criar-perfil
check 200 https://advaqui.com/login
check 200 https://advaqui.com/recurso-de-multa/mg/belo-horizonte
check 200 https://advaqui.com/jurisprudencia/stf
check 200 https://advaqui.com/sitemap.xml
check 404 https://advaqui.com/advogados/mg/cidade-que-nao-existe/civil
check 404 https://advaqui.com/glossario/termo-inexistente/em/cidade-inexistente-zz
check 404 https://advaqui.com/advogados-de/administrativo/em/almenara
check 404 https://advaqui.com/quanto-custa/divorcio/em/cidade-fake-zz
check 404 https://advaqui.com/tribunais/mg/cidade-que-nao-existe
check 404 https://advaqui.com/advogados/zz
echo "FAILS=$FAILS"

echo "=== provas das correções ==="
echo "--- lawyerCount (Almenara deve ser >0) ---"
curl -sk --max-time 20 "https://advaqui.com/api/cities?q=almenara" --resolve advaqui.com:443:127.0.0.1; echo ""
echo "--- ItemList na página de cidade ---"
curl -sk --max-time 40 "https://advaqui.com/advogados/mg/almenara" --resolve advaqui.com:443:127.0.0.1 | grep -o '"@type":"ItemList"' | head -1
echo "--- noindex no perfil inexistente (200-soft controlado) ---"
curl -sk --max-time 40 https://advaqui.com/advogado/perfil-que-nao-existe --resolve advaqui.com:443:127.0.0.1 | grep -c noindex

if [ "$FAILS" != "0" ]; then
  pm2 stop advaqui >/dev/null 2>&1
  mv .next "/tmp/next.bad.$(date +%s)" 2>/dev/null
  mv .next.livebak .next
  pm2 start advaqui >/dev/null 2>&1
  echo "ROLLBACK_FEITO (verificação reprovou — site no build antigo)"; exit 1
fi
echo "DEPLOY_PONTE_OK"
