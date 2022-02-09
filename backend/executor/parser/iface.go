package parser

import (
	"github.com/anuragashok/faster.codes/backend/executor/models"
)

var (
	parsers = make(map[string]Parser)
)

func Init() {
	parsers["java"] = SimpleFileParser{fileName: "Main.java"}
	parsers["go"] = SimpleFileParser{fileName: "main.go"}
}

type Parser interface {
	Parse(codeRunData *models.CodeRunData) error
}

func Get(lang string) Parser {
	return parsers[lang]
}
