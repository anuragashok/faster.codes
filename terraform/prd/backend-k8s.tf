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
