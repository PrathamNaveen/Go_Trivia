terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = ">= 1.0.0"
    }
  }
}

provider "render" {
  api_key                     = var.render_api_key
  owner_id                    = var.owner_id
  wait_for_deploy_completion  = true
}

resource "render_web_service" "backend" {
  name   = "Go_Trivia"
  plan   = "free"
  region = "frankfurt"

  runtime_source = {
    docker = {
      dockerfile_path = "backend/Dockerfile"
      repo_url        = "https://github.com/PrathamNaveen/Go_Trivia"
      branch          = "master"
      auto_deploy     = true
    }
  }
}



