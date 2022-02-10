package compiler

import (
	"fmt"
	"io"
	"time"

	"github.com/anuragashok/faster.codes/backend/executor/util"
)

type SimpleCompiler struct {
	command string
}

func (c SimpleCompiler) Compile(userOutput io.Writer) error {
	fmt.Println("SimpleCompiler")
	err := util.Execute(c.command, userOutput, 1*time.Second)
	return err
}
