resource "kubernetes_manifest" "ingress_backend_api_backend_api_ingress" {
  manifest = {
    "apiVersion" = "extensions/v1beta1"
    "kind" = "Ingress"
    "metadata" = {
      "name" = "backend-api-ingress"
      "namespace" = "backend-api"
    }
    "spec" = {
      "rules" = [
        {
          "host" = "test-rails-app.com"
          "http" = {
            "paths" = [
              {
                "backend" = {
                  "serviceName" = "backend-api"
                  "servicePort" = 80
                }
                "path" = "/*"
              },
            ]
          }
        },
      ]
    }
  }
}
