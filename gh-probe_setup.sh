#!/bin/sh
#
# GITHUB_TOKEN - secret token
# ORIGIN       - public domain, app has to substitue URLs in Link header with it
#

if [ -z "$GITHUB_TOKEN" -o -z "$ORIGIN" ]; then
  echo "GITHUB_TOKEN and ORIGIN required" >&2
  exit 1
fi

origin=$(echo ${ORIGIN} | sed 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g')
sed -i "s/<body>/<body><script>REACT_APP_GITHUB_API_BASE_URL=\'${origin}\/gh-api\'<\/script>/i" "/usr/share/nginx/gh-probe/index.html"
sed -i "/^\s*pid/c\pid /run/nginx_gh-probe.pid;" "/etc/nginx/nginx.conf"
sed -i "/^\s*#/d; s/__GITHUB_TOKEN__/${GITHUB_TOKEN}/g;" "/etc/nginx/conf.d/gh-probe.conf"

rm -r /etc/nginx/conf.d/default.conf /usr/share/nginx/html /tmp/gh-probe_setup.sh
