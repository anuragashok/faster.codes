resource "kubernetes_deployment" "backend_api" {
  metadata {
    name = "backend-api"
    labels = {
      name = "backend-api"
    }
  }

  spec {
    replicas = 2

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
        service_account_name = kubernetes_service_account.api_sa.metadata[0].name
        container {
          image = var.backend-api-tag
          name  = "backend-api"

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
                name = kubernetes_secret.worker_token.metadata.0.name
                key = "worker_token"
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

resource "kubernetes_service" "backend_api" {
  metadata {
    name = "backend-api"
    labels = {
      name = "backend-api"
    }
  }
  spec {
    selector = {
      name = "backend-api"
    }
    port {
      port        = 80
      target_port = 3000
      protocol    = "TCP"
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_ingress" "backend_api" {
  metadata {
    name = "backend-api"
    labels = {
      name = "backend-api"
    }
  }
  spec {
    backend {
      service_name = "backend-api"
      service_port = 3000
    }
  }
}


resource "kubernetes_deployment" "backend_nfs" {
  metadata {
    name = "backend-nfs"
    labels = {
      name = "backend-nfs"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        name = "backend-nfs"
      }
    }

    template {
      metadata {
        labels = {
          name = "backend-nfs"
        }
      }

      spec {
        container {
          image = "gcr.io/google_containers/volume-nfs:0.8"
          name  = "backend-nfs"

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

          port {
            container_port = 2049
            name           = "nfs"
          }
          port {
            container_port = 20048
            name           = "mountd"
          }
          port {
            container_port = 111
            name           = "rpcbind"
          }

          security_context {
            privileged = true
          }

          volume_mount {
            mount_path = "/exports"
            name       = "backend-fs"
          }

          lifecycle {
            post_start {
              exec {
                command = ["sh", "-c", "chmod -R 777 /exports"]
              }
            }
          }
        }
        volume {
          name = "backend-fs"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.backend_fs.metadata.0.name
          }
        }
      }
    }
  }
}


resource "kubernetes_service" "backend_nfs" {
  metadata {
    name = "backend-nfs"
    labels = {
      name = "backend-nfs"
    }
  }
  spec {
    selector = {
      name = "backend-nfs"
    }
    port {
      port = 2049
      name = "nfs"
    }
    port {
      port = 20048
      name = "mountd"
    }
    port {
      port = 111
      name = "rpcbind"
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_persistent_volume" "backend_nfs" {
  metadata {
    name = "backend-nfs"
  }
  spec {
    capacity = {
      storage = "10Gi"
    }
    access_modes = ["ReadWriteMany"]
    persistent_volume_source {
      nfs {
        server = kubernetes_service.backend_nfs.spec.0.cluster_ip
        path   = "/"
      }
    }
    storage_class_name = "standard"
  }
}

resource "kubernetes_persistent_volume_claim" "backend_nfs" {
  metadata {
    name = "backend-nfs"
  }
  spec {
    access_modes       = ["ReadWriteMany"]
    storage_class_name = "standard"
    resources {
      requests = {
        storage = "10Gi"
      }
    }
    volume_name = kubernetes_persistent_volume.backend_nfs.metadata.0.name
  }
}

resource "kubernetes_persistent_volume_claim" "backend_fs" {
  metadata {
    name = "backend-fs"
  }
  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "do-block-storage"
    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}


resource "kubernetes_service_account" "api_sa" {
  metadata {
    name = "api-sa"
  }
}

resource "kubernetes_cluster_role" "api_role" {
  metadata {
    name = "api-role"
  }

  rule {
    api_groups = ["*"]
    resources  = ["*"]
    verbs      = ["*"]
  }
}

resource "kubernetes_cluster_role_binding" "api_role_binding" {
  metadata {
    name = "api-role-binding"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = kubernetes_cluster_role.api_role.metadata[0].name
  }
  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.api_sa.metadata[0].name
    namespace = "default"
  }
}

resource "kubernetes_secret" "worker_token" {
  metadata {
    name = "worker-token"
  }
  data = {
    worker_token = var.WORKER_TOKEN
  }
}