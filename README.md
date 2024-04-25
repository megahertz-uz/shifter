# Shifter V1-alpha
This actions shift and replace strings in your files by patterns.

# What's new

Please refer to the [release page](https://github.com/megahertz-uz/shifter/releases) for the latest release notes.

# Usage

```yaml
- uses: megahertz-uz/shifter@v1-alpha
  with:
    # Key-Value list of Patterns to replace.
    patterns: ''
    # Destination locations of files
    locations: ''
    # Delimiter between list of key-value pairs.
    # Default: \n (new line)
    delimiter: ''
    # Equal sign. 
    # Default: =
    equal_sign: ''
```

# Scenarios

- [Replace secrets in dotenv](#Replace-secrets-in-dotenv)
- [Replace multiline secrets in tfvars](#Replace-multiline-secrets-in-tfvars)

# Replace secrets in dotenv
*.github/workflows/my_workflow.yml*
```yaml
- uses: megahertz-uz/shifter@v1-alpha
  with:
    patterns: |
      %DB_HOST%=localhost
      %DB_NAME%=sunshine_db
      %DB_PASSWORD%=${{ secrets.DB_PASSWORD }}
      %DB_USER%=${{ secrets.DB_USER }}
    locations: |
      src/.env
```
*src/.env*
```
DB_HOST=%DB_HOST%
DB_NAME=%DB_NAME%
DB_PASSWORD=%DB_PASSWORD%
DB_USER=%DB_USER%
```

# Replace multiline secrets in tfvars
*.github/workflows/my_workflow.yml*
```yaml
- name: Import Secrets
  id: import-secrets
  uses: hashicorp/vault-action@v2
  with:
    url: https://vault
    token: ${{ secrets.VAULT_TOKEN }}
    secrets: |
        storage/data/k8s-1 ca_crt | K8S-1_CA_CRT;
        storage/data/k8s-1 client_crt | K8S-1_CLIENT_CRT;
        storage/data/k8s-1 client_key | K8S-1_CLIENT_KEY;
- uses: megahertz-uz/shifter@v1-alpha
  with:
    patterns: |
      @secret.k8s-1_client_certificate=${{ steps.import-secrets.outputs.K8S-1_CLIENT_CRT }}%end%
      @secret.k8s-1_client_key=${{ steps.import-secrets.outputs.K8S-1_CLIENT_KEY }}%end%
      @secret.k8s-1_cluster_ca_certificate=${{ steps.import-secrets.outputs.K8S-1_CA_CRT }}
    locations: |
      terraform.tfvars
    delimiter: "%end%"
```
*terraform.tfvars*
```t
cluster = {
  k8s-1 = {
    client_certificate     = <<EOT
@secret.k8s-1_client_certificate"
EOT
    client_key             = <<EOT
@secret.k8s-1_client_key"
EOT
    cluster_ca_certificate = <<EOT
@secret.k8s-1_cluster_ca_certificate"
EOT
  }
```