package parser

import (
	b64 "encoding/base64"
	"fmt"
	"io/ioutil"

	"github.com/anuragashok/faster.codes/backend/executor/models"
)

type SimpleFileParser struct {
	fileName string
}

func (p SimpleFileParser) Parse(codeRunData *models.CodeRunData) error {
	fmt.Println("SimpleFileParser")

	code, err := b64.StdEncoding.DecodeString(codeRunData.Code)
	if err != nil {
		return err
	}

	if err = ioutil.WriteFile(p.fileName, code, 0777); err != nil {
		return err
	}
}
