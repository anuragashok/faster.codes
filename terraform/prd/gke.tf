data "google_client_config" "default" {}

module "gcp-network" {
  source       = "terraform-google-modules/network/google"
  version      = "~> 3.1"
  project_id   = var.project_id
  network_name = var.network

  subnets = [
    {
      subnet_name   = var.subnetwork
      subnet_ip     = "10.0.0.0/17"
      subnet_region = var.region
    },
  ]

  secondary_ranges = {
    (var.subnetwork) = [
      {
        range_name    = var.ip_range_pods_name
        ip_cidr_range = "192.168.0.0/18"
      },
      {
        range_name    = var.ip_range_services_name
        ip_cidr_range = "192.168.64.0/18"
      },
    ]
  }
}

module "gke" {
  source                            = "terraform-google-modules/kubernetes-engine/google//modules/beta-private-cluster"
  project_id                        = var.project_id
  name                              = var.cluster_name
  regional                          = false
  zones                             = ["${var.region}-a"]
  network                           = module.gcp-network.network_name
  subnetwork                        = module.gcp-network.subnets_names[0]
  ip_range_pods                     = var.ip_range_pods_name
  ip_range_services                 = var.ip_range_services_name
  create_service_account            = true
  remove_default_node_pool          = true
  disable_legacy_metadata_endpoints = false


  node_pools = [
    {
      name           = "pool-01"
      min_count      = 1
      max_count      = 2
      auto_upgrade   = true
      disk_size_gb   = 30
      disk_type      = "pd-standard"
      machine_type   = "e2-medium"
      node_locations = "${var.region}-a"
    }
  ]
}

resource "google_compute_disk" "faster_codes_runner_fs" {
  name    = "faster-codes-runner-fs"
  project = var.project_id
  type    = "pd-ssd"
  zone    = "${var.region}-a"
  size    = 10

  lifecycle {
    ignore_changes = [
      labels
    ]
  }
}

module "gke_auth" {
  source = "terraform-google-modules/kubernetes-engine/google//modules/auth"

  project_id   = var.project_id
  location     = module.gke.location
  cluster_name = module.gke.name
}


