package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/anuragashok/faster.codes/backend/executor/compiler"
	"github.com/anuragashok/faster.codes/backend/executor/constants"
	"github.com/anuragashok/faster.codes/backend/executor/models"
	"github.com/anuragashok/faster.codes/backend/executor/output"
	"github.com/anuragashok/faster.codes/backend/executor/parser"
	"github.com/anuragashok/faster.codes/backend/executor/runner"
)

var (
	WORKER_TOKEN string = os.Getenv("WORKER_TOKEN")
)

func main() {
	// clear sensiive token
	os.Unsetenv("WORKER_TOKEN")

	output.Init()
	parser.Init()
	compiler.Init()
	runner.Init()

	//read
	codeRunData := readCodeRunData()
	lang := codeRunData.Lang

	//parse
	fmt.Println(lang)
	parserInstance := parser.Get(lang)
	err := parserInstance.Parse(codeRunData)
	exitHandle(err)

	//compile
	codeRunData.Stage = models.Compiling
	compiler := compiler.Get(lang)
	err = compiler.Compile()
	if err != nil {
		output.User(fmt.Sprintf("compilation failed %v", err))
		codeRunData.Stage = models.Compile_Failed
		update(codeRunData)
		panic(err)
	}
	codeRunData.Stage = models.Compile_Success
	update(codeRunData)

	//run
	codeRunData.Stage = models.Running
	runner := runner.Get(lang)
	stats, err := runner.Run()
	if err != nil {
		output.User(fmt.Sprintf("run failed %v", err))
		codeRunData.Stage = models.Run_Failed
		update(codeRunData)
		panic(err)
	}
	codeRunData.Stage = models.Run_Success
	update(codeRunData)

	codeRunData.Stats = stats
	codeRunData.Status = "SUCCESS"
	update(codeRunData)

}

func readCodeRunData() *models.CodeRunData {
	file, _ := ioutil.ReadFile(constants.WORKING_DIR + "/CodeRunData.json")
	data := models.CodeRunData{}
	_ = json.Unmarshal([]byte(file), &data)
	return &data
}

func exitHandle(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func update(data *models.CodeRunData) error {
	runId := strings.Split(data.Id, "-")[0]
	fmt.Println(runId)

	// initialize http client
	client := &http.Client{}

	json, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPut, "https://api.faster.codes/"+runId, bytes.NewBuffer(json))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("X-WORKER-TOKEN", WORKER_TOKEN)
	_, err = client.Do(req)
	if err != nil {
		return err
	}
	return nil
}
