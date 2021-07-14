package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
)

const token = "YWdQau6M3BFc25tAXuvhwAtt"

func SendRequest(path string) []byte {
	url := url.URL{
		Scheme: "https",
		Host:   "api.storyblok.com",
		Path:   fmt.Sprintf("/v2/cdn/%s", path),
	}
	query := url.Query()
	query.Add("token", token)
	url.RawQuery = query.Encode()

	client := http.Client{}

	req, err := http.NewRequest(http.MethodGet, url.String(), nil)
	if err != nil {
		log.Fatal(err)
	}

	req.Header.Set("User-Agent", "static-importer")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	return body
}
