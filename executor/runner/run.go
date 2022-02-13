package runner

import (
	"context"
	"errors"
	"fmt"
	"math"
	"os/exec"
	"strings"
	"time"

	"github.com/anuragashok/faster.codes/executor/constants"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/output"
	"github.com/shirou/gopsutil/v3/process"
)

func run(command string, timeout time.Duration, repeat int) (models.RunStats, error) {
	stats := models.RunStats{Cpu: models.RunValues{}, Mem: models.RunValues{}, Duration: models.RunValues{}}
	for i := 1; i <= repeat; i++ {
		output.User(fmt.Sprintf("> starting iteration #%d", i))
		err := runOnce(command, timeout, &stats)
		if err != nil {
			return models.RunStats{}, err
		}
	}
	return stats, nil
}

func runOnce(command string, timeout time.Duration, stats *models.RunStats) error {

	codeRunCtx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	args := strings.Fields(command)

	cmd := exec.CommandContext(codeRunCtx, args[0], args[1:]...)
	cmd.Dir = constants.WORKING_DIR
	cmd.Stdout = output.GetUserWriter()
	cmd.Stderr = output.GetUserWriter()

	start := time.Now()
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
	p, _ := process.NewProcess(int32(cmd.Process.Pid))

	cpu_Max := 0.0
	mem_Max := 0.0
out:
	for {
		select {
		case err := <-done:

			if errors.Is(codeRunCtx.Err(), context.DeadlineExceeded) {
				return fmt.Errorf("code run exceeded the timeline of %s", timeout)
			}
			if err != nil {
				return err
			}

			elapsed := time.Since(start)
			stats.Duration.Values = append(stats.Duration.Values, float64(elapsed.Milliseconds()))
			break out
		default:
			<-time.After(1 * time.Millisecond)

			times, err1 := p.Times()
			if err1 != nil {
				continue
			}

			memInfo, err2 := p.MemoryInfo()
			if err2 != nil {
				continue
			}

			cpu := times.User + times.System
			mem := float64(memInfo.RSS) / math.Pow(2, 10)

			if cpu > float64(cpu_Max) {
				cpu_Max = cpu
			}
			if mem > float64(mem_Max) {
				mem_Max = mem
			}
		}
	}

	stats.Cpu.Values = append(stats.Cpu.Values, cpu_Max)
	stats.Mem.Values = append(stats.Mem.Values, mem_Max)
	return nil
}
