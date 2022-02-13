package runner

import (
	"time"

	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/output"
)

type SimpleRunner struct {  
	command string
}
 
func (c SimpleRunner) Run() (models.RunStats, error) {
	output.System("Simple Runner")
	stats, err := run(c.command, 30*time.Second, 10)
	return stats, err
}
