import { useState } from "react";
import PythonLevel, { PYTHON_LEVELS } from "./PythonLevel";

const CHAPTERS = [
  {
    id: "intro",
    title: "Introduction",
    subtitle: "Kenalan sama Python!",
    color: "#FF9F43",
    shadow: "#E07020",
    bg: "#FFF5EB",
    icon: <img src="/Pythonlogo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "Hello Python!", type: "run"   },
      { id: 2, title: "Print Teks",   type: "fill"  },
      { id: 3, title: "Print Angka",  type: "write" },
      { id: 4, title: "Komentar",     type: "mcq"   },
    ],
  },
  {
    id: "variables",
    title: "Variables",
    subtitle: "Simpan data di kotak!",
    color: "#3B82F6",
    shadow: "#1D4ED8",
    bg: "#EFF6FF",
    icon: <img src="/python-logo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "Buat Variabel",   type: "write" },
      { id: 2, title: "Tipe Data",       type: "mcq"   },
      { id: 3, title: "String & Angka",  type: "fill"  },
      { id: 4, title: "Operasi Hitung",  type: "write" },
      { id: 5, title: "Update Variabel", type: "fix"   },
    ],
  },
  {
    id: "conditions",
    title: "If / Else",
    subtitle: "Robot ambil keputusan!",
    color: "#8B5CF6",
    shadow: "#6D28D9",
    bg: "#F5F3FF",
    icon: <img src="/python-logo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "If Sederhana",  type: "mcq"   },
      { id: 2, title: "If & Else",     type: "fill"  },
      { id: 3, title: "Elif",          type: "write" },
      { id: 4, title: "Perbandingan",  type: "fix"   },
      { id: 5, title: "Tantangan!",    type: "write" },
    ],
  },
  {
    id: "loops",
    title: "Perulangan",
    subtitle: "Ulangi kode dengan mudah!",
    color: "#10B981",
    shadow: "#047857",
    bg: "#ECFDF5",
    icon: <img src="/python-logo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "For Loop Dasar",    type: "run"   },
      { id: 2, title: "Range Start & End", type: "fill"  },
      { id: 3, title: "Print Pola",        type: "write" },
      { id: 4, title: "Indentasi di Loop", type: "mcq"   },
      { id: 5, title: "Perbaiki Indentasi",type: "fix"   },
    ],
  },
  {
    id: "lists",
    title: "List",
    subtitle: "Kumpulan data dalam satu variabel!",
    color: "#EF4444",
    shadow: "#B91C1C",
    bg: "#FEF2F2",
    icon: <img src="/python-logo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "Membuat List",      type: "run"   },
      { id: 2, title: "Akses Elemen List", type: "fill"  },
      { id: 3, title: "Len & List",        type: "write" },
      { id: 4, title: "Index Negatif",     type: "mcq"   },
      { id: 5, title: "Append ke List",    type: "fix"   },
    ],
  },
  {
    id: "functions",
    title: "Fungsi",
    subtitle: "Buat kode yang reusable!",
    color: "#F59E0B",
    shadow: "#B45309",
    bg: "#FFFBEA",
    icon: <img src="/python-logo.png" alt="Python" style={{ width:26, height:26, objectFit:"contain" }} />,
    levels: [
      { id: 1, title: "Membuat Fungsi",         type: "run"   },
      { id: 2, title: "Fungsi dengan Parameter",type: "fill"  },
      { id: 3, title: "Fungsi Return",          type: "write" },
      { id: 4, title: "Scope Variabel",         type: "mcq"   },
      { id: 5, title: "Panggil Fungsi",         type: "fix"   },
    ],
  },
];

const TYPE_INFO = {
  run:   { label: "▶ Jalankan",        color: "#10B981" },
  fill:  { label: "✏️ Isi Kosong",     color: "#3B82F6" },
  write: { label: "⌨️ Tulis Kode",     color: "#8B5CF6" },
  mcq:   { label: "❓ Pilihan Ganda",   color: "#FF9F43" },
  fix:   { label: "🔧 Perbaiki Error",  color: "#EF4444" },
};

const ZIGZAG = [0, 1, 2, 1, 0, -1, -2, -1];

function buildChapters(doneMap) {
  let prevChapterDone = true;
  return CHAPTERS.map((ch) => {
    const chapterUnlocked = prevChapterDone;
    let prevDone = chapterUnlocked;
    const levels = ch.levels.map((lv) => {
      const done = !!(doneMap[ch.id]?.[lv.id]);
      const unlocked = prevDone;
      if (!done) prevDone = false;
      return { ...lv, done, unlocked };
    });
    prevChapterDone = ch.levels.every((l) => !!(doneMap[ch.id]?.[l.id]));
    return { ...ch, levels, chapterUnlocked };
  });
}

function HexNode({ size, fillColor, strokeColor, glowColor, onClick, children }) {
  const w = size;
  const h = Math.round(size * 0.866);
  const pts = [
    [w*0.5, 0],[w, h*0.25],[w, h*0.75],
    [w*0.5, h],[0, h*0.75],[0, h*0.25],
  ].map(p=>p.join(",")).join(" ");

  return (
    <div onClick={onClick} style={{
      width:w, height:h, position:"relative",
      cursor: onClick ? "pointer" : "default",
      filter: glowColor ? `drop-shadow(0 0 7px ${glowColor})` : "none",
      transition:"transform 0.15s",
    }}
    onMouseEnter={e=>{ if(onClick) e.currentTarget.style.transform="scale(1.1)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; }}
    >
      <svg width={w} height={h} style={{ position:"absolute", inset:0 }}>
        <polygon points={pts} fill={strokeColor} />
        <polygon points={[
          [w*0.5,3],[w-2.6,h*0.25+1.5],[w-2.6,h*0.75-1.5],
          [w*0.5,h-3],[2.6,h*0.75-1.5],[2.6,h*0.25+1.5],
        ].map(p=>p.join(",")).join(" ")} fill={fillColor} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
}

export default function PythonGame({ onFinish, onHome }) {
  const [doneMap, setDoneMap] = useState({});
  const [activeLevel, setActiveLevel] = useState(null); // { chapter, level, levelData }

  const chapters = buildChapters(doneMap);
  const totalDone = chapters.flatMap(c=>c.levels).filter(l=>l.done).length;
  const totalLevels = CHAPTERS.flatMap(c=>c.levels).length;

  function handleSelectLevel(chapter, level) {
    const levelData = PYTHON_LEVELS[chapter.id]?.[level.id - 1];
    if (!levelData) return;
    setActiveLevel({ chapter, level, levelData });
  }

  function handleComplete() {
    const { chapter, level } = activeLevel;
    setDoneMap(prev => ({
      ...prev,
      [chapter.id]: { ...(prev[chapter.id] || {}), [level.id]: true }
    }));
    setActiveLevel(null);
  }

  // Show level screen
  if (activeLevel) {
    return (
      <PythonLevel
        chapter={activeLevel.chapter}
        level={activeLevel.levelData}
        onBack={() => setActiveLevel(null)}
        onComplete={handleComplete}
      />
    );
  }

  const HEX = 60;
  const HEX_H = Math.round(HEX * 0.866);
  const ROW_H = HEX_H + 40;
  const STEP = 52;
  const SVG_W = 320;

  return (
    <div className="screen" style={{ padding:"20px 16px 60px" }}>
      <div style={{ maxWidth:420, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={onHome} style={{
            background:"white", border:"2px solid #E2E8F0", borderRadius:12,
            padding:"8px 14px", fontFamily:"'Nunito',sans-serif",
            fontSize:13, fontWeight:800, color:"#6B7280", cursor:"pointer",
          }}>← Kembali</button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#1E2240" }}>🐍 Belajar Python</div>
            <div style={{ fontSize:12, fontWeight:700, color:"#9CA3AF" }}>{totalDone}/{totalLevels} level selesai</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{
          background:"white", borderRadius:16, padding:"14px 18px",
          border:"2px solid #E2E8F0", marginBottom:28,
          boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.06em" }}>Progress</span>
            <span style={{ fontSize:12, fontWeight:900, color:"#1E2240" }}>{Math.round((totalDone/totalLevels)*100)}%</span>
          </div>
          <div style={{ height:8, background:"#F0F4FF", borderRadius:99, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:99,
              background:"linear-gradient(90deg,#FF9F43,#3B82F6,#8B5CF6)",
              width:`${(totalDone/totalLevels)*100}%`,
              transition:"width 0.5s",
            }}/>
          </div>
        </div>

        {/* Chapters */}
        {chapters.map((chapter, ci) => {
          const locked = !chapter.chapterUnlocked;
          const chDone = chapter.levels.filter(l=>l.done).length;
          const centerX = SVG_W / 2;
          const positions = chapter.levels.map((_, li) => ({
            cx: centerX + ZIGZAG[li % ZIGZAG.length] * STEP,
            cy: li * ROW_H + HEX_H / 2 + 10,
          }));
          const svgH = chapter.levels.length * ROW_H + 20;

          return (
            <div key={chapter.id} style={{ marginBottom:32 }}>
              {/* Chapter header */}
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                background: locked ? "#F8FAFC" : chapter.bg,
                border:`2px solid ${locked ? "#E2E8F0" : chapter.color+"50"}`,
                borderRadius:14, padding:"12px 16px", marginBottom:8,
                opacity: locked ? 0.6 : 1,
              }}>
                <div style={{ fontSize:26 }}>{locked ? "🔒" : chapter.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:900, color: locked ? "#9CA3AF" : "#1E2240" }}>{chapter.title}</div>
                  <div style={{ fontSize:12, fontWeight:700, color: locked ? "#C4C9D8" : chapter.color }}>{chapter.subtitle}</div>
                </div>
                {!locked && (
                  <div style={{
                    fontSize:11, fontWeight:900, color:chapter.color,
                    background:chapter.bg, border:`2px solid ${chapter.color}40`,
                    borderRadius:99, padding:"3px 10px",
                  }}>{chDone}/{chapter.levels.length}</div>
                )}
              </div>

              {/* Map */}
              <div style={{ display:"flex", justifyContent:"center" }}>
                <div style={{ position:"relative", width:SVG_W, height:svgH }}>
                  {!locked && (
                    <svg width={SVG_W} height={svgH} style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                      {positions.map((pos, li) => {
                        if (li === 0) return null;
                        const prev = positions[li-1];
                        const prevDone = chapter.levels[li-1].done;
                        const thisUnlocked = chapter.levels[li].unlocked;
                        const x1=prev.cx, y1=prev.cy+HEX_H/2+2;
                        const x2=pos.cx,  y2=pos.cy-HEX_H/2-2;
                        const midY=(y1+y2)/2;
                        return (
                          <g key={li}>
                            <path d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                              fill="none" stroke="#DDE3F0" strokeWidth={6} strokeLinecap="round"/>
                            {(prevDone||thisUnlocked) && (
                              <path d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                                fill="none"
                                stroke={prevDone ? chapter.color : chapter.color+"70"}
                                strokeWidth={prevDone ? 5 : 3}
                                strokeLinecap="round"
                                strokeDasharray={prevDone ? "none" : "7 5"}/>
                            )}
                            {prevDone && <circle cx={(x1+x2)/2} cy={midY} r={3.5} fill={chapter.color+"90"}/>}
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {positions.map((pos, li) => {
                    const level = chapter.levels[li];
                    const isLocked = !level.unlocked;
                    const isDone = level.done;
                    const isNext = !isDone && level.unlocked;
                    const hexSize = isNext ? 66 : HEX;
                    const hexHh = Math.round(hexSize * 0.866);
                    const fillColor = isLocked ? "#F1F5F9" : isDone ? chapter.color : "white";
                    const strokeColor = isLocked ? "#DDE3F0" : isDone ? chapter.shadow : chapter.color;
                    const glowColor = isDone ? chapter.color+"70" : isNext ? chapter.color+"90" : null;

                    return (
                      <div key={level.id} style={{
                        position:"absolute",
                        left: pos.cx - hexSize/2,
                        top:  pos.cy - hexHh/2,
                        display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                      }}>
                        <HexNode
                          size={hexSize} fillColor={fillColor}
                          strokeColor={strokeColor} glowColor={glowColor}
                          onClick={!isLocked ? () => handleSelectLevel(chapter, level) : null}
                        >
                          <span style={{
                            fontSize: isNext ? 20 : 16, fontWeight:900, userSelect:"none",
                            color: isLocked ? "#C4C9D8" : isDone ? "white" : chapter.color,
                          }}>
                            {isLocked ? "🔒" : isDone ? "✓" : level.id}
                          </span>
                        </HexNode>
                        <div style={{
                          fontSize:9, fontWeight:900, textAlign:"center",
                          maxWidth:80, lineHeight:1.3,
                          color: isLocked ? "#C4C9D8" : isDone ? chapter.color : "#6B7280",
                          marginTop:2,
                        }}>{level.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {ci < chapters.length-1 && (
                <div style={{ borderTop:"2px dashed #E2E8F0", marginTop:8 }}/>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ textAlign:"center", padding:"8px 0", fontSize:13, fontWeight:800, color:"#C4C9D8" }}>
           Terus belajar dan berlatih!
        </div>
      </div>
    </div>
  );
}