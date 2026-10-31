/**
 * Zero-dependency Procedural Canvas Confetti Burst
 * Generates cyber particles & phosphor confetti on victory.
 */

export function triggerConfetti(colorMode: 'green' | 'amber' | 'cyan' = 'green') {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = colorMode === 'green'
    ? ['#00ff66', '#33ff88', '#00cc44', '#aaffcc', '#ffffff']
    : colorMode === 'amber'
    ? ['#ffb000', '#ffd044', '#ff8800', '#fff3aa', '#ffffff']
    : ['#00f0ff', '#55ffff', '#0099cc', '#aaffff', '#ffffff'];

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    decay: number;
    shape: 'square' | 'char';
    char?: string;
  }> = [];

  const cyberChars = ['0', '1', '§', '¶', '▓', '░', '∆', 'Ψ', 'Ø'];

  for (let i = 0; i < 110; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      decay: 0.008 + Math.random() * 0.012,
      shape: Math.random() > 0.4 ? 'square' : 'char',
      char: cyberChars[Math.floor(Math.random() * cyberChars.length)]
    });
  }

  let animationFrameId: number;

  function render() {
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let aliveCount = 0;

    for (let p of particles) {
      if (p.opacity <= 0) continue;
      aliveCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.16; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      ctx!.save();
      ctx!.globalAlpha = Math.max(0, p.opacity);
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'square') {
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx!.fillStyle = p.color;
        ctx!.font = `bold ${Math.floor(p.size * 1.5)}px monospace`;
        ctx!.fillText(p.char || '0', -p.size / 2, p.size / 2);
      }

      ctx!.restore();
    }

    if (aliveCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  render();
}
