/* ===== VS Code + Git Tutorial App Logic ===== */

(function () {
  'use strict';

  /* ---------- Progress Bar ---------- */
  function initProgressBar() {
    var bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  /* ---------- Sidebar: Active Link Highlight ---------- */
  function initActiveLink() {
    var links = document.querySelectorAll('#sidebar nav a');
    
    // For single page tutorial, we highlight based on scroll position
    // instead of current page URL
    
    // 1. Initial Highlight based on hash
    function updateActiveLink() {
        var fromTop = window.scrollY + 100; // Offset
        var currentId = '';

        links.forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            var section = document.querySelector(href);
            if (section && section.offsetTop <= fromTop) {
                currentId = href;
            }
        });

        links.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial call
  }

  /* ---------- Sidebar: Search / Filter ---------- */
  function initSearch() {
    var box = document.getElementById('search-box');
    if (!box) return;
    var navLinks = document.querySelectorAll('#sidebar nav a');

    box.addEventListener('input', function () {
      var q = box.value.trim().toLowerCase();
      if (!q) {
        navLinks.forEach(function (a) { a.classList.remove('nav-hidden'); });
        clearContentHighlights();
        return;
      }
      navLinks.forEach(function (a) {
        var text = a.textContent.toLowerCase();
        if (text.indexOf(q) !== -1) {
          a.classList.remove('nav-hidden');
        } else {
          a.classList.add('nav-hidden');
        }
      });
      highlightContent(q);
    });
  }

  /* ---------- Content highlighting ---------- */
  function highlightContent(query) {
    clearContentHighlights();
    if (!query) return;
    var main = document.getElementById('main');
    if (!main) return;
    // Walk text nodes
    var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parent = node.parentNode;
      if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
      if (parent.classList && parent.classList.contains('search-highlight')) return;
      var text = node.textContent;
      var lower = text.toLowerCase();
      var idx = lower.indexOf(query);
      if (idx === -1) return;
      var frag = document.createDocumentFragment();
      var lastIdx = 0;
      while (idx !== -1) {
        frag.appendChild(document.createTextNode(text.substring(lastIdx, idx)));
        var span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = text.substring(idx, idx + query.length);
        frag.appendChild(span);
        lastIdx = idx + query.length;
        idx = lower.indexOf(query, lastIdx);
      }
      frag.appendChild(document.createTextNode(text.substring(lastIdx)));
      parent.replaceChild(frag, node);
    });
  }

  function clearContentHighlights() {
    var marks = document.querySelectorAll('.search-highlight');
    marks.forEach(function (span) {
      var parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  }

  /* ---------- Mobile Sidebar Toggle ---------- */
  function initSidebarToggle() {
    var btn = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      btn.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });
    // Close sidebar when clicking a nav link on mobile
    sidebar.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 860) {
        sidebar.classList.remove('open');
        btn.textContent = '☰';
      }
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href').substring(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initProgressBar();
    initActiveLink();
    initSearch();
    initSidebarToggle();
    initSmoothScroll();
  });
})();
