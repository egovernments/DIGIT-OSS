/*
Copyright © 2019 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package main

import (
	"fmt"
	"log"
	"os"
	"text/template"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"

	"k8s.io/client-go/rest"
)

// Route comprising of attributes to build a zuul route object
type Route struct {
	Path       string // Annotation value of zuul/route-path pointing to the context to be filtered
	ServiceURL string // Service URL to be redirected to
}

const sAnnotation string = "zuul/route-path"
const routesTemplate string = `
{{- range . }}  
zuul.routes.{{ .Path }}.path=/{{ .Path }}/**
zuul.routes.{{ .Path }}.stripPrefix=false
zuul.routes.{{ .Path }}.url={{ .ServiceURL }}
{{ end -}}
`

func getKubeConnection() (clientset *kubernetes.Clientset) {

	config, err := rest.InClusterConfig()
	if err != nil {
		panic(err)
	}
	clientset, err = kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	return clientset
}

func listAllServices(clientset *kubernetes.Clientset, namespace string) (s *v1.ServiceList) {
	sc := clientset.CoreV1().Services(namespace)

	s, err := sc.List(metav1.ListOptions{})
	if err != nil {
		panic(err)
	}

	return s
}

func getZuulRoutes(s *v1.ServiceList) (r *[]Route) {
	routes := []Route{}
	for _, s := range s.Items {

		if s.Annotations != nil {
			if val, ok := s.Annotations[sAnnotation]; ok {
				path := fmt.Sprintf("%s", val)
				url := fmt.Sprintf("http://%s.%s:%d/", s.Name, s.Namespace, s.Spec.Ports[0].Port)
				routes = append(routes, Route{path, url})
				log.Printf("Configuring service %s routing to service URL %s \n", path, url)
			}
		}
	}

	return &routes

}

func writeTemplate(r *[]Route) {
	path, _ := os.LookupEnv("OUTPUT_FILE_PATH")
	f, err := os.Create(path)
	if err != nil {
		panic(err)
	}

	tmpl, err := template.New("test").Parse(routesTemplate)
	if err != nil {
		panic(err)
	}

	err = tmpl.Execute(f, *r)
	if err != nil {
		panic(err)
	}

	f.Close()
}

// Get all kubernetes services in the cluster using config serviceaccount
// Filter services with annotation "zuul/route-path"
// Build zuul routing configuration using configured template file
// Write file to "OUTPUT_FILE_PATH" path
func main() {
	if _, ok := os.LookupEnv("OUTPUT_FILE_PATH"); !ok {
		log.Panicln("OUTPUT_FILE_PATH environment variable not set! Exiting!")
	}
	n, ok := os.LookupEnv("NAMESPACE")
	if !ok {
		log.Println("NAMESPACE environment vairable not set, defaulting to cluster wide")
	}

	clientset := getKubeConnection()
	s := listAllServices(clientset, n)
	r := getZuulRoutes(s)
	writeTemplate(r)
}
