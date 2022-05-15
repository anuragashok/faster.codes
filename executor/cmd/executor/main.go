package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/anuragashok/faster.codes/executor/compiler"
	"github.com/anuragashok/faster.codes/executor/constants"
	"github.com/anuragashok/faster.codes/executor/env"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/output"
	"github.com/anuragashok/faster.codes/executor/parser"
	"github.com/anuragashok/faster.codes/executor/runner"
	"github.com/anuragashok/faster.codes/executor/store"
)

var (
	WORKER_TOKEN string
)

func init() {
	WORKER_TOKEN = os.Getenv("WORKER_TOKEN")
}

func main() {
	env.ClearSensitiveEnvironmentVars()

	output.Init()
	parser.Init()
	compiler.Init()
	runner.Init()

	//read
	codeRunData := readCodeRunData(env.CODE_RUN_ID)
	lang := codeRunData.Lang

	//parse
	fmt.Println(lang)
	parserInstance := parser.Get(lang)
	err := parserInstance.Parse(codeRunData)
	exitHandle(err)

	//compile
	codeRunData.Stage = models.Compiling
	update(codeRunData)

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
	update(codeRunData)

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

	stats.Cpu.Avg = average(stats.Cpu.Values)
	stats.Mem.Avg = average(stats.Mem.Values)
	stats.Duration.Avg = average(stats.Duration.Values)
	codeRunData.Stats = stats
	codeRunData.Status = "SUCCESS"
	update(codeRunData)

}

func readCodeRunData(codeRunId string) *models.CodeRunData {
	store := &store.Store{
		Bucket:     env.BUCKET,
		Access_id:  env.ACCESS_ID,
		Secret_key: env.SECRET_KEY,
	}
	store.StartSession()
	
	runId := strings.Split(codeRunId, "-")[0]
	key := fmt.Sprintf("runs/%s/%s/data.json", runId, codeRunId)
	store.Download(key, constants.WORKING_DIR+"/data.json")

	data := models.CodeRunData{}
	file, _ := ioutil.ReadFile(constants.WORKING_DIR + "/data.json")
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

func average(xs []float64) float64 {
	total := 0.0
	for _, v := range xs {
		total += v
	}
	return total / float64(len(xs))
}
