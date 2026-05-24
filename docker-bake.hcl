variable "CI_REGISTRY_IMAGE" {
}

variable "TAG" {
  default = "latest"
}

# Build-time (Dockerfile ARG / ENV) — same keys as .env.example; override in CI or: bake --set *.args.NEXT_PUBLIC_...
variable "NEXT_PUBLIC_API_URL" {
  default = ""
}

variable "NEXT_PUBLIC_TABLE_CRM_TOKEN" {
  default = ""
}

variable "NEXT_PUBLIC_ORG_ID" {
  default = ""
}

variable "NEXT_PUBLIC_ORDER_WAREHOUSE" {
  default = ""
}

target "default" {
  context    = "."
  dockerfile = "Dockerfile"
  pull       = true
  load       = true
  tags = [
    "${CI_REGISTRY_IMAGE}:${TAG}"
  ]
  cache-from = [
    "type=registry,ref=${CI_REGISTRY_IMAGE}:${TAG}"
  ]
  cache-to = [
    "type=inline"
  ]
  args = {
    NEXT_PUBLIC_API_URL           = NEXT_PUBLIC_API_URL
    NEXT_PUBLIC_TABLE_CRM_TOKEN   = NEXT_PUBLIC_TABLE_CRM_TOKEN
    NEXT_PUBLIC_ORG_ID            = NEXT_PUBLIC_ORG_ID
    NEXT_PUBLIC_ORDER_WAREHOUSE   = NEXT_PUBLIC_ORDER_WAREHOUSE
  }
}

####
