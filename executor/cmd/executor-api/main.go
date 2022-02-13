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
	r.HandleFunc("/health", ok).Methods("GET")
	r.HandleFunc("/live", ok).Methods("GET")
	http.ListenAndServe(":3000", r)
}

func ok(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func launch(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	runData := models.RunData{}
	err := json.Unmarshal(body, &runData)

	if (err != nil){
		panic(err)
	}

	fmt.Println(runData)
	fmt.Println(runData.CodeRuns)

	for _, d := range runData.CodeRuns {
		fmt.Printf("starting job for %s \n", d.Id)
		jsonData, err := json.Marshal(d)
		if (err != nil){
			panic(err)
		}
		err = ioutil.WriteFile(fmt.Sprintf("/data/%s/%s/CodeRunData.json",runData.RunId,d.Id), jsonData, 0777)
		if (err != nil){
			panic(err)
		}
		k8s.StartJob(runData.RunId, d)
	}

	w.WriteHeader(http.StatusOK)
}
