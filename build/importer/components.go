package main

type CmsComponent struct {
	Component string `json:"component"`
	Editable  string `json:"_editable"`
	CmsTeaserFields
	CmsFeatureFields
	CmsGridFields
}

type CmsPage struct {
	Component string         `json:"component"`
	Editable  string         `json:"_editable"`
	Body      []CmsComponent `json:"body"`
}

type CmsTeaserFields struct {
	Headline string `json:"headline,omitempty"`
}

type CmsFeatureFields struct {
	Name string `json:"name,omitempty"`
}

type CmsGridFields struct {
	Columns []CmsComponent `json:"columns,omitempty"`
}
