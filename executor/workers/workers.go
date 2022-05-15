package workers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/anuragashok/faster.codes/executor/env"
	"github.com/anuragashok/faster.codes/executor/models"
)

func Save(data *models.CodeRunData) error {
	runId := strings.Split(data.Id, "-")[0]
	fmt.Println(runId)

	// initialize http client
	client := &http.Client{}

	json, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPut, "https://api.faster.codes/"+runId, bytes.NewBuffer(json))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("X-WORKER-TOKEN", env.WORKER_TOKEN)
	_, err = client.Do(req)
	if err != nil {
		return err
	}
	return nil
}