resource "kubernetes_manifest" "namespace_haproxy_controller" {
  manifest = {
    "apiVersion" = "v1"
    "kind" = "Namespace"
    "metadata" = {
      "name" = "haproxy-controller"
    }
  }
}

resource "kubernetes_manifest" "serviceaccount_haproxy_controller_haproxy_ingress_service_account" {
  manifest = {
    "apiVersion" = "v1"
    "kind" = "ServiceAccount"
    "metadata" = {
      "name" = "haproxy-ingress-service-account"
      "namespace" = "haproxy-controller"
    }
  }
}

resource "kubernetes_manifest" "clusterrole_haproxy_ingress_cluster_role" {
  manifest = {
    "apiVersion" = "rbac.authorization.k8s.io/v1"
    "kind" = "ClusterRole"
    "metadata" = {
      "name" = "haproxy-ingress-cluster-role"
    }
    "rules" = [
      {
        "apiGroups" = [
          "",
        ]
        "resources" = [
          "configmaps",
          "endpoints",
          "nodes",
          "pods",
          "services",
          "namespaces",
          "events",
          "serviceaccounts",
        ]
        "verbs" = [
          "get",
          "list",
          "watch",
        ]
      },
      {
        "apiGroups" = [
          "extensions",
          "networking.k8s.io",
        ]
        "resources" = [
          "ingresses",
          "ingresses/status",
          "ingressclasses",
        ]
        "verbs" = [
          "get",
          "list",
          "watch",
        ]
      },
      {
        "apiGroups" = [
          "extensions",
          "networking.k8s.io",
        ]
        "resources" = [
          "ingresses/status",
        ]
        "verbs" = [
          "update",
        ]
      },
      {
        "apiGroups" = [
          "",
        ]
        "resources" = [
          "secrets",
        ]
        "verbs" = [
          "get",
          "list",
          "watch",
          "create",
          "patch",
          "update",
        ]
      },
    ]
  }
}

resource "kubernetes_manifest" "clusterrolebinding_haproxy_controller_haproxy_ingress_cluster_role_binding" {
  manifest = {
    "apiVersion" = "rbac.authorization.k8s.io/v1"
    "kind" = "ClusterRoleBinding"
    "metadata" = {
      "name" = "haproxy-ingress-cluster-role-binding"
    }
    "roleRef" = {
      "apiGroup" = "rbac.authorization.k8s.io"
      "kind" = "ClusterRole"
      "name" = "haproxy-ingress-cluster-role"
    }
    "subjects" = [
      {
        "kind" = "ServiceAccount"
        "name" = "haproxy-ingress-service-account"
        "namespace" = "haproxy-controller"
      },
    ]
  }
}

resource "kubernetes_manifest" "configmap_haproxy_controller_haproxy" {
  manifest = {
    "apiVersion" = "v1"
    "data" = null
    "kind" = "ConfigMap"
    "metadata" = {
      "name" = "haproxy"
      "namespace" = "haproxy-controller"
    }
  }
}

resource "kubernetes_manifest" "deployment_haproxy_controller_ingress_default_backend" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind" = "Deployment"
    "metadata" = {
      "labels" = {
        "run" = "ingress-default-backend"
      }
      "name" = "ingress-default-backend"
      "namespace" = "haproxy-controller"
    }
    "spec" = {
      "replicas" = 1
      "selector" = {
        "matchLabels" = {
          "run" = "ingress-default-backend"
        }
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "run" = "ingress-default-backend"
          }
        }
        "spec" = {
          "containers" = [
            {
              "image" = "gcr.io/google_containers/defaultbackend:1.0"
              "name" = "ingress-default-backend"
              "ports" = [
                {
                  "containerPort" = 8080
                },
              ]
            },
          ]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "service_haproxy_controller_ingress_default_backend" {
  manifest = {
    "apiVersion" = "v1"
    "kind" = "Service"
    "metadata" = {
      "labels" = {
        "run" = "ingress-default-backend"
      }
      "name" = "ingress-default-backend"
      "namespace" = "haproxy-controller"
    }
    "spec" = {
      "ports" = [
        {
          "name" = "port-1"
          "port" = 8080
          "protocol" = "TCP"
          "targetPort" = 8080
        },
      ]
      "selector" = {
        "run" = "ingress-default-backend"
      }
    }
  }
}

resource "kubernetes_manifest" "deployment_haproxy_controller_haproxy_ingress" {
  manifest = {
    "apiVersion" = "apps/v1"
    "kind" = "Deployment"
    "metadata" = {
      "labels" = {
        "run" = "haproxy-ingress"
      }
      "name" = "haproxy-ingress"
      "namespace" = "haproxy-controller"
    }
    "spec" = {
      "replicas" = 1
      "selector" = {
        "matchLabels" = {
          "run" = "haproxy-ingress"
        }
      }
      "template" = {
        "metadata" = {
          "labels" = {
            "run" = "haproxy-ingress"
          }
        }
        "spec" = {
          "containers" = [
            {
              "args" = [
                "--configmap=haproxy-controller/haproxy",
                "--default-backend-service=haproxy-controller/ingress-default-backend",
              ]
              "env" = [
                {
                  "name" = "TZ"
                  "value" = "Etc/UTC"
                },
                {
                  "name" = "POD_NAME"
                  "valueFrom" = {
                    "fieldRef" = {
                      "fieldPath" = "metadata.name"
                    }
                  }
                },
                {
                  "name" = "POD_NAMESPACE"
                  "valueFrom" = {
                    "fieldRef" = {
                      "fieldPath" = "metadata.namespace"
                    }
                  }
                },
              ]
              "image" = "haproxytech/kubernetes-ingress"
              "livenessProbe" = {
                "httpGet" = {
                  "path" = "/healthz"
                  "port" = 1042
                }
              }
              "name" = "haproxy-ingress"
              "ports" = [
                {
                  "containerPort" = 80
                  "name" = "http"
                },
                {
                  "containerPort" = 443
                  "name" = "https"
                },
                {
                  "containerPort" = 1024
                  "name" = "stat"
                },
              ]
              "resources" = {
                "requests" = {
                  "cpu" = "500m"
                  "memory" = "50Mi"
                }
              }
              "securityContext" = {
                "capabilities" = {
                  "add" = [
                    "NET_BIND_SERVICE",
                  ]
                  "drop" = [
                    "ALL",
                  ]
                }
                "runAsGroup" = 1000
                "runAsUser" = 1000
              }
            },
          ]
          "initContainers" = [
            {
              "command" = [
                "/bin/sh",
                "-c",
                "sysctl -w net.ipv4.ip_unprivileged_port_start=0",
              ]
              "image" = "busybox:musl"
              "name" = "sysctl"
              "securityContext" = {
                "privileged" = true
              }
            },
          ]
          "serviceAccountName" = "haproxy-ingress-service-account"
        }
      }
    }
  }
}

resource "kubernetes_manifest" "service_haproxy_controller_haproxy_ingress" {
  manifest = {
    "apiVersion" = "v1"
    "kind" = "Service"
    "metadata" = {
      "labels" = {
        "run" = "haproxy-ingress"
      }
      "name" = "haproxy-ingress"
      "namespace" = "haproxy-controller"
    }
    "spec" = {
      "ports" = [
        {
          "name" = "http"
          "port" = 80
          "protocol" = "TCP"
          "targetPort" = 80
        },
        {
          "name" = "https"
          "port" = 443
          "protocol" = "TCP"
          "targetPort" = 443
        },
        {
          "name" = "stat"
          "port" = 1024
          "protocol" = "TCP"
          "targetPort" = 1024
        },
      ]
      "selector" = {
        "run" = "haproxy-ingress"
      }
      "type" = "NodePort"
    }
  }
}
