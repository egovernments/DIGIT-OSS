#!/bin/sh
if [[ "$SUBFILTER" = "YES" ]]; then
echo "sub_filter  '<head>' '" >> /etc/nginx/conf.d/sub_filter.conf
  if [[ -n "$TL_ULB_JS_URL" ]]; then
    echo "<script src="$TL_ULB_JS_URL" type="text/javascript"></script>" >> /etc/nginx/conf.d/sub_filter.conf
  fi
echo "<"/"head>';" >> /etc/nginx/conf.d/sub_filter.conf
echo "sub_filter_once on;" >> /etc/nginx/conf.d/sub_filter.conf
fi
nginx -g "daemon off;"
