package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/tidwall/gjson"
)

func ImportStories(dist string, previewToken string) {
	body := SendRequest("stories", previewToken)

	stories := gjson.GetBytes(body, "stories|@pretty")

	stories.ForEach(func(key, item gjson.Result) bool {
		slug := item.Get("full_slug").String()
		if len(slug) == 0 {
			return true
		}

		var rPath string
		if slug == "home" {
			rPath = "/_index.md"
		} else if strings.HasSuffix(slug, "/") {
			rPath = fmt.Sprintf("/%s_index.md", slug)
		} else {
			rPath = fmt.Sprintf("/%s.md", slug)
		}

		path, err := filepath.Abs(filepath.Join(dist, rPath))
		if err != nil {
			log.Fatal(err)
		}

		dir := filepath.Dir(path)

		err = os.MkdirAll(dir, os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}

		err = ioutil.WriteFile(path, []byte(item.Raw), os.ModePerm)
		if err != nil {
			log.Fatal(err)
		}

		return true
	})
}
