package util

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os/exec"
	"strings"
	"time"
)

func Execute(command string, output io.Writer, timeout time.Duration) error {
	codeRunCtx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	args := strings.Fields(command)

	cmd := exec.CommandContext(codeRunCtx, args[0], args[1:]...)
	cmd.Stdout = output
	cmd.Stderr = output

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
