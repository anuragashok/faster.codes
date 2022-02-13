package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/anuragashok/faster.codes/executor/k8s"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/gorilla/mux"
)

var (
	WORKER_TOKEN string = os.Getenv("WORKER_TOKEN")
)

func main() {
	fmt.Println("starting executor api")
	r := mux.NewRouter()
	r.HandleFunc("/", launch).Methods("POST")
	r.HandleFunc("/health", ok).Methods("POST")
	r.HandleFunc("/live", ok).Methods("POST")
	http.ListenAndServe(":3000", r)
}

func ok(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func launch(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	runData := models.RunData{}
	json.Unmarshal(body, &runData)

	for _, d := range runData.CodeRuns {
		fmt.Printf("starting job for %s \n", d.Id)
		jsonData, _ := json.Marshal(d)
		ioutil.WriteFile("/data/CodeRunData.json", jsonData, 0777)
		k8s.StartJob(runData.RunId, d)
	}

	w.WriteHeader(http.StatusOK)
}
