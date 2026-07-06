document.getElementById("year").textContent = new Date().getFullYear();

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
