FROM nginx:alpine

COPY gh-probe_setup.sh /tmp
COPY nginx.conf /etc/nginx/conf.d/gh-probe.conf
COPY build /usr/share/nginx/gh-probe

CMD ( ( test -f /tmp/gh-probe_setup.sh && /tmp/gh-probe_setup.sh ) || true ) && nginx -g 'daemon off;'