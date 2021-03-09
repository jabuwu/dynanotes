terraform {
  backend "s3" {
    bucket  = "jaburu-state-prod"
    key     = "terraform/dynanotes.tfstate"
    profile = "jabu"
    region  = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "jabu"
}

locals {
  prefix = "notes-jalb-me"
  domain = "jalb.me"
  alias  = "notes.jalb.me"
}