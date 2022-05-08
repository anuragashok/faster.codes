resource "kubernetes_deployment" "executor_api" {
  metadata {
    name = "executor-api"
    labels = {
      name = "executor-api"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        name = "executor-api"
      }
    }

    template {
      metadata {
        labels = {
          name = "executor-api"
        }
      }

      spec {
        service_account_name = kubernetes_service_account.api_sa.metadata[0].name
        container {
          image = var.executor-api-tag
          name  = "executor-api"

          resources {
            limits = {
              cpu    = "0.2"
              memory = "256Mi"
            }
            requests = {
              cpu    = "0.05"
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

          port {
            container_port = 3000
            protocol       = "TCP"
          }

          volume_mount {
            mount_path = "/data"
            name       = "backend-nfs"
          }

          env {
            name = "WORKER_TOKEN"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "worker_token"
              }
            }
          }

          env {
            name = "WORKER_TOKEN"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "worker_token"
              }
            }
          }

          env {
            name = "WORKER_TOKEN"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "worker_token"
              }
            }
          }

          env {
            name = "spaces_bucket_name"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "spaces_bucket_name"
              }
            }
          }

          env {
            name = "spaces_access_id"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "spaces_access_id"
              }
            }
          }

          env {
            name = "spaces_secret_key"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.executor_secrets.metadata.0.name
                key  = "spaces_secret_key"
              }
            }
          }

        }

        volume {
          name = "backend-nfs"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.backend_nfs.metadata.0.name
          }
        }

      }
    }
  }
}

resource "kubernetes_service" "executor_api" {
  metadata {
    name = "executor-api"
    labels = {
      name = "executor-api"
    }
  }
  spec {
    selector = {
      name = "executor-api"
    }
    port {
      port        = 80
      target_port = 3000
      protocol    = "TCP"
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_ingress" "executor_api" {
  metadata {
    name = "executor-api"
    labels = {
      name = "executor-api"
    }
  }
  spec {
    backend {
      service_name = "executor-api"
      service_port = 3000
    }
  }
}
