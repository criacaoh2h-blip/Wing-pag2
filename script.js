const revealItems = document.querySelectorAll(".scroll-bottom");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ativo");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -4% 0px",
      threshold: 0.05,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("ativo"));
}

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const content = item.querySelector(".faq-content");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem === item) return;
      openItem.classList.remove("open");
      openItem.querySelector(".faq-content").style.maxHeight = null;
    });

    item.classList.toggle("open", !isOpen);
    content.style.maxHeight = isOpen ? null : `${content.scrollHeight}px`;
  });
});

function initStars() {
  const canvas = document.getElementById("stars-canvas");
  const wrapper = document.querySelector(".after-cards");
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  let width = 0;
  let height = 0;
  let ratio = 1;

  function random(seed) {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
  }

  function resize() {
    const rect = wrapper.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(wrapper.scrollHeight));
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = width < 768 ? 190 : 430;
    stars = Array.from({ length: count }, (_, index) => {
      const seed = index + 1;
      return {
        x: random(seed * 3.17) * width,
        y: random(seed * 6.71) * height,
        size: random(seed * 9.43) > 0.8 ? 1.5 : 1,
        alpha: 0.25 + random(seed * 2.91) * 0.75,
        speed: 0.04 + random(seed * 5.33) * 0.12,
      };
    });
  }

  function drawWaves(time) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#2ab3ff";
    ctx.lineWidth = 0.75;
    const base = Math.min(height * 0.08, 420);
    for (let i = 1; i <= 5; i += 1) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y = base + Math.sin(x * 0.025 * (i / 3) + time / 2250) * (35 / i);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function render(time) {
    ctx.clearRect(0, 0, width, height);
    drawWaves(time);

    stars.forEach((star) => {
      star.y -= star.speed;
      if (star.y < -2) star.y = height + 2;
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#fff";
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  resize();
  requestAnimationFrame(render);
  window.addEventListener("resize", resize);
}

initStars();
