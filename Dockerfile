FROM nginx:alpine

COPY gh-probe_setup.sh /tmp
COPY nginx.conf /etc/nginx/conf.d/gh-probe.conf
COPY build /usr/share/nginx/gh-probe

CMD /tmp/gh-probe_setup.sh && nginx -g 'daemon off;'