package k8s

import (
	"github.com/anuragashok/faster.codes/executor/models"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func getJob(runId string, d models.CodeRunData) *batchv1.Job {

	BackoffLimit := int32(2)

	return &batchv1.Job{
		TypeMeta: metav1.TypeMeta{
			Kind:       "Job",
			APIVersion: "batch/v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:   d.Id,
			Labels: map[string]string{"Id": d.Id},
		},
		Spec: batchv1.JobSpec{
			BackoffLimit: &BackoffLimit,
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					Volumes: []corev1.Volume{
						{
							Name: "data",
							VolumeSource: corev1.VolumeSource{
								PersistentVolumeClaim: &corev1.PersistentVolumeClaimVolumeSource{
									ClaimName: "backend-nfs",
								},
							},
						},
					},
					RestartPolicy: corev1.RestartPolicyNever,
					Containers: []corev1.Container{
						{
							Name:            d.Id,
							Image:           "ghcr.io/anuragashok/faster.codes/executor:latest",
							ImagePullPolicy: corev1.PullAlways,
							Resources: corev1.ResourceRequirements{
								Limits: corev1.ResourceList{
									"cpu":    resource.MustParse("0.2"),
									"memory": resource.MustParse("256Mi"),
								},
								Requests: corev1.ResourceList{
									"cpu":    resource.MustParse("0.1"),
									"memory": resource.MustParse("256Mi"),
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "data",
									MountPath: "/data",
									SubPath:   runId + "/" + d.Id + "/",
								},
							},
							Env: []corev1.EnvVar{
								{
									Name: "WORKER_TOKEN",
									ValueFrom: &corev1.EnvVarSource{
										SecretKeyRef: &corev1.SecretKeySelector{
											LocalObjectReference: corev1.LocalObjectReference{
												Name: "executor-secrets",
											},
											Key: "worker_token",
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
}
