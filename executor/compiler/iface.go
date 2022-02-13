package compiler

import (
	"context"
	"errors"
	"fmt"
	"os/exec"
	"strings"
	"time"

	"github.com/anuragashok/faster.codes/executor/constants"
	"github.com/anuragashok/faster.codes/executor/output"
)

var compilers = make(map[string]Compiler)

func Init() {
	compilers["java"] = SimpleCompiler{command: "javac Main.java"}
	compilers["go"] = SimpleCompiler{command: "go build main.go"}
}

type Compiler interface {
	Compile() error
}

func Get(lang string) Compiler {
	return compilers[lang]
}

func execute(command string, timeout time.Duration) error {
	codeRunCtx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	args := strings.Fields(command)

	cmd := exec.CommandContext(codeRunCtx, args[0], args[1:]...)
	cmd.Dir = constants.WORKING_DIR
	cmd.Stdout = output.GetUserWriter()
	cmd.Stderr = output.GetUserWriter()

	err := cmd.Start()
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Use a channel to signal completion
	done := make(chan error)
	go func() {
		err := cmd.Wait()
		done <- err
	}()

	err = <-done
	if errors.Is(codeRunCtx.Err(), context.DeadlineExceeded) {
		return fmt.Errorf("code took longer than %s to compile", timeout)
	}
	if err != nil {
		return fmt.Errorf("error compiling %v", err)
	}

	return nil
}
