#!/bin/sh
#
# GITHUB_TOKEN - secret token
# ORIGIN       - public domain
# BASENAME     - path
#

if [ ! "$GITHUB_TOKEN" ] || [ ! "$ORIGIN" ]; then
  echo "GITHUB_TOKEN and ORIGIN required" >&2
  exit 1
fi

index_html="/usr/share/nginx/gh-probe/index.html"

# patching index.html is a way to pass environment variables
origin=$(echo "${ORIGIN}" | sed 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')
sed -i "s/<body>/&<script>ORIGIN=\'${origin}\'<\/script>/i" "$index_html"
if [ "$BASENAME" ]; then
  basename=$(echo "${BASENAME}" | sed 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')
  sed -i "s/<body><script>/&BASENAME=\'${basename}\';/i;\
          s/\/favicon.ico/${basename}&/ig;\
          s/\/manifest.json/${basename}&/ig" \
    "$index_html"
fi

sed -i "/^\s*pid/c\pid /run/nginx_gh-probe.pid;" "/etc/nginx/nginx.conf"
sed -i "/^\s*#/d; s/__GITHUB_TOKEN__/${GITHUB_TOKEN}/g;" "/etc/nginx/conf.d/gh-probe.conf"

rm -r /etc/nginx/conf.d/default.conf /usr/share/nginx/html /tmp/gh-probe_setup.sh
