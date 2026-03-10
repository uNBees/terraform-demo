terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# KV Namespace for storing links
resource "cloudflare_workers_kv_namespace" "links" {
  account_id = var.cloudflare_account_id
  title      = "terraform-demo-links"
}

# Store some default links in KV
resource "cloudflare_workers_kv" "link_github" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "github"
  value        = jsonencode({
    title = "GitHub"
    url   = "https://github.com/uNBees"
    icon  = "⌥"
  })
}

resource "cloudflare_workers_kv" "link_linkedin" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "linkedin"
  value        = jsonencode({
    title = "LinkedIn"
    url   = "https://linkedin.com/in/armandos/"
    icon  = "in"
  })
}

resource "cloudflare_workers_kv" "link_twitter" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "twitter"
  value        = jsonencode({
    title = "Twitter / X"
    url   = "https://twitter.com/uNBees"
    icon  = "𝕏"
  })
}

resource "cloudflare_workers_kv" "link_medium" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "medium"
  value        = jsonencode({
    title = "Medium"
    url   = "https://unbees.medium.com/"
    icon  = "M"
  })
}

resource "cloudflare_workers_kv" "link_cloudflare" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "cloudflare"
  value        = jsonencode({
    title = "Build on Cloudflare"
    url   = "https://build.siliceoroman.xyz"
    icon  = "☁️"
  })
}

# Worker Script
resource "cloudflare_workers_script" "link_in_bio" {
  account_id         = var.cloudflare_account_id
  name               = "terraform-demo"
  content            = file("worker.js")
  compatibility_date = "2024-09-23"
  module             = true

  kv_namespace_binding {
    name         = "LINKS"
    namespace_id = cloudflare_workers_kv_namespace.links.id
  }
}