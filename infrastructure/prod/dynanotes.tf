data "aws_route53_zone" "main" {
  name = "${local.domain}."
}

data "aws_acm_certificate" "cert" {
  domain   = local.domain
  statuses = ["ISSUED"]
}

module "dynanotes" {
  source   = "../modules/dynanotes"
  prefix   = local.prefix
  cert_arn = data.aws_acm_certificate.cert.arn
  domain   = "${local.alias}"
  zone_id  = data.aws_route53_zone.main.zone_id
}