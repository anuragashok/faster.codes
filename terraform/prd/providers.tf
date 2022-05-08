terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "3.1.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.5.0"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.17.0"
    }
  }
}

variable "do_token" {}
variable "spaces_access_id" {}
variable "spaces_secret_key" {}
provider "digitalocean" {
  token             = var.do_token
  spaces_access_id  = var.spaces_access_id
  spaces_secret_key = var.spaces_secret_key
}

variable "PROVIDER_CLOUDFLARE_EMAIL" {}
variable "PROVIDER_CLOUDFLARE_API_KEY" {}
variable "PROVIDER_CLOUDFLARE_ACCOUNT_ID" {}
provider "cloudflare" {
  email      = var.PROVIDER_CLOUDFLARE_EMAIL
  api_key    = var.PROVIDER_CLOUDFLARE_API_KEY
  account_id = var.PROVIDER_CLOUDFLARE_ACCOUNT_ID
}

provider "kubernetes" {
  host  = data.digitalocean_kubernetes_cluster.faster_codes.endpoint
  token = data.digitalocean_kubernetes_cluster.faster_codes.kube_config[0].token
  cluster_ca_certificate = base64decode(
    data.digitalocean_kubernetes_cluster.faster_codes.kube_config[0].cluster_ca_certificate
  )
}


