resource "random_password" "session_secret" {
  length           = 16
  special          = true
  override_special = "_"
}