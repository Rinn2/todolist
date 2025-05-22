# Aplikasi TodoList

Aplikasi TodoList modern berbasis web untuk membantu mengelola tugas harian dengan lebih terorganisir. Dibangun menggunakan **React**, **TypeScript**, **Tailwind CSS**, dan **Vite**, serta mendukung pengaturan lanjutan seperti kategori, prioritas, dan darkmode.

##  Fitur 

-  **Tambah Tugas**: Tambahkan tugas baru dengan nama, prioritas (tinggi, sedang, rendah), dan kategori.
-  **Kategori Tugas**: Atur tugas berdasarkan kategori seperti “Pekerjaan”, “Pribadi”, dll.
-  **Buat Kategori Baru**: Tambahkan kategori kustom sesuai kebutuhan pengguna.
-  **DarkMode/LightMiode**: Ubah tampilan aplikasi sesuai preferensi pengguna (dark mode).
-  **Statistik**: Lihat statistik jumlah tugas yang selesai dan belum diselesaikan.
-  **Reset Data**: Hapus semua data tugas dan kategori untuk memulai dari awal.
- **Navigasi Tab**: Navigasi antar halaman dengan menu seperti `Tasks`, `Categories`, `Statistics`, dan `Settings`.

##  Tampilan Antarmuka

Navigasi aplikasi:
- `Tasks`: Daftar tugas dengan filter dan opsi penambahan tugas
- `Categories`: Daftar kategori dan tombol untuk menambah kategori baru
- `Statistics`: Visualisasi jumlah tugas berdasarkan status/kategori
- `Settings`: Pengaturan seperti dark mode dan reset data

---

##  Instalasi

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan proyek ini di lingkungan lokal:

1. **Clone Repositori**
    ```bash
    https://github.com/Rinn2/todolist.git
    cd ToDoList-App
    ```

2. **Install Dependensi**
    ```bash
    npm install
    ```



3. **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```

4. **Akses Aplikasi**

    Buka browser dan kunjungi:

    ```
    http://localhost:8080/
    ```

---

##  Penyimpanan Data 


###  Fungsi Utama

- **`loadStore()`**  
  Memuat data dari `localStorage`. Jika data tidak ditemukan, fungsi ini akan mengembalikan data default.

- **`saveStore()`**  
  Menyimpan data terbaru (tugas dan kategori) ke dalam `localStorage` setiap kali terjadi perubahan.

- **`reset()`**  
  Menghapus seluruh data dari `localStorage` dan mengembalikan aplikasi ke kondisi awal.

---

### Alur Manajemen Data

1. **Load Data saat Aplikasi Dibuka**  
   Ketika aplikasi pertama kali dibuka, `loadStore()` dijalankan untuk mengambil data terakhir dari `localStorage`.

2. **Manajemen State oleh Context API**  
   Semua data tugas dan kategori dikelola melalui Context API yang berada di file `taskContext.tsx`.  
   Saat pengguna menambah, mengedit, atau menghapus tugas/kategori, data diperbarui melalui context.

3. **Penyimpanan Otomatis**  
   Setelah data berubah, `saveStore()` akan dipanggil secara otomatis untuk menyimpan perubahan ke `localStorage`.

4. **Reset Data**  
   Pengguna dapat menghapus seluruh data melalui menu **Settings**. Tindakan ini akan memanggil `reset()` untuk mengembalikan aplikasi ke kondisi default.
---
## Demo Aplikasi
 
    todolist-wine-xi.vercel.app/
---
##  Struktur Folder

```bash
ToDoList-App/
├── public/                  # File statis
├── src/                     # Seluruh source code utama
│   ├── components/          # Komponen UI (seperti TaskCard, Header, dll)
│   ├── pages/               # Halaman utama seperti Tasks, Categories, Statistics, Settings
│   ├── styles/              # Styling khusus jika diperlukan
│   └── main.tsx             # Entry point aplikasi
├── index.html               # Template HTML utama
├── tailwind.config.ts       # Konfigurasi Tailwind
├── vite.config.ts           # Konfigurasi Vite
├── tsconfig.json            # Konfigurasi TypeScript
├── package.json             # Info proyek dan dependensi
└── README.md                # Dokumentasi proyek




