#!/usr/bin/env bash
# ============================================================================
# Microcache nginx do AdvAqui — aplicar NO VPS como root:
#   cd /var/www/advaqui && bash scripts/aplicar-microcache-advaqui.sh
#
# O que faz (idempotente, com backup e rollback):
#   1. Garante CACHE_REFRESH_SECRET no .env.local (gerado na hora, nunca sai
#      do servidor). O app usa esse segredo em refreshNginxCacheForLawyer()
#      para re-aquecer o cache na hora em mudança de perfil/plano.
#   2. Escreve /etc/nginx/conf.d/advaqui-microcache.conf (zona + maps).
#   3. Substitui o server block de /etc/nginx/sites-enabled/advaqui:
#      - /hub-api/ e /pdf-api/ intactos
#      - /_next/ sem microcache (mantém os headers immutable do Next)
#      - /api, /painel, /admin, /login, /cadastro, /recuperar-senha,
#        /redefinir-senha SEM cache e com headers do Next intactos
#      - resto (páginas públicas): cache 5 min, stale-while-revalidate,
#        bypass p/ logados (cookie sb-*/admin) e p/ o header secreto
#   4. nginx -t; se falhar, restaura o backup sozinho.
#   5. reload nginx + pm2 restart advaqui --update-env (lê o segredo novo).
#   6. Prova: 2 hits na home mostrando X-Adv-Cache MISS→HIT e TTFB.
#
# Comportamento resultante:
#   - Anônimo: página pública servida do cache (TTL 5 min; expirado, serve
#     stale e revalida em background — ninguém espera o Next renderizar).
#   - Logado (advogado/admin): sempre fresco (bypass por cookie).
#   - Perfil/plano alterado: o app re-busca as URLs do advogado com o header
#     secreto e o cache é substituído na hora (sem esperar o TTL).
#   - Cache-Control público vira: public, max-age=0, s-maxage=300,
#     stale-while-revalidate=86400 (o "private, no-store" do Next some das
#     páginas públicas; rotas privadas continuam com os headers originais).
# ============================================================================
set -u

ENV_FILE=/var/www/advaqui/.env.local
CONF_MAPS=/etc/nginx/conf.d/advaqui-microcache.conf
SITE=/etc/nginx/sites-enabled/advaqui
BACKUP="/root/nginx-advaqui-bak-$(date +%Y%m%d-%H%M%S)"

# ---- 1) segredo ------------------------------------------------------------
if grep -q '^CACHE_REFRESH_SECRET=' "$ENV_FILE" 2>/dev/null; then
  SECRET=$(grep '^CACHE_REFRESH_SECRET=' "$ENV_FILE" | head -1 | cut -d= -f2)
  echo "[ok] CACHE_REFRESH_SECRET já existia no .env.local"
else
  SECRET=$(openssl rand -hex 24)
  {
    printf '\n# Refresh do microcache nginx (mapa em %s)\n' "$CONF_MAPS"
    printf 'CACHE_REFRESH_SECRET=%s\n' "$SECRET"
  } >> "$ENV_FILE"
  echo "[ok] CACHE_REFRESH_SECRET criado no .env.local"
fi

# ---- 2) zona de cache + maps ------------------------------------------------
mkdir -p /var/cache/nginx
cat > "$CONF_MAPS" <<NGX
# Microcache das páginas públicas do AdvAqui
# (gerado por scripts/aplicar-microcache-advaqui.sh — editar lá, não aqui)
proxy_cache_path /var/cache/nginx/advaqui levels=1:2 keys_zone=advaqui_cache:64m max_size=2g inactive=48h use_temp_path=off;

# 1 = usuário logado (Supabase sb-* ou sessão admin) -> nunca cachear p/ ele
map \$http_cookie \$adv_auth_cookie {
    default 0;
    "~sb-" 1;
    "~advaqui_admin_session" 1;
}

# 1 = refresh autorizado: o app re-aquece a URL após mudança de perfil/plano
map \$http_x_adv_cache_refresh \$adv_cache_refresh {
    default 0;
    "${SECRET}" 1;
}
NGX
echo "[ok] $CONF_MAPS escrito"

# ---- 3) server block --------------------------------------------------------
cp -a "$SITE" "$BACKUP"
echo "[ok] backup do site em $BACKUP"

cat > "$SITE" <<'NGX'
server {
    server_name advaqui.com www.advaqui.com 187.77.5.38;

    client_max_body_size 26M;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    access_log /var/log/nginx/advaqui-access.log;
    error_log /var/log/nginx/advaqui-error.log;

    location ^~ /hub-api/ {
        client_max_body_size 26m;
        proxy_http_version 1.1;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
        proxy_request_buffering off;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3101/;
    }

    location ^~ /pdf-api/ {
        client_max_body_size 36m;
        proxy_http_version 1.1;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
        proxy_request_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:3100/;
    }

    # Estáticos do Next: já saem com immutable do próprio Next — sem microcache
    location ^~ /_next/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }

    # Rotas privadas/dinâmicas: sem cache, headers do Next intactos
    location ~ ^/(api|painel|admin|login|cadastro|recuperar-senha|redefinir-senha)(/|$) {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;
    }

    # Páginas públicas: microcache 5 min + stale-while-revalidate
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 180s;

        proxy_cache advaqui_cache;
        proxy_cache_key $scheme$host$request_uri;
        proxy_cache_methods GET HEAD;
        proxy_cache_valid 200 301 308 5m;
        proxy_cache_valid 404 1m;
        proxy_ignore_headers Cache-Control Expires;
        proxy_cache_use_stale updating error timeout http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;
        proxy_cache_lock on;
        proxy_cache_lock_timeout 10s;
        proxy_cache_bypass $http_upgrade $adv_auth_cookie $adv_cache_refresh;
        proxy_no_cache $adv_auth_cookie;
        proxy_hide_header Cache-Control;
        add_header Cache-Control "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" always;
        add_header X-Adv-Cache $upstream_cache_status always;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/advaqui.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/advaqui.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = www.advaqui.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = advaqui.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name advaqui.com www.advaqui.com 187.77.5.38;
    return 404; # managed by Certbot




}
NGX
echo "[ok] server block novo escrito"

# ---- 4) valida (rollback automático) -----------------------------------------
if ! nginx -t; then
  echo "[ERRO] nginx -t reprovou — restaurando backup"
  cp -a "$BACKUP" "$SITE"
  rm -f "$CONF_MAPS"
  nginx -t && systemctl reload nginx
  exit 1
fi

# ---- 5) aplica ----------------------------------------------------------------
systemctl reload nginx
echo "[ok] nginx recarregado"
pm2 restart advaqui --update-env >/dev/null && pm2 save >/dev/null
echo "[ok] pm2 advaqui reiniciado com o env novo"

# ---- 6) prova -------------------------------------------------------------------
sleep 2
for i in 1 2 3; do
  curl -sk -o /dev/null \
    -w "home hit$i: %{http_code} ttfb=%{time_starttransfer}s x-adv-cache=%header{x-adv-cache}\n" \
    "https://advaqui.com/" --resolve advaqui.com:443:127.0.0.1
done
curl -sk -o /dev/null \
  -w "cidade:   %{http_code} ttfb=%{time_starttransfer}s x-adv-cache=%header{x-adv-cache} cc=%header{cache-control}\n" \
  "https://advaqui.com/advogados/mg/almenara" --resolve advaqui.com:443:127.0.0.1
echo "[fim] microcache aplicado. MISS no 1º hit e HIT nos seguintes = funcionando."
