# Alur Utama Sistem

## Konsep Kunci
Alur menggabungkan pelaporan, verifikasi, pencarian, klaim, dan serah terima sebagaimana fitur PRD. Diagram flowchart menggunakan sintaks Mermaid resmi.[1]

## Detailed Notes

```mermaid
flowchart TD
  A([Mulai]) --> B{Sesi valid?}
  B -- Tidak --> C[Autentikasi]
  C --> D{Kredensial valid dan limit terpenuhi?}
  D -- Tidak --> C
  D -- Ya --> E[Dashboard sesuai role]
  B -- Ya --> E
  E --> F{Pilih proses}
  F -- Buat laporan --> G[Isi form dan unggah foto]
  G --> H[Validasi otorisasi, field, ukuran, MIME, konten]
  H -- Gagal --> G
  H -- Lolos --> I[Simpan laporan PENDING_VERIFICATION dan audit event]
  I --> J[Petugas moderasi]
  J --> K{Keputusan}
  K -- Need revision --> L[Kembalikan ke pemilik]
  L --> M[Revisi oleh pemilik]
  M --> I
  K -- Reject --> N[Catat penolakan dan status]
  K -- Approve --> O[Publikasi proyeksi field yang diizinkan]
  F -- Cari --> P[Query terparameterisasi]
  O --> P
  P --> Q[Tampilkan field publik yang diizinkan]
  Q --> R[Ajukan klaim]
  R --> S[Validasi akses dan bukti privat]
  S --> T[Simpan claim PENDING dan audit event]
  T --> U[Petugas meninjau bukti privat]
  U --> V{Klaim diterima?}
  V -- Tidak --> W[Tolak/catat keputusan]
  V -- Ya --> X[Serah terima fisik dan konfirmasi petugas]
  X --> Y[Klaim COMPLETED; laporan RESOLVED]
  N --> Z([Selesai])
  W --> Z
  Y --> Z
```

![flows diagram 1](assets/flows-01.svg)

### Aturan/alur status yang dipastikan
- PRD menyatakan status laporan awal Pending Verification; keputusan petugas: Approve, Need Revision, Reject.
- Local prototype handbook menetapkan transisi allow-list: pending → approved/needs_revision/rejected; owner-only resubmit needs_revision → pending; approved → resolved. Diagram sengaja memakai state konsisten ini.
- PRD menyebut claim Completed dan report Resolved setelah konfirmasi serah terima. Detail transisi claim lain, competing claims, cancellation/reopen, dan atomicity adalah **TBD**.
- Tidak ada notifikasi provider, jadwal, atau email yang dijanjikan di sini; PRD menyebut notifikasi status secara konteks tetapi kanal/implementasi belum diputuskan.

## Examples
Input foto berformat tidak diizinkan atau melebihi 2 MB ditolak sebelum penyimpanan. Laporan yang di-Need Revision hanya dapat dikirim ulang oleh pemilik aslinya; setiap aksi status diverifikasi backend.

## Summary
Flow ini adalah target proses logis, bukan implementasi lengkap. Pastikan uji transisi, otorisasi, sanitasi, privasi dan pencatatan event sebelum produksi.

## References
[1] [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html). Sumber aturan status: PRD v1.0.0 bagian 3–6 dan handbook prototype `AGENTS.md`.