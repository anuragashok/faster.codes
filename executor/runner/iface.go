package runner

import "github.com/anuragashok/faster.codes/executor/models"

var runners = make(map[string]Runner)

func Init() {
	runners["java"] = SimpleRunner{command: "java Main"}
	runners["go"] = SimpleRunner{command: "./main"}
}

type Runner interface {
	Run() (models.RunStats, error)
}

func Get(lang string) Runner {
	return runners[lang]
}
