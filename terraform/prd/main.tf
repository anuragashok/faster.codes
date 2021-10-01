module "nginx-controller" {
  source  = "terraform-iaac/nginx-controller/kubernetes"
  namespace_name = "nginx"
}
