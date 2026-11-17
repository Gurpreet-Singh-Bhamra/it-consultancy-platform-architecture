# B2B IT Consultancy & Lead Generation Engine (Architecture & Specs)

> **Live Platform:** [tfsdigital.co.uk](https://www.tfsdigital.co.uk)  
> **Architected & Engineered by:** Gurpreet Bhamra ([TFS Digital](https://www.tfsdigital.co.uk))  
> **Repository Scope:** Public Architecture & Automation Showcase (Commercial Source Code Private)

---

## Executive Overview

An enterprise consultancy platform engineered for technical lead qualification, interactive project scoping, and automated triage routing. Built with serverless edge validation, deterministic bot mitigation, and sub-2-second alert dispatching.

### Key Performance & Quality Metrics
* **Lead Triage Latency:** Automated Telegram alert push and transactional confirmation in <2s
* **Spam & Bot Mitigation:** Zero-captcha honeypot traps paired with IP sliding-window rate limiting
* **Availability & Core Web Vitals:** 99.99% edge uptime with 100 Accessibility & SEO Lighthouse scores

---

## Tech Stack & Infrastructure

* **Framework:** Next.js (App Router), React, Tailwind CSS, TypeScript
* **Automations & Routing:** Telegram Bot API Webhooks, Resend Transactional Email
* **Quality Assurance & SEO:** Playwright API & E2E validation, Schema.org JSON-LD structured data
* **Deployment:** Vercel Enterprise Edge Network

---

## System Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Prospect
    participant Site as Next.js Frontend
    participant API as Contact API Route
    participant Guard as Rate Limiter & Honeypot
    participant Bot as Telegram Triage Bot

    Prospect->>Site: Submits Consultation Request
    Site->>API: POST /api/contact
    API->>Guard: Validate IP Window & Hidden Fields
    Guard-->>API: Pass (Verified Human Payload)
    API->>Bot: Dispatch Instant Lead Alert Webhook
    API-->>Prospect: 200 OK + Confirmation Receipt
