package main

import (
	"log"
	"os"
	"path/filepath"
)

func main() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal("unable to find working dir")
	}

	dist := filepath.Join(wd, "content")
	ImportStories(dist)
}
