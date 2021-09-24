terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "3.1.0"
    }
    namecheap = {
      source = "Namecheap-Ecosystem/namecheap"
      version = "0.1.7"
    }
  }
}

variable "PROVIDER_DIGITALOCEAN_TOKEN" {}
provider "digitalocean" {
  token = var.PROVIDER_DIGITALOCEAN_TOKEN
}

variable "PROVIDER_CLOUDFLARE_EMAIL" {}
variable "PROVIDER_CLOUDFLARE_API_KEY" {}
provider "cloudflare" {
  email   = var.PROVIDER_CLOUDFLARE_EMAIL
  api_key = var.PROVIDER_CLOUDFLARE_API_KEY
}