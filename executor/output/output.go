package output

import (
	"bufio"
	"fmt"
	"os"

	"github.com/anuragashok/faster.codes/executor/constants"
)

var userOutput *bufio.Writer

func Init() error {
	file, err := os.Create(constants.WORKING_DIR + "/user.log")
	if err != nil {
		return err
	}
	userOutput = bufio.NewWriter(file)

	return nil
}
func GetUserWriter() *bufio.Writer {
	return userOutput
}

func User(message string) {
	userOutput.WriteString(message)
}

func System(message string) {
	fmt.Println(message)
}
