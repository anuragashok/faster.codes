resource "digitalocean_kubernetes_cluster" "faster_codes" {
  name    = "faster-codes"
  region  = "ams3"
  version = "1.21.5-do.0"

  node_pool {
    name       = "faster-codes-worker-pool"
    size       = "s-1vcpu-2gb"
    auto_scale = true
    min_nodes  = 2
    max_nodes  = 4
  }
}

data "digitalocean_kubernetes_cluster" "faster_codes" {
  name = digitalocean_kubernetes_cluster.faster_codes.name
}

resource "digitalocean_spaces_bucket" "faster_codes_run_data_store" {
  name   = var.spaces_bucket_name
  region = "ams3"
  acl    = "private"
}
