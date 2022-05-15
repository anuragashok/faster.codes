package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/anuragashok/faster.codes/executor/env"
	"github.com/anuragashok/faster.codes/executor/k8s"
	"github.com/anuragashok/faster.codes/executor/log"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/anuragashok/faster.codes/executor/store"
	"github.com/anuragashok/faster.codes/executor/workers"
	"github.com/gorilla/mux"
)

var (
	CONTENT_TYPE_JSON = "application/json"
)

func main() {
	syncFn := log.Init()
	defer syncFn()

	log.Info(context.TODO(), "service started")

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
	ctx := r.Context()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Error(ctx, fmt.Errorf("error read request : %v", err))
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	runData := models.RunData{}
	err = json.Unmarshal(body, &runData)
	if err != nil {
		log.Error(ctx, fmt.Errorf("error unmarshalling run data : %v", err))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	ctx = context.WithValue(ctx, log.RUN_ID, runData.RunId)

	log.Info(ctx,log.Dump(runData))

	for _, d := range runData.CodeRuns {
		ctx = context.WithValue(ctx, log.CODE_RUN_ID, d.Id)
		log.Info(ctx, "start job")

		jsonData, err := json.Marshal(d)
		if err != nil {
			log.Error(ctx, fmt.Errorf("error marshalling : %v", err))
			d.Status = models.FAILED
			d.Stage = models.Unknown_Failed
			workers.Save(&d)
			break
		}

		err = storeCodeRunData(runData, d, jsonData)
		if err != nil {
			log.Error(ctx, fmt.Errorf("error saving data to store : %v", err))
			d.Status = models.FAILED
			d.Stage = models.Unknown_Failed
			workers.Save(&d)
			break
		}

		k8s.StartJob(ctx, runData.RunId, d)
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
