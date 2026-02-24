(function () {
  const progressBar = document.getElementById("progressBar");
  const sidebar = document.getElementById("sidebar");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const searchInput = document.getElementById("searchInput");
  const tocLinks = Array.from(document.querySelectorAll(".toc-link"));
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
  }

  function setActiveLink() {
    const current = sections.find((section, index) => {
      const top = section.offsetTop - 120;
      const nextTop = sections[index + 1] ? sections[index + 1].offsetTop - 120 : Infinity;
      const y = window.scrollY;
      return y >= top && y < nextTop;
    });

    tocLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      link.classList.toggle("active", current && current.id === id);
    });
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function clearMarks(container) {
    container.querySelectorAll("mark").forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) {
        return;
      }
      parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
      parent.normalize();
    });
  }

  function highlightInElement(element, keyword) {
    if (!keyword) {
      return;
    }

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    const regex = new RegExp(escapeRegExp(keyword), "gi");
    const targets = [];
    let node = walker.nextNode();

    while (node) {
      if (node.nodeValue && regex.test(node.nodeValue)) {
        targets.push(node);
      }
      regex.lastIndex = 0;
      node = walker.nextNode();
    }

    targets.forEach((textNode) => {
      const text = textNode.nodeValue;
      if (!text) {
        return;
      }

      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        frag.appendChild(mark);
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(frag, textNode);
      }
      regex.lastIndex = 0;
    });
  }

  function runSearch(keyword) {
    const trimmed = keyword.trim();

    sections.forEach((section) => {
      clearMarks(section);
      const text = (section.textContent || "").toLowerCase();
      const matched = !trimmed || text.includes(trimmed.toLowerCase());
      section.style.display = matched ? "block" : "none";
      if (matched && trimmed) {
        highlightInElement(section, trimmed);
      }
    });

    tocLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      const visible = section && section.style.display !== "none";
      link.style.display = visible ? "block" : "none";
    });
  }

  window.addEventListener("scroll", function () {
    updateProgress();
    setActiveLink();
  });

  window.addEventListener("resize", setActiveLink);

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      runSearch(e.target.value || "");
    });
  }

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
  }

  tocLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (sidebar && window.innerWidth <= 900) {
        sidebar.classList.remove("open");
      }
    });
  });

  updateProgress();
  setActiveLink();
})();
