package store

import (
	"bytes"
	"errors"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

type Store struct {
	Bucket, Access_id, Secret_key string
	sess                          *session.Session
}

func (s *Store) StartSession() {
	endpoint := "ams3.digitaloceanspaces.com"
	region := "ams3"
	s.sess = session.Must(session.NewSession(&aws.Config{
		Endpoint:    &endpoint,
		Region:      &region,
		Credentials: credentials.NewStaticCredentials(s.Access_id, s.Secret_key, ""),
	}))
}

func (s *Store) Upload(path string, body []byte, contentType string) error {
	uploader := s3manager.NewUploader(s.sess)
	upParams := &s3manager.UploadInput{
		Bucket:      &s.Bucket,
		Key:         &path,
		Body:        bytes.NewReader(body),
		ContentType: &contentType,
	}
	_, err := uploader.Upload(upParams)
	return err
}

func (s *Store) Download(path string, savePath string) error {
	saveFile, err := os.Create(savePath)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer saveFile.Close()

	downloader := s3manager.NewDownloader(s.sess)
	downloadParams := &s3.GetObjectInput{
		Bucket: &s.Bucket,
		Key:    &path,
	}
	numBytes, err := downloader.Download(saveFile, downloadParams)
	if err != nil {
		return err
	}

	if numBytes < 1 {
		return errors.New("zero bytes written to memory")
	}

	return nil
}
