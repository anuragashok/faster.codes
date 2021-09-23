terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

variable "PROVIDER_DIGITALOCEAN_TOKEN" {}

provider "digitalocean" {
  token = var.PROVIDER_DIGITALOCEAN_TOKEN
}