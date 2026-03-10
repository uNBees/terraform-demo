# Terraform Demo — Infrastructure as Code with Cloudflare

Project 10 of the [Build on Cloudflare](https://build.siliceoroman.xyz) series.

A **Link in Bio** app provisioned entirely with Terraform. One command creates a Cloudflare Worker, KV namespace, and populates it with data — no dashboard clicking required.

🌐 **Live site:** [terraform-demo.unbeesc9m3-cloudflare-5b4.workers.dev](https://terraform-demo.unbeesc9m3-cloudflare-5b4.workers.dev)

---

## What is Terraform?

Terraform is an Infrastructure as Code (IaC) tool made by HashiCorp. Instead of clicking around a dashboard to create cloud resources, you write code that describes what you want — and Terraform builds it automatically.

```
terraform init    → download the Cloudflare provider
terraform plan    → preview what will be created (dry run)
terraform apply   → create everything
terraform destroy → tear everything down
```

---

## What This Demo Provisions

| Resource | Name | Description |
|---|---|---|
| KV Namespace | `terraform-demo-links` | Stores the link data |
| KV Entries | 5 links | GitHub, LinkedIn, Twitter, Medium, Cloudflare |
| Worker Script | `terraform-demo` | Reads KV and renders the Link in Bio page |

---

## Project Structure

```
terraform-demo/
├── main.tf           ← Cloudflare resources (Worker, KV, links)
├── variables.tf      ← Variable definitions
├── terraform.tfvars  ← Secret values (NOT committed to git)
├── worker.js         ← Worker code deployed by Terraform
└── .gitignore        ← Excludes secrets and generated files
```

---

## Step-by-Step Setup

### Step 1 — Install Terraform
1. Go to [developer.hashicorp.com/terraform/install](https://developer.hashicorp.com/terraform/install)
2. Download the **Windows AMD64** version
3. Extract the zip — you'll get a single `terraform.exe` file
4. Move `terraform.exe` to a permanent location e.g. `C:\terraform\`
5. Add that folder to your Windows PATH:
   - Search **"Environment Variables"** in Start menu
   - Click **"Edit the system environment variables"**
   - Click **"Environment Variables"**
   - Under **User variables** find **Path** → **Edit** → **New**
   - Paste your folder path e.g. `C:\terraform`
   - Click OK on all windows
6. Open a new terminal and verify:
```bash
terraform --version
```

### Step 2 — Create a Cloudflare API Token
1. Go to [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **"Edit Cloudflare Workers"** template
4. Under Account Resources → select your account
5. Under Zone Resources → select **All zones**
6. Click **Continue to summary** → **Create Token**
7. Copy the token — you only see it once!

Verify it works:
```powershell
$token = "YOUR_TOKEN"
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Headers @{"Authorization" = "Bearer $token"}
```
You should see `success = True`.

### Step 3 — Clone the repo
```bash
git clone https://github.com/uNBees/terraform-demo.git
cd terraform-demo
```

### Step 4 — Create your tfvars file
Create a file called `terraform.tfvars` (this is in `.gitignore` — never commit it!):
```hcl
cloudflare_api_token  = "YOUR_API_TOKEN"
cloudflare_account_id = "YOUR_ACCOUNT_ID"
```

Your Account ID is visible in the Cloudflare dashboard URL or in the right sidebar of any zone page.

### Step 5 — Initialize Terraform
```bash
terraform init
```
This downloads the Cloudflare provider. You should see:
```
Terraform has been successfully initialized!
```

### Step 6 — Preview the plan
```bash
terraform plan
```
This is a dry run — nothing gets created yet. You should see **7 resources to add**.

### Step 7 — Apply the configuration
```bash
terraform apply
```
Type `yes` when prompted. Terraform will create:
- 1 KV namespace
- 5 KV entries
- 1 Worker script

### Step 8 — Enable the workers.dev URL
1. Go to Cloudflare dashboard → **Workers & Pages** → **terraform-demo**
2. Click **Settings** → **Domains & Routes**
3. Click on **workers.dev** and enable it

### Step 9 — Visit your live site
```
https://terraform-demo.YOUR_SUBDOMAIN.workers.dev
```

---

## Customizing Your Links

To change the links, edit the `cloudflare_workers_kv` resources in `main.tf`:

```hcl
resource "cloudflare_workers_kv" "link_github" {
  account_id   = var.cloudflare_account_id
  namespace_id = cloudflare_workers_kv_namespace.links.id
  key          = "github"
  value        = jsonencode({
    title = "GitHub"
    url   = "https://github.com/YOUR_USERNAME"
    icon  = "⌥"
  })
}
```

Then run `terraform apply` to update!

---

## Tearing Down

To delete all resources Terraform created:
```bash
terraform destroy
```
Type `yes` when prompted. Everything will be removed from your Cloudflare account.

---

## Key Concepts

| Concept | Description |
|---|---|
| `terraform init` | Downloads providers defined in `main.tf` |
| `terraform plan` | Shows what WILL happen without doing it |
| `terraform apply` | Creates/updates resources to match config |
| `terraform destroy` | Deletes all resources managed by this config |
| `terraform.tfvars` | Secret values — never commit to git |
| `terraform.tfstate` | Tracks what Terraform has created — never commit to git |
| Provider | Plugin that teaches Terraform how to talk to a specific platform (Cloudflare, AWS, etc.) |
| Resource | A thing Terraform manages (Worker, KV namespace, DNS record, etc.) |

---

## Resources

- [Cloudflare Terraform Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Build on Cloudflare](https://build.siliceoroman.xyz)