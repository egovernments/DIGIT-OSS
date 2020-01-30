{{- range . }}  
zuul.routes.{{ .Path }}.path=/{{ .Path }}/**
zuul.routes.{{ .Path }}.stripPrefix=false
zuul.routes.{{ .Path }}.url={{ .Url }}
{{ end -}}