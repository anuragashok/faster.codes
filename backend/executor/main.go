package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"time"

	"github.com/anuragashok/faster.codes/backend/executor/compiler"
	"github.com/anuragashok/faster.codes/backend/executor/models"
	"github.com/anuragashok/faster.codes/backend/executor/parser"
	"github.com/shirou/gopsutil/v3/process"
)

func main() {

	//read
	codeRunData := readCodeRunData()
	lang := codeRunData.Lang

	//parse
	parser := parser.Get(lang)
	err := parser.Parse(codeRunData)
	exitHandle(err)

	//compile
	compiler := compiler.Get(lang)
	err = compiler.Compile()
	exitHandle(err)

	var outb, errb bytes.Buffer

	codeRunCtx, cancel := context.WithTimeout(context.Background(), 12*time.Second)
	defer cancel()

	cmd := exec.CommandContext(codeRunCtx, "go", "run", "test.go")
	cmd.Stdout = &outb
	cmd.Stderr = &errb

	err := cmd.Start()
	if err != nil {
		fmt.Println(err)
		return
	}
	// Use a channel to signal completion
	done := make(chan error)
	go func() {
		err := cmd.Wait()
		done <- err
	}()
	p, _ := process.NewProcess(int32(cmd.Process.Pid))

out:
	for {
		select {
		case <-done:
			break out
		default:
			times, err := p.Times()
			if err != nil && err.Error() == "no such process" {
				return
			}
			if err != nil {
				fmt.Printf("ERROR %v", err)
			}

			fmt.Println("out:", outb.String(), "err:", errb.String())
			<-time.After(1000 * time.Millisecond)
			fmt.Println(times)

		}
	}

}

func readCodeRunData() *models.CodeRunData {
	file, _ := ioutil.ReadFile("/data/CodeRunData.json")
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