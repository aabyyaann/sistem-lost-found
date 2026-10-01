# Data Flow Diagram (DFD) L0, L1, L2

## Konsep Kunci
DFD mendeskripsikan perpindahan data, bukan sequence/timing atau deployment vendor. Diagram Mermaid menggunakan flowchart resmi.[1] Data store bertanda TBD adalah abstraksi logis.

## Detailed Notes

### DFD Level 0 — konteks
```mermaid
flowchart LR
  C[Civitas] -->|akun, laporan, query, klaim, bukti| P((0. Sistem Lost & Found FTE))
  P -->|hasil publik, status, riwayat| C
  O[Petugas L&F] -->|keputusan moderasi, review bukti, konfirmasi handover| P
  P -->|antrean, detail berizin, statistik| O
  S[Super Admin] -->|perubahan akun/kategori, permintaan audit| P
  P -->|hasil perubahan, log berizin| S
```

![dfd diagram 1](assets/dfd-01.svg)

### DFD Level 1 — proses dan data store
```mermaid
flowchart LR
  C[Civitas] -->|kredensial dan request| P1((1.0 Auth/session/RBAC))
  P1 <-->|identity/session refs| D1[(D1 Accounts + roles)]
  P1 -->|hasil auth| C
  C -->|form report dan foto| P2((2.0 Submit/manage report))
  P2 <-->|report metadata/state| D2[(D2 Reports)]
  P2 -->|photo bytes| D6[(D6 Private file store TBD)]
  O[Petugas] -->|review decision| P3((3.0 Moderate report))
  P3 <-->|status/history| D2
  C -->|search criteria| P4((4.0 Search and claim))
  P4 -->|public allowlisted results| C
  P4 -->|approved non-private query| D2
  C -->|claim + private proof| P4
  P4 -->|claim record| D3[(D3 Claims)]
  P4 -->|private proof bytes| D6
  O -->|review and handover| P5((5.0 Review claim / handover))
  P5 <-->|claim and handover records| D3
  P5 -->|report resolution update| D2
  P5 --> D4[(D4 Handovers)]
  P1 --> P6((6.0 Audit event writer))
  P2 --> P6
  P3 --> P6
  P4 --> P6
  P5 --> P6
  P6 -->|minimized, secret-free events| D5[(D5 Restricted audit store TBD)]
```

![dfd diagram 2](assets/dfd-02.svg)

### DFD Level 2 — proses 2.0 pelaporan
```mermaid
flowchart LR
  C[Civitas] -->|form fields| P21((2.1 Validate identity, ownership, fields))
  C -->|image bytes| P22((2.2 Validate file policy))
  P21 -->|validated metadata| P23((2.3 Create pending report))
  P22 -->|accepted image| P23
  P22 -->|rejected reason| C
  P23 -->|report row: PENDING_VERIFICATION| D2[(D2 Reports)]
  P23 -->|file bytes/path reference; private policy TBD| D6[(D6 Private file store TBD)]
  P23 -->|actor/action/time; no secrets| P24((2.4 Record audit event))
  P24 --> D5[(D5 Audit store TBD)]
  P23 -->|receipt/status| C
```

![dfd diagram 3](assets/dfd-03.svg)

### DFD Level 2 — pengajuan, review, dan handover klaim
```mermaid
flowchart LR
  C[Civitas / claimant] -->|claim request + reason| P41((4.1 Validate claimant, report eligibility and request))
  P41 -->|validated claim metadata| P42((4.2 Create pending claim))
  C -->|private evidence bytes| P43((4.3 Validate and store evidence privately))
  P43 -->|opaque private object reference| P42
  P42 -->|claim + opaque proof ref| D3[(D3 Claims)]
  P43 -->|evidence bytes| D6[(D6 Restricted evidence store TBD)]
  P42 -->|claim submitted event, no evidence content| P47((4.7 Append audit event))
  O[Authorized L&F officer] -->|authorized queue request| P44((4.4 Load claim and evidence under access control))
  D3 -->|claim metadata + opaque ref| P44
  P44 -->|authorized object fetch| D6
  D6 -->|private evidence bytes| P44
  P44 -->|review decision + reason| P45((4.5 Record claim decision))
  P45 -->|status/reviewer/decision time| D3
  P45 -->|decision event, no proof payload| P47
  P45 -->|approved claim only; handover procedure TBD| P46((4.6 Record handover when completed))
  P46 -->|handover record| D4[(D4 Handovers)]
  P46 -->|claim/report resolution update, if approved workflow| D3
  P46 -->|handover event| P47
  P47 -->|minimized actor/action/time/reference| D5[(D5 Restricted audit store TBD)]
  P45 -->|claim status| C
  P46 -->|handover confirmation| C
```

![dfd diagram 4](assets/dfd-04.svg)

Privacy boundary: claim reason and evidence are private, excluded from public search/results; only authorized staff workflow accesses evidence. Exact authorization, accepted evidence types, encryption, scanning, storage architecture, access-log granularity, retention/deletion, decision states, appeal, and handover procedure remain TBD—no policy is implied here.

### Data classification / constraints across flows
- Credentials/secrets never enter audit data; F-06 names actor, action, IP, user-agent, timestamp.
- Public search result must be allowlisted and omit private proof and sensitive item attributes; meaning of report `is_private` TBD.
- All externally supplied identifiers/fields/files require validation and record-level authorization.
- D2–D6 are conceptual. Exact schema is documented in [data model](data-model.md).

## Examples
A public search request flows to 4.0 and returns an allowlisted projection, not raw report row. Claim evidence flows to private file store and authorized staff review, never to public search response.

## Summary
DFD L0 identifies parties and exchanges; L1 splits six logical processes/data stores; L2 traces report input through validation, storage and audit. Store technology remains undecided.

## References
[1] [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html). Data requirements: PRD v1.0.0 F-02–F-06.