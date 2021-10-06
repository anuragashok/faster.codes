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
    google = {
      source  = "hashicorp/google"
      version = "3.86.0",
    }
  }
}

variable "PROVIDER_CLOUDFLARE_EMAIL" {}
variable "PROVIDER_CLOUDFLARE_API_KEY" {}
variable "PROVIDER_CLOUDFLARE_ACCOUNT_ID" {}
provider "cloudflare" {
  email      = var.PROVIDER_CLOUDFLARE_EMAIL
  api_key    = var.PROVIDER_CLOUDFLARE_API_KEY
  account_id = var.PROVIDER_CLOUDFLARE_ACCOUNT_ID
}

provider "google-beta" {
  project = "faster-codes-backend"
  region  = "us-central1"
  zone    = "us-central1-c"
}

provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}

