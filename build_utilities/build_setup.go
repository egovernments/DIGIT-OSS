package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"strings"

	"gopkg.in/yaml.v2"
)

//Defining a struct to parse the yaml file
type BuildConfig struct {
	Config []struct {
		Name  string `yaml:"name"`
		Build []struct {
			Workdir    string `yaml:"work-dir"`
			Imagename  string `yaml:"image-name"`
			Dockerfile string `yaml:"dockerfile"`
		} `yaml:"build"`
	} `yaml:"config"`
}

func main() {
	//var job string = "pt-calculator-v2"
	//var jobs []string
	serviceList := "./servicelist"
	content, _ := ioutil.ReadFile(serviceList)
	jobs := strings.Split(string(content), "\n")
	//fmt.Println(jobs)
	argFile := "./build/build-config.yml"
	var dockerBuildCmd string
	// Decode the yaml file and assigning the values to a map
	buildFile, err := ioutil.ReadFile(argFile)
	if err != nil {
		fmt.Println("\n\tERROR: Reading file =>", argFile, err)
		return
	}
	// Parse the yaml values
	fullChart := BuildConfig{}
	err = yaml.Unmarshal(buildFile, &fullChart)
	if err != nil {
		fmt.Println("\n\tERROR: Parsing => ", argFile, err)
		return
	}
	for _, job := range jobs {
		if job != "" {
			for _, c := range fullChart.Config {
				svcName := c.Name[strings.LastIndex(c.Name, "/")+1 : len(c.Name)]
				if strings.EqualFold(svcName, job) {
					//if strings.Contains(c.Name, job) {
					//svcName := c.Name[strings.LastIndex(c.Name, "/")+1 : len(c.Name)]
					//fmt.Println("Job name :", job)
					imglist := c.Build
					//fmt.Println("name", job)
					for _, img := range imglist {
						var dockerfile string = ""
						dockerfile = img.Dockerfile
						buildContext := "."
						if dockerfile == "" {
							dockerfile = img.Workdir + "/Dockerfile"
							//  buildContext = img.Workdir + "/."
						}
						if strings.Contains(img.Workdir, "/db") {
							buildContext = img.Workdir + "/."
							fmt.Println("\nBuiling the", img.Imagename)
							dockerBuildCmd = fmt.Sprintf("docker build -t ghcr.io/%s:v2-${{ env.SHA }}-${{ env.GITHUB_RUN_NUMBER }} -f %s %s", img.Imagename, dockerfile, buildContext)
						} else {
							fmt.Println("\nBuiling the", img.Imagename)
							dockerBuildCmd = fmt.Sprintf("docker build -t ghcr.io/%s:v2-${{ env.SHA }}-${{ env.GITHUB_RUN_NUMBER }} --build-arg WORK_DIR=%s -f %s %s", img.Imagename, img.Workdir, dockerfile, buildContext)
						}
						//fmt.Printf(buildContext)
						//fmt.Println("docker", img.Dockerfile)
						//fmt.Println("workdir", img.Workdir)
						//goBuildCmd = fmt.Sprintf("go run main.go deploy -c -e %s %s", env, argStr)
						//dockerBuildCmd = fmt.Sprintf("docker build -t ghcr.io/%s:v2 --build-arg WORK_DIR=%s -f %s %s", img.Imagename, img.Workdir, dockerfile, buildContext)
						fmt.Println(dockerBuildCmd)
						//execCmd(dockerBuildCmd)
					}
					//return
				}
			}
		}
	}
}
func execCmd(command string) error {
	var err error
	parts := strings.Fields(command)
	//log.Println("Printing full command part", parts)
	//  The first part is the command, the rest are the args:
	head := parts[0]
	args := parts[1:len(parts)]
	//  Format the command
	cmd := exec.Command(head, args...)
	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = io.MultiWriter(os.Stdout, &stdoutBuf)
	cmd.Stderr = io.MultiWriter(os.Stderr, &stderrBuf)
	err = cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	return err
}
