package models

type CodeRunData struct {
	Id     string   `json:"id"`
	Lang   string   `json:"lang"`
	Code   string   `json:"code"`
	Stats  RunStats `json:"stats"`
	Status string   `json:"status"`
}
type RunStats struct {
	Duration RunValues `json:"duration"`
	Mem      RunValues `json:"mem"`
	Cpu      RunValues `json:"cpu"`
}
type RunValues struct {
	Avg    float64   `json:"avg"`
	Values []float64 `json:"values"`
}
