package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/anuragashok/faster.codes/executor/env"
	"github.com/anuragashok/faster.codes/executor/k8s"
	"github.com/anuragashok/faster.codes/executor/log"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/store"
	"github.com/gorilla/mux"
)

var (
	CONTENT_TYPE_JSON = "application/json"
)

func main() {
	fmt.Println("starting executor api ")

	syncFn := log.Init()
	defer syncFn()

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

	if err != nil {
		panic(err)
	}

	fmt.Println(runData)
	fmt.Println(runData.CodeRuns)

	for _, d := range runData.CodeRuns {
		fmt.Printf("starting job for %s \n", d.Id)
		jsonData, err := json.Marshal(d)
		if err != nil {
			panic(err)
		}

		err = storeCodeRunData(runData, d, jsonData)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Printf("error saving data to store %v \n", err)
			return
		}
		k8s.StartJob(runData.RunId, d)
	}

	w.WriteHeader(http.StatusOK)
}

func storeCodeRunData(runData models.RunData, d models.CodeRunData, jsonData []byte) error {
	store := store.Store{
		Bucket:     env.BUCKET,
		Access_id:  env.ACCESS_ID,
		Secret_key: env.SECRET_KEY,
	}
	store.StartSession()

	path := fmt.Sprintf("runs/%s/%s/data.json", runData.RunId, d.Id)
	err := store.Upload(path, jsonData, CONTENT_TYPE_JSON)
	return err
}
