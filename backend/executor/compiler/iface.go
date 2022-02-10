package compiler

import (
	"io"
)

var (
	compilers = make(map[string]Compiler)
)

func Init() {
	compilers["java"] = SimpleCompiler{command: "javac -v"}
	compilers["go"] = SimpleCompiler{command: "go build main.go"}
}

type Compiler interface {
	Compile(userOutput io.Writer) error
}

func Get(lang string) Compiler {
	return compilers[lang]
}
