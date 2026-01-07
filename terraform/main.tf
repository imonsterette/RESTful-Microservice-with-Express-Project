terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  # Apply consistent tags to all AWS resources managed by this provider.
  default_tags {
    tags = {
      Project   = "CloudedOracleV2"
      ManagedBy = "Terraform"
    }
  }
}

resource "aws_dynamodb_table" "oracle_visits" {
  name         = "OracleVisits"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # Helps protect data from accidental deletions/overwrites.
  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Project = "CloudedOracleV2"
  }
}