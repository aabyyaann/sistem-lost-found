# STRIDE Threat Model

## Konsep Kunci
STRIDE dipakai sebagai kerangka ancaman per komponen/boundary; ancaman bukan bukti kerentanan. OWASP merekomendasikan pemodelan aset, entry point, trust boundary, threat dan mitigasi; kontrol yang baru dirancang dibedakan dari evidence yang telah diuji.[1]

## Detailed Notes

### Boundary dan aset
TB1 client/untrusted network; TB2 application/API; TB3 database/private object/audit services (teknologi TBD); TB4 CI runner dan staging (terpisah dari production). Aset: kredensial/session, role, laporan dan atribut privat, foto, bukti klaim, state/handover, audit, ketersediaan, source/dependency/build dan staging secrets.

### Threat matrix — traceable register
| STRIDE / ID | Boundary & entry point | Asset / skenario | Dampak | Kontrol (status) | Test evidence / gap |
|---|---|---|---|---|---|
| S-01 Spoofing | TB1→TB2 login/session | Credential theft/replay, impersonasi petugas | Moderasi/bukti diakses ilegal | PRD minta password hash Argon2id/bcrypt, rate limit 5 gagal/15m, HttpOnly+Secure cookie, CSRF. JWT vs cookie/session bertentangan di materi; TBD. | Belum ada auth produksi. Uji hash, throttle, fixation, expiry/revocation, cookie flags, CSRF dan role impersonation diperlukan. |
| T-01 Tampering | TB1→TB2 report/claim/admin APIs | Ganti owner/ID/state, IDOR, manipulasi status | Data/fraud/workflow rusak | Server-side ownership, RBAC, prepared statements, transition allow-list. Prototype mencakup kepemilikan/transisi laporan saja. | Uji owner/nonowner setiap endpoint, negative RBAC, concurrency/transaction DB belum ada seluruhnya. |
| R-01 Repudiation | TB2→TB3 mutations | Penyangkalan submit/decision/handover | Sengketa tak terinvestigasi | PRD audit user/action/IP/UA/time; prototype audit volatile, durability/integrity TBD. | Uji kelengkapan event, redaction, actor attribution dan persistence belum ada. |
| I-01 Information disclosure | TB2→TB1 public search/detail | Expose proof, private attributes, personal data | Privasi/keamanan fisik/fraud | PRD private evidence staff-only, public field projection; object retrieval auth dan minimisasi proposed. | Perlu test DTO allowlist, IDOR read, private file retrieval, response/log leak; visibility semantics TBD. |
| D-01 Denial of service | TB1→TB2 login/upload/search | Spam/oversized file/query exhausts resources | Availability/cost | PRD report photo jpg/jpeg/png max 2MB, MIME inspection; login rate limit. Other quotas/WAF/search limits TBD. | Abuse/load tests, MIME spoof, oversized, query-cost thresholds and alert evidence absent. |
| E-01 Elevation of privilege | TB1→TB2 admin/account/audit API | Civitas invokes staff/Super Admin path or promotes own role | Unauthorized moderation/admin access | Server RBAC each endpoint; least privilege provisioning. Prototype route checks limited to implemented moderation. | Full vertical privilege matrix + negative tests account/role/audit APIs needed; no evidence for absent routes. |

### Controls by boundary
- TB1→TB2: HTTPS (deployment TBD), robust session/CSRF, strict server-side validation, output encoding, rate limiting, upload content validation.
- TB2 internal: deny-by-default authorization, ownership check per object, allowlisted state transitions, parameterized persistence, secret-safe errors.
- TB2→TB3: least-privileged service credentials, private object access, encryption/backup/retention decisions, audit sink access restrictions.
- TB4: CI permission minimization, dependency/SAST scans, staging-only DAST, protected secrets and review gates; action pinning and release policy TBD.

### Test evidence plan
Create tests mapped to IDs: S-01 auth suite; T-01 IDOR/tamper/state/concurrency; R-01 event completeness/redaction/durability; I-01 public projection and private retrieval; D-01 throttling/upload abuse/search load; E-01 role matrix. Store test reports/build IDs in CI artifact system only after retention policy decision. Existing prototype tests are not evidence for unimplemented production features.

## Examples
Tampering case: change `report_id` in a claim request to another user's report. Service must check record eligibility and requester permissions against canonical database state; UI hiding alone is not a control.

## Summary
Threat register connects each STRIDE class to trust boundary, asset, impact, control state and test gap. No unresolved security policy is implied; controls marked PRD are requirements, not confirmed deployment.

## References
[1] [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html). Related flows: [DFD](dfd.md), [architecture](architecture.md). PRD v1.0.0 F-01–F-06 and sections 8–9.