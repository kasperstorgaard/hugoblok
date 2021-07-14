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
	Name      string  `json:"name"`
	CreatedAt string  `json:"created_at"`
	FullSlug  string  `json:"full_slug"`
	Slug      string  `json:"slug"`
	Content   CmsPage `json:"content"`
}

type contentStory struct {
	Title   string  `json:"title"`
	Date    string  `json:"date"`
	Slug    string  `json:"slug"`
	Content CmsPage `json:"content"`
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

		var rPath string
		if item.FullSlug == "home" {
			rPath = "content/_index.md"
		} else if strings.HasSuffix(item.FullSlug, "/") {
			rPath = fmt.Sprintf("content/%s_index.md", item.FullSlug)
		} else {
			rPath = fmt.Sprintf("content/%s.md", item.FullSlug)
		}

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
			Title:   item.Name,
			Date:    item.CreatedAt,
			Slug:    item.Slug,
			Content: item.Content,
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
