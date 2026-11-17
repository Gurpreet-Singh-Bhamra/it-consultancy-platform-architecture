# Lead Intake Security & Automated Triage Workflow

## Multi-Layer Intake Protection

To maintain high conversion rates without third-party CAPTCHA scripts impacting Core Web Vitals, inbound consultation forms are protected by three server-side validation layers:

1. **IP Sliding-Window Rate Limiting:** Restricts submission bursts to 5 requests per 60-second window per client IP (`x-forwarded-for`), returning standard `429 Too Many Requests` headers when exceeded.
2. **Silent Honeypot Traps:** Hidden CSS-offscreen fields (`_hp_website`, `company_fax_number`) capture automated form-filling bots. Trapped requests receive a simulated `200 OK` response so bots do not adapt their payload signatures.
3. **Strict Schema Sanitization:** Incoming payloads undergo strict type validation and MarkdownV2 character escaping before external webhook dispatch.

---

## Triage Routing & Resilience

| Stage | Mechanism | Failure Handling |
| :--- | :--- | :--- |
| **1. Payload Validation** | Next.js Edge Middleware | Rejects malformed JSON (`400`) or rate-limited IPs (`429`) prior to downstream API execution |
| **2. Instant Alerting** | Telegram Bot `sendMessage` API | Escapes reserved characters to prevent formatting rejections; logs delivery status |
| **3. Client Receipt** | Transactional Email Dispatch | Decoupled non-blocking execution ensures fast client UI response |
