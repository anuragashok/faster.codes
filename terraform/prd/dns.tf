resource "cloudflare_zone" "faster_codes" {
    zone = "faster.codes"
}

resource "cloudflare_record" "faster_codes_web" {
  zone_id = cloudflare_zone.faster_codes.id
  name    = "@"
  value   = "faster-codes.pages.dev"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}


resource "cloudflare_record" "faster_codes_web_www" {
  zone_id = cloudflare_zone.faster_codes.id
  name    = "www"
  value   = "faster-codes.pages.dev"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}