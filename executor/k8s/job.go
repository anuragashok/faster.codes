package k8s

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/anuragashok/faster.codes/executor/models"
	batchv1 "k8s.io/api/batch/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"
)

func StartJob(runId string, codeRunData models.CodeRunData) {

	var config *rest.Config
	var err error
	if _, isDev := os.LookupEnv("GITPOD_WORKSPACE_URL"); isDev {
		config, err = clientcmd.BuildConfigFromFlags("", filepath.Join(homedir.HomeDir(), ".kube", "config"))
		
	} else {
		config, err = rest.InClusterConfig()
	}
	if err != nil {
		panic(err.Error())
	}
	

	// // use the current context in kubeconfig
	// config, err := clientcmd.BuildConfigFromFlags("", filepath.Join(homedir.HomeDir(), ".kube", "config"))
	// if err != nil {
	// 	panic(err.Error())
	// }

	// creates the clientset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	jobsClient, err := clientset.BatchV1().Jobs("default").Create(context.Background(), getJob(runId, codeRunData), metav1.CreateOptions{})
	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	fmt.Printf("Created job %q.\n", jobsClient)

	w, _ := clientset.BatchV1().Jobs("default").Watch(context.Background(), metav1.ListOptions{LabelSelector: "Id=" + codeRunData.Id})

	go func(w watch.Interface, id string) {
		for elem := range w.ResultChan() {
			job, ok := elem.Object.(*batchv1.Job)
			if !ok {
				panic("cannot watch job")
			}
			fmt.Println(job)
			fmt.Println(job.ObjectMeta.Name + "-" + fmt.Sprint(job.Status.Succeeded))
		}
		clientset.BatchV1().Jobs("default").Delete(context.Background(),id,metav1.DeleteOptions{})
	}(w,codeRunData.Id)

}
