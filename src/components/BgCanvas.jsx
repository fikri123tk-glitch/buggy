import { useEffect, useRef } from "react";

const SYMBOLS = ["if","for","{}","=>","01","++","//","()","[]","!=","==","while","true","false","print"];
const COLORS  = ["#3B82F6AA","#8B5CF6AA","#10B981AA","#FF6B35AA","#F59E0BAA","#EC4899AA"];

export default function BgCanvas({ avatar }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], raf;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makeSymbol() {
      return {
        type: "sym",
        x: Math.random() * W, y: H + 20,
        sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 14 + Math.random() * 14,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.5 + Math.random() * 0.7),
        op: 0.35 + Math.random() * 0.45,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.01,
      };
    }

    function makeAvatar() {
      return {
        type: "avatar",
        x: Math.random() * W, y: H + 60,
        sym: avatar,
        size: 32 + Math.random() * 28,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.25 + Math.random() * 0.35),
        op: 0.22 + Math.random() * 0.22,
        rot: (Math.random() - 0.5) * 0.3,
        vrot: (Math.random() - 0.5) * 0.005,
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < 40; i++) { const p = makeSymbol(); p.y = Math.random() * H; particles.push(p); }
      for (let i = 0; i < 10; i++) { const a = makeAvatar(); a.y = Math.random() * H; particles.push(a); }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.op;
        if (p.type === "sym") {
          ctx.font = `700 ${p.size}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = p.col;
          ctx.fillText(p.sym, 0, 0);
        } else {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.sym, 0, 0);
        }
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        if (p.y < -80) {
          const fresh = p.type === "sym" ? makeSymbol() : makeAvatar();
          Object.assign(p, fresh);
        }
        if (p.x < -80) p.x = W + 20;
        if (p.x > W + 80) p.x = -20;
      });
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    init();
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [avatar]);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}