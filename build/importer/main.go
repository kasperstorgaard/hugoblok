package main

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

type Secrets struct {
	CmsPreviewToken string `toml:"cmsPreviewToken"`
}

func main() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal("unable to find working dir")
	}

	dist := filepath.Join(wd, "content")
	secrets := getSecrets(wd)
	ImportStories(dist, secrets.CmsPreviewToken)
}

func getSecrets(wd string) Secrets {
	path := filepath.Join(wd, "secrets.toml")
	content, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal("unable to read secrets file")
	}

	dat := Secrets{}
	toml.Unmarshal(content, &dat)
	return dat
}
