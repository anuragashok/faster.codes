package k8s

import (
	"context"
	"fmt"

	"github.com/anuragashok/faster.codes/executor/models"
	batchv1 "k8s.io/api/batch/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

func StartJob(runId string, codeRunData models.CodeRunData) {

	config, err := rest.InClusterConfig()
	if err != nil {
		panic(err)
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

	go func(w watch.Interface) {
		for elem := range w.ResultChan() {
			job, ok := elem.Object.(*batchv1.Job)
			if !ok {
				panic("cannot watch job")
			}
			fmt.Println(job)
			fmt.Println(job.ObjectMeta.Name + "-" + fmt.Sprint(job.Status.Succeeded))
		}
	}(w)

}
