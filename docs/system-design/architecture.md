# Konteks Sistem, Logical Architecture, dan Deployment View

## Konsep Kunci
Aktor Civitas, Petugas L&F, dan Super Admin berinteraksi dengan aplikasi web. Database, object storage, identity provider, audit store dan hosting adalah pilihan logis, bukan teknologi/vendor yang telah diputuskan. Garis putus-putus menandakan integrasi bersyarat/TBD.

## Detailed Notes

### System context
```mermaid
flowchart LR
  C[Civitas] <-->|laporan, pencarian, klaim, status| APP[Sistem Lost & Found FTE]
  O[Petugas L&F] <-->|moderasi, review, handover| APP
  SA[Super Admin] <-->|akun, kategori, audit| APP
  APP -. autentikasi/integrasi TBD .-> IDP[Identity provider TBD]
  APP <-->|metadata dan status| DB[(Relational DB TBD)]
  APP <-->|foto dan bukti privat| OBJ[(Private object storage TBD)]
  APP -->|event tanpa secret| AUD[(Audit store TBD)]
```

![architecture diagram 1](assets/architecture-01.svg)

### Logical architecture
```mermaid
flowchart TB
  B[Browser / client tidak dipercaya] -->|HTTPS; terminasi TLS TBD| EDGE[Web/API entry point]
  EDGE --> AUTH[Auth/session, CSRF, RBAC]
  EDGE --> REPORT[Report + moderation service]
  EDGE --> SEARCH[Search + public projection]
  EDGE --> CLAIM[Claim + handover service]
  AUTH --> DB[(Relational data store TBD)]
  REPORT --> DB
  SEARCH --> DB
  CLAIM --> DB
  REPORT --> OBJ[(Private file store TBD)]
  CLAIM --> OBJ
  AUTH --> LOG[Audit event writer]
  REPORT --> LOG
  CLAIM --> LOG
  LOG --> AUD[(Restricted audit sink TBD)]
```

![architecture diagram 2](assets/architecture-02.svg)

### Deployment view — logical only, not approved topology
```mermaid
flowchart LR
  USER[Browser/device] -->|TLS endpoint location TBD| INGRESS[Ingress/reverse proxy TBD]
  INGRESS --> APP[Application runtime/container TBD]
  APP --> DB[(DB service/location TBD)]
  APP --> STORE[(Object storage/location TBD)]
  APP --> AUD[(Audit destination TBD)]
  subgraph ENV[Environment separation required; exact accounts/networks TBD]
    CI[CI runner / GitHub Actions proposed] --> STG[Staging target TBD]
  end
  STG -. production promotion is not specified .-> PROD[Production TBD; no deployment design approved]
```

![architecture diagram 3](assets/architecture-03.svg)

### Trust boundaries
1. Device/network → app: request, cookie, header, input, file dianggap tidak tepercaya; validasi, TLS, CSRF/session dan authorization server-side.
2. App → data services: least privilege, parameterized query, private object access; secret transport/rotation TBD.
3. Public search → browser: hanya allowlist field non-private; jangan expose proof/private attributes atau direct object path.
4. CI/staging → environment: credentials dan data terpisah dari production; DAST PRD hanya terhadap staging.

### Decision register
| ID | Belum disetujui | Dampak/owner keputusan |
| --- | --- | --- |
|  D-01  | SSO/identity eligibility, email verification, password vs institutional identity | Account lifecycle/security; owner FTE/IT |
|  D-02  | Cookie session vs JWT (PRD login-cookie dan draft pipeline/STRIDE pernah menyebut JWT) | Auth, CSRF, revocation; security/IT |
|  D-03  | Framework, DB, hosting, TLS termination, network zones, object/audit stores | Deployment, backup, availability; IT |
|  D-04  | Visibility per field vs sembunyikan satu laporan penuh saat `is_private` | Privacy/public search; product/privacy owner |
|  D-05  | Evidence/photo limits, malware scan, encryption, retention/deletion | Data governance/security; owner belum ditetapkan |
|  D-06  | State machine, competing claims, transaction/handover proof | Operasional; FTE |
|  D-07  | RPO/RTO, monitoring, on-call, recovery, capacity | Operations/IT |

## Examples
Aplikasi dapat meminta object storage privat secara logis, tetapi desain tidak menetapkan S3/MinIO atau URL publik. Sistem harus mengotorisasi setiap retrieval; signed URL/presigned approach juga belum dipilih.

## Summary
Logical architecture menguraikan komponen dan aliran tanpa mengarang platform. Deployment topology sengaja TBD sampai keputusan D-01–D-07 disetujui.

## References
PRD v1.0.0 bagian 1–10. Format diagram merujuk [Mermaid flowchart](https://mermaid.js.org/syntax/flowchart.html) dan dukungan dokumentasi [GitBook](https://gitbook.com/docs/).
