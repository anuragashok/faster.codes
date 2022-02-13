package parser

import (
	b64 "encoding/base64"
	"io/ioutil"

	"github.com/anuragashok/faster.codes/executor/constants"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/output"
)

type SimpleFileParser struct {
	fileName string 
}

func (p SimpleFileParser) Parse(codeRunData *models.CodeRunData) error {
	output.System("Simple File Parser")

	code, err := b64.StdEncoding.DecodeString(codeRunData.Code)
	if err != nil {
		return err
	}

	if err = ioutil.WriteFile(constants.WORKING_DIR+"/"+p.fileName, code, 0777); err != nil {
		return err
	}

	return nil
}
