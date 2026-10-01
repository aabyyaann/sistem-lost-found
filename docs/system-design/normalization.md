# Normalisasi UNF–1NF–2NF–3NF

## Konsep Kunci
Normalisasi mengurangi pengulangan dan anomali insert/update/delete. Skema mengikuti functional dependencies yang diasumsikan dari identitas entitas PRD; candidate keys dan aturan bisnis belum seluruhnya ditentukan.

## Detailed Notes

### Relasi awal UNF
Satu formulir gabungan dapat memuat atribut pelapor, barang, daftar foto, beberapa klaim, bukti, review dan handover. Contoh konseptual:
`ReportBundle(report_id, report_code, report_type, reporter_id, reporter_name, reporter_email, role_name, category_id, category_name, item_name, description, location, incident_at, {photo}, status, {claim_id, claimant_id, claimant_name, proof, claim_status, reviewer_id, handover})`.
Kurung kurawal mewakili repeating group; satu laporan dapat punya banyak foto dan klaim. Jangan menyimpan password mentah; password_hash adalah atribut akun terpisah.

### Functional dependencies (asumsi desain)
- `user_id → name, email, password_hash, role_id`; email unique juga dapat menjadi candidate key jika verifikasi/duplikasi policy menyetujui.
- `role_id → role_name`; `category_id → category_name`.
- `report_id → report_code, type, user_id, category_id, item_name, description, location, incident_date, is_private, status, created_at`.
- `photo_id → report_id, object_key, media_type, size_bytes`.
- `claim_id → report_id, claimant_id, reviewer_id, reason, status, created_at, decided_at`.
- `handover_id → claim_id, officer_id, handover_date, notes`.
- `review_id → report_id, reviewer_id, decision, reason, created_at`.
- `audit_id → user_id, action, ip_address, user_agent, created_at`.
FD di atas menyatakan model logis dan bukan bukti bahwa nilai email unik/role tunggal telah disahkan. Status derived/current-vs-history dan multi-tenant constraints TBD.

### UNF → 1NF
Pastikan field bernilai atomis dan repeating group dipecah menjadi satu row per photo/claim/review/handover. `ReportBundle` menjadi report row + child rows; tidak ada comma-separated list atau array file paths dalam kolom relasional. `description` tetap satu nilai text, bukan repeating group.

### 1NF → 2NF
Dengan surrogate single-column PKs `user_id`, `report_id`, `claim_id` dan child IDs, mỗi non-key attribute bergantung penuh pada key; tidak ada composite-key partial dependency dalam bentuk yang dipilih. Jika implementasi menggunakan key komposit (mis. `(report_id, photo_seq)`), atribut report harus diletakkan pada reports, bukan di photos. Pisahkan role/category lookup karena FD transitif muncul berikutnya.

### 2NF → 3NF
Hilangkan transitive dependencies:
- Report: `report_id → user_id → user_name/email/role`; nama/email/role tidak disalin ke report.
- User: `user_id → role_id → role_name`; role_name berada pada roles.
- Report: `report_id → category_id → category_name`; nama kategori hanya pada categories.
- Claim: `claim_id → claimant_id → claimant_name`; nama claimant tidak diduplikasi pada claim.
Hasil 3NF: roles, users, categories, reports, report_photos, claims, report_reviews, handovers, audit_logs seperti [ERD/kamus data](data-model.md).

### Batas dan asumsi
- Audit snapshot vs referential identity: bila user dihapus/anonymized, apakah log mempertahankan actor reference atau snapshot minimisasi data adalah keputusan privasi/retention.
- Alamat/lokasi free-text bisa berulang tetapi tidak dipisah ke location table tanpa requirement pencarian/standardisasi.
- Foto dan private proof berupa child records/object refs; binary tidak disimpan sebagai repeating list di report.
- 3NF tidak otomatis memenuhi security, performance, retention, concurrency atau audit integrity; perlu constraint dan kontrol aplikasi.

## Examples
Jika satu report punya tiga foto dan dua klaim, tabel gabungan mengulang detail report enam kali. Dalam 3NF, satu row reports, tiga report_photos dan dua claims menghindari update nama pelapor pada banyak row.

## Summary
Transformasi dimulai dari repeating groups (UNF), atomisitas (1NF), key penuh (2NF), lalu penghapusan ketergantungan transitif (3NF). Validasi FD terhadap kebijakan klaim/status dan candidate keys sebelum implementasi.

## References
PRD v1.0.0 bagian 7–8 (skema draft dan atribut sumber); desain entitas lengkap di [data model](data-model.md).