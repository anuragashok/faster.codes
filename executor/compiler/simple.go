package compiler

import (
	"time"

	"github.com/anuragashok/faster.codes/executor/output"
)

type SimpleCompiler struct {
	command string
}
 
func (c SimpleCompiler) Compile() error {
	output.System("Simple Compiler")
	err := execute(c.command, 5*time.Second)
	return err
}
