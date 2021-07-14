package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

type cmsStory struct {
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
	FullSlug  string `json:"full_slug"`
}

type contentStory struct {
	Title string `json:"title"`
	Date  string `json:"date"`
}

type cmsData struct {
	Stories []cmsStory `json:"stories"`
}

func ImportStories() {
	body := SendRequest("stories")

	data := cmsData{}
	err := json.Unmarshal(body, &data)

	if err != nil {
		log.Fatal(err)
	}

	for _, item := range data.Stories {
		if len(item.FullSlug) == 0 {
			break
		}

		rPath := fmt.Sprintf("content/%s.md", strings.TrimSuffix(item.FullSlug, "/"))
		path, err := filepath.Abs(rPath)
		if err != nil {
			log.Fatal(err)
		}

		dir := filepath.Dir(path)

		err = os.MkdirAll(dir, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}

		content := contentStory{
			Title: item.Name,
			Date:  item.CreatedAt,
		}

		body, err := json.MarshalIndent(&content, "", "  ")
		if err != nil {
			log.Fatal(err)
		}

		err = ioutil.WriteFile(path, body, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}
	}
}
