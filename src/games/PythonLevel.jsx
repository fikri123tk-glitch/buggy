import { useState } from "react";

// ── Simple Python simulator ──────────────────────────────
function runPython(code) {
  const lines = code.split("\n");
  const output = [];
  let error = null;
  const vars = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;

    try {
      // print()
      const printMatch = line.match(/^print\((.+)\)$/);
      if (printMatch) {
        let val = printMatch[1].trim();
        const parts = val.split(/\s*\+\s*/);
        const resolved = parts.map(p => {
          p = p.trim();
          if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
            return p.slice(1, -1);
          }
          if (!isNaN(p)) return p;
          if (vars[p] !== undefined) return String(vars[p]);
          throw new Error(`name '${p}' is not defined`);
        });
        output.push(resolved.join(""));
        continue;
      }

      // variable assignment
      const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        let raw = assignMatch[2].trim();

        if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
          vars[varName] = raw.slice(1, -1);
        } else {
          const expr = raw.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, m => {
            if (vars[m] !== undefined) return vars[m];
            throw new Error(`name '${m}' is not defined`);
          });
          // eslint-disable-next-line no-new-func
          vars[varName] = Function('"use strict"; return (' + expr + ')')();
        }
        continue;
      }

      // if statement (basic support)
      const ifMatch = line.match(/^if\s+(.+):$/);
      if (ifMatch) {
        continue; // Skip for now - basic simulator
      }

      throw new Error(`SyntaxError: invalid syntax → ${line}`);

    } catch (e) {
      error = e.message;
      break;
    }
  }

  return { output: output.join("\n"), error };
}

// ── Level data (ALL CHAPTERS) ───────────────────────────
export const PYTHON_LEVELS = {
  // ── INTRO ─────────────────────────────────────────────
  intro: [
    {
      id: 1, type: "run",
      title: "Hello Python!",
      material: "Python adalah bahasa pemrograman yang mudah dipelajari. Perintah `print()` digunakan untuk menampilkan teks ke layar.",
      instruction: "Kode sudah siap! Klik tombol ▶ Run untuk menjalankannya dan lihat hasilnya.",
      starterCode: 'print("Hello, Python!")',
      expectedOutput: "Hello, Python!",
      explanation: "print() adalah perintah untuk menampilkan teks. Teks harus diapit tanda kutip (\" atau ').",
    },
    {
      id: 2, type: "fill",
      title: "Print Teks",
      material: "Kamu bisa print teks apapun dengan `print(\"teks kamu\")`. Ganti teks di dalam tanda kutip sesuai keinginan.",
      instruction: 'Lengkapi kode berikut agar mencetak kata "Halo Dunia!"',
      starterCode: 'print(___)',
      blanks: ['"Halo Dunia!"'],
      expectedOutput: "Halo Dunia!",
      explanation: 'Isi ___ dengan "Halo Dunia!" — jangan lupa tanda kutipnya!',
    },
    {
      id: 3, type: "write",
      title: "Print Angka",
      material: "print() juga bisa menampilkan angka. Tidak perlu tanda kutip untuk angka: `print(42)`",
      instruction: "Tulis kode untuk mencetak angka 2024.",
      expectedOutput: "2024",
      explanation: "print(2024) — angka tidak perlu tanda kutip!",
    },
    {
      id: 4, type: "mcq",
      title: "Komentar",
      material: "Komentar adalah teks yang tidak dijalankan Python. Gunakan tanda `#` untuk membuat komentar.",
      instruction: "Apa output dari kode berikut?\n\n# ini komentar\nprint(\"Logify\")\n# print(\"diabaikan\")",
      options: ["Logify", "ini komentar", "Logify\\ndiabaikan", "Error"],
      correct: 0,
      explanation: "Baris yang diawali # adalah komentar dan diabaikan Python. Hanya print(\"Logify\") yang dijalankan.",
    },
  ],

  // ── VARIABLES ──────────────────────────────────────────
  variables: [
    {
      id: 1, type: "write",
      title: "Buat Variabel",
      material: "Variabel adalah kotak penyimpan data. Cara membuat: `nama = nilai`",
      instruction: 'Buat variabel bernama "nama" dengan nilai "Budi", lalu print variabel tersebut.',
      expectedOutput: "Budi",
      explanation: 'nama = "Budi"\\nprint(nama)',
    },
    {
      id: 2, type: "mcq",
      title: "Tipe Data",
      material: "Python punya beberapa tipe data: String (teks), Integer (angka bulat), Float (angka desimal).",
      instruction: "Manakah yang merupakan tipe data STRING?",
      options: ['nama = "Andi"', "umur = 17", "tinggi = 165.5", "aktif = True"],
      correct: 0,
      explanation: 'String selalu diapit tanda kutip. nama = "Andi" adalah string karena "Andi" ada di dalam tanda kutip.',
    },
    {
      id: 3, type: "fill",
      title: "String & Angka",
      material: "String dan angka adalah dua tipe berbeda. String: `nama = \"Andi\"`. Angka: `umur = 17`",
      instruction: "Lengkapi kode berikut untuk menyimpan nama dan umur:",
      starterCode: 'nama = ___\\numur = ___\\nprint(nama)\\nprint(umur)',
      blanks: ['"Siti"', "15"],
      expectedOutput: "Siti\\n15",
      explanation: 'nama = "Siti" (pakai kutip karena teks)\\numur = 15 (tanpa kutip karena angka)',
    },
    {
      id: 4, type: "write",
      title: "Operasi Hitung",
      material: "Variabel angka bisa dihitung: + tambah, - kurang, * kali, / bagi",
      instruction: "Buat variabel a = 10 dan b = 3, lalu print hasil penjumlahannya.",
      expectedOutput: "13",
      explanation: "a = 10\\nb = 3\\nprint(a + b)",
    },
    {
      id: 5, type: "fix",
      title: "Update Variabel",
      material: "Nilai variabel bisa diubah kapan saja dengan menugaskan nilai baru.",
      instruction: "Kode berikut harusnya mencetak 20, tapi ada error. Perbaiki!",
      starterCode: "poin = 10\\npoin = poin + 10\\nPrint(poin)",
      expectedOutput: "20",
      explanation: "Python case-sensitive! Print harus ditulis print (huruf kecil semua).",
    },
  ],

  // ── CONDITIONS ─────────────────────────────────────────
  conditions: [
    {
      id: 1, type: "mcq",
      title: "If Sederhana",
      material: "If digunakan untuk mengecek kondisi. Jika kondisi benar, blok kode di dalamnya dijalankan.",
      instruction: "Apa output dari kode ini?\\n\\nnilai = 80\\nif nilai >= 75:\\n    print(\"Lulus\")",
      options: ["Lulus", "nilai", "75", "Tidak ada output"],
      correct: 0,
      explanation: "nilai = 80, dan 80 >= 75 adalah True, jadi print(\"Lulus\") dijalankan.",
    },
    {
      id: 2, type: "fill",
      title: "If & Else",
      material: "Else adalah blok yang dijalankan jika kondisi if TIDAK terpenuhi.",
      instruction: "Lengkapi kode agar mencetak 'Selamat pagi' jika jam < 12, selain itu cetak 'Selamat siang':",
      starterCode: 'jam = 9\\nif jam < ___:\\n    print("Selamat pagi")\\nelse:\\n    print("Selamat siang")',
      blanks: ["12"],
      expectedOutput: "Selamat pagi",
      explanation: "Karena jam = 9 dan 9 < 12 adalah True, maka 'Selamat pagi' yang dicetak.",
    },
    {
      id: 3, type: "write",
      title: "Elif",
      material: "Elif = else if. Digunakan untuk mengecek kondisi tambahan setelah if.",
      instruction: "Buat program: jika nilai >= 90 print 'A', elif nilai >= 75 print 'B', else print 'C'. Gunakan nilai = 82.",
      expectedOutput: "B",
      explanation: "nilai = 82\\nif nilai >= 90:\\n    print('A')\\nelif nilai >= 75:\\n    print('B')\\nelse:\\n    print('C')",
    },
    {
      id: 4, type: "fix",
      title: "Perbandingan",
      material: "Operator perbandingan: == (sama dengan), != (tidak sama), > , < , >= , <=",
      instruction: "Kode ini harusnya cek apakah angka = 10, tapi ada error:",
      starterCode: "angka = 10\\nif angka = 10:\\n    print(\"Sepuluh\")",
      expectedOutput: "Sepuluh",
      explanation: "= adalah assignment, == adalah perbandingan! Ganti 'angka = 10' menjadi 'angka == 10' di dalam if.",
    },
    {
      id: 5, type: "write",
      title: "Tantangan!",
      material: "Gabungkan semua yang sudah dipelajari!",
      instruction: "Buat variabel umur = 17. Jika umur >= 17 print 'Boleh buat SIM', selain itu print 'Belum boleh'.",
      expectedOutput: "Boleh buat SIM",
      explanation: "umur = 17\\nif umur >= 17:\\n    print('Boleh buat SIM')\\nelse:\\n    print('Belum boleh')",
    },
  ],

  // ── LOOPS (NEW CHAPTER) ────────────────────────────────
  loops: [
    {
      id: 1, type: "run",
      title: "For Loop Dasar",
      material: "For loop digunakan untuk mengulang kode. Format: `for i in range(3):` akan mengulang 3 kali (0, 1, 2).",
      instruction: "Klik ▶ Run untuk melihat bagaimana for loop bekerja!",
      starterCode: 'for i in range(3):\\n    print(i)',
      expectedOutput: "0\\n1\\n2",
      explanation: "range(3) menghasilkan angka 0, 1, 2. Setiap angka disimpan di variabel i dan di-print.",
    },
    {
      id: 2, type: "fill",
      title: "Range dengan Start & End",
      material: "`range(start, end)` menghasilkan angka dari start sampai end-1. Contoh: `range(1, 4)` → 1, 2, 3",
      instruction: "Lengkapi kode agar mencetak angka 5, 6, 7:",
      starterCode: 'for i in range(___, ___):\\n    print(i)',
      blanks: ["5", "8"],
      expectedOutput: "5\\n6\\n7",
      explanation: "range(5, 8) menghasilkan 5, 6, 7. Angka terakhir (8) tidak termasuk!",
    },
    {
      id: 3, type: "write",
      title: "Print Pola",
      material: "Kamu bisa gabungkan for loop dengan print untuk membuat pola.",
      instruction: "Buat kode yang mencetak angka 1 sampai 5, masing-masing di baris baru.",
      expectedOutput: "1\\n2\\n3\\n4\\n5",
      explanation: "for i in range(1, 6):\\n    print(i)\\n\\nRange 1-6 menghasilkan 1,2,3,4,5",
    },
    {
      id: 4, type: "mcq",
      title: "Indentasi di Loop",
      material: "Kode di dalam loop HARUS di-indent (diberi spasi/tab). Python menggunakan indentasi untuk menentukan blok kode.",
      instruction: "Manakah kode yang BENAR?",
      options: [
        'for i in range(2):\\nprint(i)',
        'for i in range(2):\\n    print(i)',
        'for i in range(2): print(i)',
        'for i in range(2)\\n    print(i)'
      ],
      correct: 1,
      explanation: "Setelah tanda : di for loop, kode di dalamnya harus di-indent (diberi spasi). Opsi 2 adalah yang benar!",
    },
    {
      id: 5, type: "fix",
      title: "Perbaiki Indentasi",
      material: "Indentasi yang salah akan menyebabkan error di Python.",
      instruction: "Kode ini error karena indentasi. Perbaiki!",
      starterCode: "for i in range(3):\\nprint(i)\\nprint('Selesai')",
      expectedOutput: "0\\n1\\n2\\nSelesai",
      explanation: "Kode di dalam for loop harus di-indent. Tambahkan 4 spasi sebelum print(i)!",
    },
  ],

  // ── LISTS (NEW CHAPTER) ────────────────────────────────
  lists: [
    {
      id: 1, type: "run",
      title: "Membuat List",
      material: "List adalah kumpulan data. Cara membuat: `nama_list = [item1, item2, item3]`. Index dimulai dari 0.",
      instruction: "Klik ▶ Run untuk melihat cara mengakses elemen list!",
      starterCode: 'buah = ["apel", "jeruk", "mangga"]\\nprint(buah[0])\\nprint(buah[2])',
      expectedOutput: "apel\\nmangga",
      explanation: "buah[0] = elemen pertama (apel), buah[2] = elemen ketiga (mangga). Index dimulai dari 0!",
    },
    {
      id: 2, type: "fill",
      title: "Akses Elemen List",
      material: "Gunakan `[index]` untuk mengakses elemen list. Index pertama adalah 0.",
      instruction: "Lengkapi kode agar mencetak 'Python':",
      starterCode: 'bahasa = ["Java", "C++", "Python", "Go"]\\nprint(buah[___])',
      blanks: ["2"],
      expectedOutput: "Python",
      explanation: "Python ada di index ke-2 (karena index: 0=Java, 1=C++, 2=Python, 3=Go)",
    },
    {
      id: 3, type: "write",
      title: "Len & List",
      material: "`len(list)` mengembalikan jumlah elemen dalam list. Contoh: `len([1,2,3])` → 3",
      instruction: "Buat list berisi 3 nama temanmu, lalu print jumlahnya menggunakan len().",
      expectedOutput: "3",
      explanation: "teman = [\"Andi\", \"Budi\", \"Citra\"]\\nprint(len(teman))",
    },
    {
      id: 4, type: "mcq",
      title: "Index Negatif",
      material: "Python mendukung index negatif: -1 = elemen terakhir, -2 = elemen kedua terakhir, dst.",
      instruction: "Apa output dari kode ini?\\n\\nangka = [10, 20, 30, 40]\\nprint(angka[-1])",
      options: ["10", "20", "30", "40"],
      correct: 3,
      explanation: "angka[-1] mengakses elemen terakhir, yaitu 40!",
    },
    {
      id: 5, type: "fix",
      title: "Append ke List",
      material: "`list.append(item)` menambah item ke akhir list.",
      instruction: "Kode ini harusnya menambah 'Dina' ke list, tapi ada error. Perbaiki!",
      starterCode: "siswa = [\"Andi\", \"Budi\"]\\nsiswa.append[\"Dina\"]\\nprint(siswa)",
      expectedOutput: "['Andi', 'Budi', 'Dina']",
      explanation: "append adalah fungsi, jadi harus pakai tanda kurung: siswa.append(\"Dina\"), bukan kurung siku!",
    },
  ],

  // ── FUNCTIONS (NEW CHAPTER) ────────────────────────────
  functions: [
    {
      id: 1, type: "run",
      title: "Membuat Fungsi",
      material: "Fungsi adalah blok kode yang bisa dipanggil berulang. Format: `def nama_fungsi():` lalu isi kode di dalamnya.",
      instruction: "Klik ▶ Run untuk melihat fungsi sederhana!",
      starterCode: 'def sapa():\\n    print("Halo dari fungsi!")\\n\\nsapa()',
      expectedOutput: "Halo dari fungsi!",
      explanation: "def sapa(): membuat fungsi. sapa() memanggil/menjalankan fungsi tersebut.",
    },
    {
      id: 2, type: "fill",
      title: "Fungsi dengan Parameter",
      material: "Parameter adalah input untuk fungsi. Contoh: `def sapa(nama):` bisa dipanggil dengan `sapa(\"Budi\")`",
      instruction: "Lengkapi fungsi agar mencetak 'Halo, Python!':",
      starterCode: 'def sapa(___):\\n    print("Halo, " + nama)\\n\\nsapa("Python")',
      blanks: ["nama"],
      expectedOutput: "Halo, Python!",
      explanation: "Parameter 'nama' menerima nilai \"Python\" saat fungsi dipanggil, lalu digabung dengan print.",
    },
    {
      id: 3, type: "write",
      title: "Fungsi Return",
      material: "`return` mengirim hasil dari fungsi. Contoh: `return x + y` mengembalikan hasil penjumlahan.",
      instruction: "Buat fungsi 'tambah' yang menerima 2 angka dan mengembalikan hasil penjumlahannya. Panggil dengan tambah(5, 3) dan print hasilnya.",
      expectedOutput: "8",
      explanation: "def tambah(a, b):\\n    return a + b\\n\\nprint(tambah(5, 3))",
    },
    {
      id: 4, type: "mcq",
      title: "Scope Variabel",
      material: "Variabel di dalam fungsi hanya bisa diakses di dalam fungsi tersebut (local scope).",
      instruction: "Apa output dari kode ini?\\n\\nx = 10\\ndef ubah():\\n    x = 5\\nubah()\\nprint(x)",
      options: ["5", "10", "Error", "None"],
      correct: 1,
      explanation: "Variabel x di dalam fungsi ubah() adalah variabel lokal, berbeda dengan x di luar. Jadi print(x) tetap mencetak 10!",
    },
    {
      id: 5, type: "fix",
      title: "Panggil Fungsi",
      material: "Fungsi harus dipanggil dengan tanda kurung: nama_fungsi(), bukan nama_fungsi.",
      instruction: "Kode ini tidak mencetak apa-apa. Perbaiki agar fungsi terpanggil!",
      starterCode: "def halo():\\n    print(\"Hello!\")\\nhalo",
      expectedOutput: "Hello!",
      explanation: "Tambahkan tanda kurung: halo() untuk memanggil fungsi, bukan hanya menulis namanya.",
    },
  ],
};

// ── Main PythonLevel component ───────────────────────────
export default function PythonLevel({ chapter, level, onBack, onComplete }) {
  const [code, setCode] = useState(level.starterCode || "");
  const [output, setOutput] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [fillValues, setFillValues] = useState(
    level.blanks ? level.blanks.map(() => "") : []
  );

  function handleRun() {
    let codeToRun = code;

    // For fill type, replace ___ with filled values
    if (level.type === "fill") {
      let filled = level.starterCode;
      fillValues.forEach(val => {
        filled = filled.replace("___", val);
      });
      codeToRun = filled;
    }

    const result = runPython(codeToRun);
    if (result.error) {
      setOutput({ text: result.error, isError: true });
      setIsCorrect(false);
      return;
    }

    const correct = result.output.trim() === (level.expectedOutput || "").trim();
    setOutput({ text: result.output || "(tidak ada output)", isError: false });
    setIsCorrect(correct);
    if (correct) setShowExplain(true);
  }

  function handleMCQ(idx) {
    setSelectedOption(idx);
    const correct = idx === level.correct;
    setIsCorrect(correct);
    setShowExplain(true);
  }

  const accentColor = chapter.color;
  const bgLight = chapter.bg;

  return (
    <div className="screen" style={{ padding:"16px 16px 60px" }}>
      <div style={{ maxWidth:480, margin:"0 auto" }}>

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <button onClick={onBack} style={{
            background:"white", border:"2px solid #E2E8F0", borderRadius:12,
            padding:"8px 14px", fontFamily:"'Nunito',sans-serif",
            fontSize:13, fontWeight:800, color:"#6B7280", cursor:"pointer",
          }}>← Peta</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:900, color:accentColor, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              {chapter.title} · Level {level.id}
            </div>
            <div style={{ fontSize:14, fontWeight:900, color:"#1E2240" }}>{level.title}</div>
          </div>
          <div style={{
            fontSize:11, fontWeight:900, padding:"4px 12px", borderRadius:99,
            background: bgLight, border:`1.5px solid ${accentColor}40`, color:accentColor,
          }}>
            {{run:"▶ Run", fill:"✏️ Isi", write:"⌨️ Tulis", mcq:"❓ Pilihan", fix:"🔧 Fix"}[level.type]}
          </div>
        </div>

        {/* Material card */}
        <div style={{
          background:bgLight, border:`2px solid ${accentColor}30`,
          borderRadius:16, padding:"14px 16px", marginBottom:16,
        }}>
          <div style={{ fontSize:10, fontWeight:900, color:accentColor, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
            📖 Materi
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:"#374151", lineHeight:1.6 }}>
            {level.material.split("`").map((part, i) =>
              i % 2 === 1
                ? <code key={i} style={{ background:"#1E2240", color:"#93C5FD", borderRadius:4, padding:"1px 6px", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{part}</code>
                : part
            )}
          </div>
        </div>

        {/* Instruction */}
        <div style={{
          background:"white", border:"2px solid #E2E8F0",
          borderRadius:16, padding:"14px 16px", marginBottom:16,
        }}>
          <div style={{ fontSize:10, fontWeight:900, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>
            🎯 Instruksi
          </div>
          <pre style={{ fontSize:13, fontWeight:800, color:"#1E2240", lineHeight:1.6, whiteSpace:"pre-wrap", fontFamily:"'Nunito',sans-serif", margin:0 }}>
            {level.instruction.split("`").map((part, i) =>
              i % 2 === 1
                ? <code key={i} style={{ background:"#F0F4FF", color:"#4F46E5", borderRadius:4, padding:"1px 6px", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{part}</code>
                : part
            )}
          </pre>
        </div>

        {/* MCQ type */}
        {level.type === "mcq" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {level.options.map((opt, idx) => {
              const picked = selectedOption === idx;
              const isRight = idx === level.correct;
              let bg = "white", border = "2px solid #E2E8F0", color = "#1E2240";
              if (picked && isRight)  { bg = "#ECFDF5"; border = "2px solid #10B981"; color = "#065F46"; }
              if (picked && !isRight) { bg = "#FEF2F2"; border = "2px solid #EF4444"; color = "#991B1B"; }
              if (!picked && selectedOption !== null && isRight) { bg = "#ECFDF5"; border = "2px solid #10B981"; color = "#065F46"; }
              return (
                <button key={idx} onClick={() => selectedOption === null && handleMCQ(idx)} style={{
                  background:bg, border, borderRadius:12, padding:"13px 16px",
                  fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:800,
                  color, textAlign:"left", cursor: selectedOption === null ? "pointer" : "default",
                  transition:"all 0.15s",
                }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12 }}>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Fill type */}
        {level.type === "fill" && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
              ✏️ Lengkapi Kode
            </div>
            <div style={{
              background:"#1E2240", borderRadius:14, padding:"14px 16px",
              fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#CDD6F4",
              lineHeight:2, marginBottom:10,
            }}>
              {level.starterCode.split("___").map((part, i, arr) => (
                <span key={i}>
                  <span style={{ whiteSpace:"pre" }}>{part}</span>
                  {i < arr.length - 1 && (
                    <input
                      value={fillValues[i] || ""}
                      onChange={e => {
                        const next = [...fillValues];
                        next[i] = e.target.value;
                        setFillValues(next);
                      }}
                      placeholder="___"
                      disabled={isCorrect === true}
                      style={{
                        background:"#2D3748", border:"2px solid #4F46E5",
                        borderRadius:6, padding:"2px 8px",
                        fontFamily:"'JetBrains Mono',monospace", fontSize:13,
                        color:"#93C5FD", width: Math.max(60, (fillValues[i]||"___").length * 10),
                        outline:"none",
                      }}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Write / Fix / Run — code editor */}
        {(level.type === "write" || level.type === "fix" || level.type === "run") && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
              ⌨️ {level.type === "run" ? "Kode" : level.type === "fix" ? "Perbaiki Kode" : "Tulis Kode"}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={level.type === "run" || isCorrect === true}
              spellCheck={false}
              autoCapitalize="none"
              style={{
                width:"100%", minHeight: level.type === "run" ? 60 : 120,
                background:"#1E2240", color:"#CDD6F4",
                border:`2px solid ${isCorrect === true ? "#10B981" : isCorrect === false ? "#EF4444" : "#3A4060"}`,
                borderRadius:14, padding:"14px 16px",
                fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:1.8,
                resize:"vertical", outline:"none",
                transition:"border-color 0.2s",
              }}
            />
          </div>
        )}

        {/* Run button */}
        {level.type !== "mcq" && (
          <button
            onClick={handleRun}
            disabled={isCorrect === true || (level.type === "fill" && fillValues.some(v => !v.trim()))}
            style={{
              width:"100%", padding:"13px",
              background: isCorrect === true ? "#10B981" : accentColor,
              border:"none", borderRadius:14,
              color:"white", fontSize:14, fontWeight:900,
              cursor: isCorrect === true ? "default" : "pointer",
              fontFamily:"'Nunito',sans-serif",
              boxShadow: isCorrect === true ? "0 4px 0 #059669" : `0 4px 0 ${chapter.shadow}`,
              marginBottom:12, opacity: isCorrect === true ? 0.8 : 1,
              transition:"all 0.2s",
            }}
          >
            {isCorrect === true ? "✓ Benar!" : "▶ Jalankan"}
          </button>
        )}

        {/* Output terminal */}
        {output && level.type !== "mcq" && (
          <div style={{
            background:"#0F172A", borderRadius:14, padding:"14px 16px", marginBottom:12,
            border:`2px solid ${output.isError ? "#EF444460" : isCorrect ? "#10B98160" : "#3A4060"}`,
          }}>
            <div style={{ fontSize:10, fontWeight:900, color:"#4B5563", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>
              📟 Output
            </div>
            <pre style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:13,
              color: output.isError ? "#FCA5A5" : isCorrect ? "#6EE7B7" : "#CDD6F4",
              margin:0, whiteSpace:"pre-wrap", lineHeight:1.7,
            }}>{output.text}</pre>
          </div>
        )}

        {/* Explanation */}
        {showExplain && (
          <div style={{
            background: isCorrect ? "#ECFDF5" : "#FEF2F2",
            border:`2px solid ${isCorrect ? "#10B981" : "#EF4444"}`,
            borderRadius:16, padding:"14px 16px", marginBottom:16,
            animation:"popIn 0.3s ease",
          }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{isCorrect ? "🎉" : "💡"}</div>
            <div style={{ fontSize:14, fontWeight:900, color: isCorrect ? "#065F46" : "#991B1B", marginBottom:6 }}>
              {isCorrect ? "Benar! Bagus sekali!" : "Hampir! Lihat penjelasannya:"}
            </div>
            <pre style={{
              fontSize:13, fontWeight:700,
              color: isCorrect ? "#064E3B" : "#7F1D1D",
              whiteSpace:"pre-wrap", fontFamily:"'Nunito',sans-serif", margin:0, lineHeight:1.6,
            }}>{level.explanation}</pre>
          </div>
        )}

        {/* Next button */}
        {isCorrect === true && (
          <button onClick={onComplete} style={{
            width:"100%", padding:"14px",
            background: accentColor, border:"none", borderRadius:14,
            color:"white", fontSize:15, fontWeight:900,
            cursor:"pointer", fontFamily:"'Nunito',sans-serif",
            boxShadow:`0 4px 0 ${chapter.shadow}`,
            animation:"popIn 0.3s ease",
          }}>
            Lanjut ke Level Berikutnya →
          </button>
        )}

        {isCorrect === false && !output?.isError && level.type !== "mcq" && (
          <div style={{
            background:"#FEF2F2", border:"2px solid #EF4444",
            borderRadius:16, padding:"12px 16px",
            fontSize:13, fontWeight:800, color:"#991B1B",
          }}>
            ❌ Output belum sesuai. Expected: <code style={{ fontFamily:"monospace" }}>{level.expectedOutput}</code>
          </div>
        )}

      </div>

      <style>{`
        @keyframes popIn {
          from { opacity:0; transform:scale(0.95) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}