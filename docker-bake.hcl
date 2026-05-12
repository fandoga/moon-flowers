variable "CI_REGISTRY_IMAGE" {
}

variable "TAG" {
  default = "latest"
}

target "default" {
  context = "."
  dockerfile = "Dockerfile"
  pull = true
  load = true
  tags = [
    "${CI_REGISTRY_IMAGE}:${TAG}"
  ]
  cache-from = [
    "type=registry,ref=${CI_REGISTRY_IMAGE}:${TAG}"
  ]
  cache-to = [
    "type=inline"
  ]
}

####
