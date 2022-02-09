package compiler

import (
	"fmt"
)

type Java struct {
}

func (c Java) Compile() error {
	fmt.Println("Compiler::Java")
	
	return nil
}
