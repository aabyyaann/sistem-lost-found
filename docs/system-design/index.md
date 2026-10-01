# Desain Sistem — Lost & Found FTE

Status: rekonstruksi desain berdasarkan PRD Lost & Found FTE v1.0.0 (22 September 2026). Ini dokumen rancangan, bukan bukti sistem produksi. Konflik dan keputusan yang belum disetujui ditandai **TBD/DECISION**; jangan anggap sebagai kebijakan.

## Konsep Kunci
- Aktor: Civitas, Petugas L&F, Super Admin; hak akses dibatasi per peran pada sisi server.
- Siklus laporan: `PENDING_VERIFICATION` → `APPROVED` / `NEEDS_REVISION` / `REJECTED`; pemilik mengirim revisi kembali ke pending; laporan approved dapat `RESOLVED` setelah proses klaim/serah terima yang disetujui.
- Privasi adalah invariant: bukti klaim hanya untuk petugas berwenang; hasil publik memproyeksikan daftar field yang diizinkan.
- Database relasional, object storage privat, identity provider, hosting, dan deployment adalah logical components saja; vendor/topologi TBD.

## Catatan Detail
Dokumen ini menjabarkan use case, alur, logical/deployment view, DFD L0–L2, ERD crow-foot dengan PK/FK/cardinality, kamus data/constraints, normalisasi beserta functional dependencies, STRIDE traceable, dan alur keamanan CI/CD. Semua berasal dari PRD kecuali referensi praktik/dokumentasi resmi yang dicantumkan per halaman.

## Contoh
Alur klaim: Civitas mengajukan klaim atas laporan approved; lampiran bukti privat tidak masuk hasil pencarian publik. Petugas memeriksa bukti. Transisi yang mengubah status hanya dilakukan setelah otorisasi server-side; hasil serah terima mengubah klaim menjadi completed dan laporan menjadi resolved sebagaimana PRD, dengan aturan competing claims tetap TBD.

## Ringkasan
Gunakan halaman dalam urutan SUMMARY.md. Sebelum implementasi, putuskan isu terbuka di [Model data](data-model.md), [Threat model](threat-model.md), dan [Arsitektur](architecture.md). Diagram memakai Mermaid agar bisa dirender oleh GitBook; dukungan Mermaid serta sintaks flowchart/ERD dirujuk pada [GitBook](https://gitbook.com/docs/), [Mermaid flowchart](https://mermaid.js.org/syntax/flowchart.html), dan [Mermaid ERD](https://mermaid.js.org/syntax/entityRelationshipDiagram.html).

## References
- Sumber primer: `/home/ubuntu/.hermes/cache/documents/doc_39c9baa99984_PRD_Lost_and_Found_FTE_DevSecOps.md`, PRD v1.0.0.
- [GitBook documentation](https://gitbook.com/docs/)
- [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html)
- [Mermaid entity relationship diagram syntax](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)
