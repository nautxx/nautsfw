const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

const sitemap = document.getElementById("sitemap");
const hero = document.getElementById("intro");
if (sitemap && hero) {
  const sitemapItems = document.querySelectorAll(".sitemap__item");
  const sections = document.querySelectorAll(".section[id]");

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      sitemap.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { threshold: 0, rootMargin: "-50% 0px 0px 0px" }
  );
  heroObserver.observe(hero);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        sitemapItems.forEach((item) => {
          const link = item.querySelector(".sitemap__link");
          item.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

const roleTextEl = document.getElementById("roleText");
if (roleTextEl) {
  const roles = [
    "Multi-Agent Systems Builder",
    "Open-source builder",
    "Systems Engineer",
    "Quality Engineer",
  ];
  const rolePills = document.querySelectorAll(".role-pill");

  function setActiveRolePill(index) {
    rolePills.forEach((pill) => {
      pill.classList.toggle("is-active", Number(pill.dataset.roleIndex) === index);
    });
  }

  let roleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function tickRole() {
    const current = roles[roleIndex];
    if (typing) {
      charIndex++;
      roleTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typing = false;
        setTimeout(tickRole, 1800);
        return;
      }
      setTimeout(tickRole, 45);
    } else {
      charIndex--;
      roleTextEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typing = true;
        roleIndex = (roleIndex + 1) % roles.length;
        setActiveRolePill(roleIndex);
        setTimeout(tickRole, 300);
        return;
      }
      setTimeout(tickRole, 25);
    }
  }

  setActiveRolePill(roleIndex);
  tickRole();
}

const heroSnakesCanvas = document.getElementById("heroSnakes");
if (heroSnakesCanvas) {
  const GRID = 24;
  const SNAKE_COUNT = 3;
  const SNAKE_LENGTH = 8;
  const TICK_MS = 180;
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const parent = heroSnakesCanvas.parentElement;
  const ctx = heroSnakesCanvas.getContext("2d");

  const resize = () => {
    heroSnakesCanvas.width = parent.clientWidth;
    heroSnakesCanvas.height = parent.clientHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  const cols = () => Math.floor(heroSnakesCanvas.width / GRID);
  const rows = () => Math.floor(heroSnakesCanvas.height / GRID);

  const snakes = Array.from({ length: SNAKE_COUNT }, () => {
    const x = Math.floor(Math.random() * cols());
    const y = Math.floor(Math.random() * rows());
    return { trail: [[x, y]], dir: DIRS[Math.floor(Math.random() * 4)] };
  });

  const DOT_COLOR = "187 86% 53%";

  function tick() {
    const c = cols();
    const r = rows();

    for (const snake of snakes) {
      if (Math.random() < 0.3) {
        snake.dir = DIRS[Math.floor(Math.random() * 4)];
      }
      const [hx, hy] = snake.trail[snake.trail.length - 1];
      let nx = hx + snake.dir[0];
      let ny = hy + snake.dir[1];

      if (nx < 0) nx = c - 1;
      if (nx >= c) nx = 0;
      if (ny < 0) ny = r - 1;
      if (ny >= r) ny = 0;

      snake.trail.push([nx, ny]);
      if (snake.trail.length > SNAKE_LENGTH) snake.trail.shift();
    }

    ctx.clearRect(0, 0, heroSnakesCanvas.width, heroSnakesCanvas.height);

    for (const snake of snakes) {
      for (let i = 0; i < snake.trail.length; i++) {
        const [gx, gy] = snake.trail[i];
        const alpha = ((i + 1) / snake.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(gx * GRID + GRID / 2, gy * GRID + GRID / 2, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${DOT_COLOR} / ${alpha})`;
        ctx.fill();
      }
    }
  }

  let interval = null;
  const start = () => { if (!interval) interval = setInterval(tick, TICK_MS); };
  const stop = () => { if (interval) { clearInterval(interval); interval = null; } };

  const io = new IntersectionObserver(
    (entries) => {
      entries[0].isIntersecting && document.visibilityState === "visible" ? start() : stop();
    },
    { threshold: 0 }
  );
  io.observe(heroSnakesCanvas);

  document.addEventListener("visibilitychange", () => {
    const inView = document.visibilityState === "visible" && heroSnakesCanvas.getBoundingClientRect().top < window.innerHeight;
    inView ? start() : stop();
  });
}
