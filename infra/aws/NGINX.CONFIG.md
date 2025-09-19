# NGINX Configuration

## 1) First step to configure the nginx stuff

``` bash
set -euo pipefail

# Make sure dirs exist
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/certbot /etc/ssl/private /etc/ssl/certs

# Remove distro default to avoid "duplicate default" errors
sudo rm -f /etc/nginx/sites-enabled/default

# Create a temporary self-signed cert so nginx can start now
sudo openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout /etc/ssl/private/api-datatech.key \
  -out /etc/ssl/certs/api-datatech.crt \
  -days 30 \
  -subj "/CN=api.thorium-technologies.com"

# Write the Nginx vhost (CORS + preflight + proxy to :3000)
sudo tee /etc/nginx/sites-available/api.thorium-technologies.com.conf >/dev/null <<'NGINX'
server {
  listen 80;
  listen [::]:80;
  server_name api.thorium-technologies.com;

  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://$host$request_uri; }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name api.thorium-technologies.com;

  # TEMP certs (replaced by certbot in step 2)
  ssl_certificate     /etc/ssl/certs/api-datatech.crt;
  ssl_certificate_key /etc/ssl/private/api-datatech.key;

  # Security headers
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Content-Type-Options nosniff;
  add_header X-Frame-Options DENY;
  add_header Referrer-Policy strict-origin-when-cross-origin;

  # ===== CORS =====
  # Echo caller's Origin (works with localhost and credentials). If you want to restrict,
  # replace the line below with a whitelist regex.
  set $cors_origin "*";
  if ($http_origin != "") { set $cors_origin $http_origin; }

  # ===== API (proxy to NestJS :3000) =====
  location / {
    # Preflight
    if ($request_method = OPTIONS) {
      add_header Access-Control-Allow-Origin $cors_origin always;
      add_header Vary "Origin" always;
      add_header Access-Control-Allow-Credentials "true" always;
      add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
      add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin, X-Requested-With" always;
      add_header Access-Control-Max-Age 86400 always;
      return 204;
    }

    # Actual CORS
    add_header Access-Control-Allow-Origin $cors_origin always;
    add_header Vary "Origin" always;
    add_header Access-Control-Allow-Credentials "true" always;
    add_header Access-Control-Expose-Headers "Content-Length, Content-Type, Authorization" always;

    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Connection        "";
    proxy_set_header   Authorization     $http_authorization;
    proxy_read_timeout 60s;
  }

  # WebSockets (if used)
  location /socket.io/ {
    add_header Access-Control-Allow-Origin $cors_origin always;
    add_header Vary "Origin" always;
    add_header Access-Control-Allow-Credentials "true" always;

    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
}
NGINX

# Enable the site
sudo ln -sf /etc/nginx/sites-available/api.thorium-technologies.com.conf /etc/nginx/sites-enabled/api.thorium-technologies.com.conf

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## 2) Install real TLS with Let’s Encrypt (overwrite cert paths automatically)

``` bash
# Ensure ports 80/443 are open in your EC2 security group and DNS A record resolves to this server
sudo apt-get update -y
sudo apt-get install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d api.thorium-technologies.com \
  --redirect --agree-tos -m admin@thorium-technologies.com

# Verify Nginx picks up the new certs
sudo nginx -t && sudo systemctl reload nginx
```
