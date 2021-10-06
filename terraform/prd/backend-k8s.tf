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
            protocol = "TCP"
          }
          
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_api" {
  metadata {
    namespace = kubernetes_namespace.api.metadata[0].name
    name = "backend-api"
    annotations = {
      "cloud.google.com/neg" = "{\"ingress\": true}"
    }
    labels = {
      name = "backend-api"
    }
  }
  spec {
    selector = {
      name = "backend-api"
    }
    port {
      port        = 3000
      target_port = 3000
      protocol    = "TCP"
    }
    type = "NodePort"
  }
}

resource "kubernetes_ingress" "backend_api" {
  metadata {
    namespace = kubernetes_namespace.api.metadata[0].name
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