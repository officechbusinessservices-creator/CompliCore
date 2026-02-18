# Security Guide: Open Deep Research Hardening

This guide summarizes best practices for securing an [Open Deep Research](https://github.com/nickscamara/open-deep-research) deployment and related AI tooling in CompliCore.

## Security Configuration Prompt

Use this prompt with a security-focused agent or tool to generate a tailored hardening plan:

> "Act as a Cybersecurity Expert specializing in AI Agent security. Provide a comprehensive strategy to secure my Open Deep Research instance. Specifically, address the following areas:
> 1. Secret Management: How can I securely manage my OPENAI_API_KEY, FIRECRAWL_API_KEY, and AUTH_SECRET beyond a local .env file to prevent accidental exposure?
> 2. Environment Isolation: Provide steps to deploy this repository using Docker to sandbox the agent and prevent it from accessing sensitive local research plans or host system files.
> 3. Data Privacy Guardrails: Suggest methods to mask personally identifiable information (PII) or confidential project names in my research prompts before they are sent to external LLM providers.
> 4. Self-Hosting for Privacy: Explain the security benefits of self-hosting Firecrawl via Docker and how to configure it so that web data extraction stays within my private network.
> 5. Monitoring & Audit: What baseline logging should I implement for tool calls and API interactions to detect if the agent is exfiltrating data or following malicious instructions?"

## Key Security Actions

### 1) Secret Management
- Store secrets in a dedicated secrets manager (e.g., AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, HashiCorp Vault).
- Use platform-managed environment variables (e.g., Vercel, Render, GitHub Actions secrets) instead of committing `.env` files.
- Rotate keys regularly and use separate keys per environment (dev/staging/prod).
- Limit key scope where possible (least privilege, restricted domains/IPs).

### 2) Environment Isolation
- Run Open Deep Research inside Docker to sandbox dependencies and avoid host filesystem access.
- Use a non-root container user and read-only filesystem when feasible.
- Mount only required volumes (avoid mounting your full home directory).
- Disable Docker socket access inside containers.

### 3) Data Privacy Guardrails
- Redact PII or confidential project names before requests leave your environment.
- Implement a preprocessing layer that masks emails, phone numbers, addresses, and internal codenames.
- Use allowlists/denylists for outbound tool usage and URLs.

### 4) Self-Hosting Firecrawl
- Prefer the self-hosted Firecrawl Docker image when handling sensitive data.
- Restrict outbound network access to trusted domains.
- Keep Firecrawl within the same private network as your AI services.

### 5) Monitoring & Audit
- Log outbound requests, tool invocations, and authentication events.
- Track unusual usage patterns (volume spikes, unknown endpoints).
- Store audit logs securely and review regularly.

## Recommended Next Steps

1. Move all secrets to a managed secret store.
2. Run the agent stack using Docker Compose with least-privilege settings.
3. Add a redaction/masking layer before external LLM calls.
4. Self-host Firecrawl if processing sensitive data.
5. Implement audit logging with alerting thresholds.