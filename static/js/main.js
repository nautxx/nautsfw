document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
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

const sitemap = document.getElementById("sitemap");
const hero = document.getElementById("intro");
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

const roles = [
  "Multi-Agent Systems Builder",
  "Open-source builder",
  "Systems Engineer",
  "Quality Engineer",
];
const roleTextEl = document.getElementById("roleText");
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
