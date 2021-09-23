terraform {
  backend "remote" {
    organization = "faster_codes"

    workspaces {
      name = "prd"
    }
  }
}