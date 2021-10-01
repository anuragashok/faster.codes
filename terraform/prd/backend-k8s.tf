resource "scaleway_k8s_cluster" "faster_codes_be" {
  name        = "faster-codes-be"
  description = "faster-codes-be"
  version     = "1.22.2"
  cni         = "cilium"
}

resource "scaleway_k8s_pool" "faster_codes_be_pool" {
  cluster_id  = scaleway_k8s_cluster.faster_codes_be.id
  name        = "faster-codes-be-pool"
  node_type   = "DEV1-M"
  size        = 1
  autoscaling = true
  autohealing = true
  min_size    = 1
  max_size    = 2
}

resource "null_resource" "kubeconfig" {
  depends_on = [scaleway_k8s_pool.faster_codes_be_pool]
  triggers = {
    host                   = scaleway_k8s_cluster.faster_codes_be.kubeconfig[0].host
    token                  = scaleway_k8s_cluster.faster_codes_be.kubeconfig[0].token
    cluster_ca_certificate = scaleway_k8s_cluster.faster_codes_be.kubeconfig[0].cluster_ca_certificate
  }
}

provider "kubernetes" {
  host  = null_resource.kubeconfig.triggers.host
  token = null_resource.kubeconfig.triggers.token
  cluster_ca_certificate = base64decode(
    null_resource.kubeconfig.triggers.cluster_ca_certificate
  )
  experiments {
    manifest_resource = true
  }
}

resource "kubernetes_namespace" "api" {
  metadata {
    name = "api"
  }
}

resource "kubernetes_namespace" "runner" {
  metadata {
    name = "runner"
  }
}

resource "kubernetes_deployment" "backend_api" {
  metadata {
    namespace = kubernetes_namespace.api.metadata[0].name
    name      = "backend-api"
    labels = {
      name = "backend-api"
    }
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        name = "backend-api"
      }
    }

    template {
      metadata {
        labels = {
          name = "backend-api"
        }
      }

      spec {
        container {
          image = var.backend-api-tag
          name  = "backend-api"

          resources {
            limits = {
              cpu    = "0.5"
              memory = "256Mi"
            }
            requests = {
              cpu    = "0.1"
              memory = "50Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }

            initial_delay_seconds = 10
            period_seconds        = 10
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3000
            }

            initial_delay_seconds = 10
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_api" {
  metadata {
    namespace = kubernetes_namespace.api.metadata[0].name
    name      = "backend-api"
  }
  spec {
    selector = {
      name = "backend-api"
    }
    port {
      port        = 80
      target_port = 3000
    }
  }
}

resource "kubernetes_manifest" "ingress_backend_api" {
  manifest = {
    "apiVersion" = "networking.k8s.io/v1"
    "kind"       = "Ingress"
    "metadata" = {
      "name"      = "backend-api"
      "namespace" = kubernetes_namespace.api.metadata[0].name
      "annotations" = {
        "kubernetes.io/ingress.class": "haproxy"
      }
    }
    "spec" = {
      "rules" = [
        {
          "http" = {
            "paths" = [
              {
                "backend" = {
                  "service" = {
                    "name" = "backend-api"
                    "port" = {
                      "number" = 80
                    }
                  }
                }
                "path" = "/"
                "pathType": "Prefix"
              },
            ]
          }
        },
      ]
    }
  }
}