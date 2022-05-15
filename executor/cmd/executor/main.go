package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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
	"github.com/anuragashok/faster.codes/executor/workers"
)

var (
	WORKER_TOKEN string
)

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
	workers.Save(codeRunData)

	compiler := compiler.Get(lang)
	err = compiler.Compile()
	if err != nil {
		output.User(fmt.Sprintf("compilation failed %v", err))
		codeRunData.Stage = models.Compile_Failed
		workers.Save(codeRunData)
		panic(err)
	}
	codeRunData.Stage = models.Compile_Success
	workers.Save(codeRunData)

	//run
	codeRunData.Stage = models.Running
	workers.Save(codeRunData)

	runner := runner.Get(lang)
	stats, err := runner.Run()
	if err != nil {
		output.User(fmt.Sprintf("run failed %v", err))
		codeRunData.Stage = models.Run_Failed
		workers.Save(codeRunData)
		panic(err)
	}
	codeRunData.Stage = models.Run_Success
	workers.Save(codeRunData)

	stats.Cpu.Avg = average(stats.Cpu.Values)
	stats.Mem.Avg = average(stats.Mem.Values)
	stats.Duration.Avg = average(stats.Duration.Values)
	codeRunData.Stats = stats
	codeRunData.Status = "SUCCESS"
	workers.Save(codeRunData)

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

func average(xs []float64) float64 {
	total := 0.0
	for _, v := range xs {
		total += v
	}
	return total / float64(len(xs))
}
