package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/anuragashok/faster.codes/executor/k8s"
	"github.com/anuragashok/faster.codes/executor/models"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
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
		writeCodeRunDataToNFS(runData, d, jsonData)
		saveCodeRunDataToDataStore(runData,d,jsonData)
		k8s.StartJob(runData.RunId, d)
	}

	w.WriteHeader(http.StatusOK)
}

func writeCodeRunDataToNFS(runData models.RunData, d models.CodeRunData, jsonData []byte) {
	dir := fmt.Sprintf("/data/%s/%s", runData.RunId, d.Id)
	file := "CodeRunData.json"
	os.MkdirAll(dir, os.ModePerm)
	err := ioutil.WriteFile(fmt.Sprintf("%s/%s", dir, file), jsonData, 0777)
	if err != nil {
		panic(err)
	}
}

func saveCodeRunDataToDataStore(runData models.RunData, d models.CodeRunData, jsonData []byte) {
	key := fmt.Sprintf("runs/%s/%s/data.json", runData.RunId, d.Id)
	bucketName := os.Getenv("spaces_bucket_name")

	endpoint := "ams3.digitaloceanspaces.com"
	region := "ams3"
	sess := session.Must(session.NewSession(&aws.Config{
		Endpoint: &endpoint,
		Region:   &region,
		Credentials: credentials.NewSharedCredentials(os.Getenv("spaces_access_id"),os.Getenv("spaces_secret_key")),
	}))
	uploader := s3manager.NewUploader(sess)
	
	upParams := &s3manager.UploadInput{
		Bucket: &bucketName,
		Key:    &key,
		Body:   bytes.NewReader(jsonData),
	}
	uploader.Upload(upParams)
}
