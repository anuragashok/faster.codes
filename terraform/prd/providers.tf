terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "3.1.0"
    }
    scaleway = {
      source = "scaleway/scaleway"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.5.0"
    }
  }
}

variable "PROVIDER_DIGITALOCEAN_TOKEN" {}
provider "digitalocean" {
  token = var.PROVIDER_DIGITALOCEAN_TOKEN
}

variable "PROVIDER_CLOUDFLARE_EMAIL" {}
variable "PROVIDER_CLOUDFLARE_API_KEY" {}
variable "PROVIDER_CLOUDFLARE_ACCOUNT_ID" {}
provider "cloudflare" {
  email      = var.PROVIDER_CLOUDFLARE_EMAIL
  api_key    = var.PROVIDER_CLOUDFLARE_API_KEY
  account_id = var.PROVIDER_CLOUDFLARE_ACCOUNT_ID
}

#configured using env vars SCW_ACCESS_KEY, SCW_SECRET_KEY, SCW_DEFAULT_PROJECT_ID
provider "scaleway" {}