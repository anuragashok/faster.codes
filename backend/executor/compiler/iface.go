package compiler

var (
	compilers = make(map[string]Compiler)
)

func Init() {
	compilers["java"] = Java{}
}

type Compiler interface {
	Compile() error
}

func Get(lang string) Compiler {
	return compilers[lang]
}
