resource "aws_dynamodb_table" "users" {
  name           = "${var.prefix}-users"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    name               = "username"
    hash_key           = "username"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "ALL"
  }
}

resource "aws_dynamodb_table" "notes" {
  name           = "${var.prefix}-notes"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "sessions" {
  name           = "${var.prefix}-sessions"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "expires"
    enabled        = true
  }
}