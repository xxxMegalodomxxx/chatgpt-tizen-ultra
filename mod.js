(function () {
  'use strict';

  if (window.__KKGPT_LOADED__) return;
  window.__KKGPT_LOADED__ = true;

  const K = {
    SCALING_FONT: 26,
    ACCENT: '#10a37f',
    BG: '#050505',
    KEYS: {
      UP: 38,
      DOWN: 40,
      ENTER: 13,
      BLUE: 406
    },
    REMOVE: [
      'nav',
      'aside',
      'footer',
      'header',
      '.sticky',
      '[class*="sidebar"]',
      'button[aria-label="Settings"]'
    ]
  };

  class KingKrispyGPT {
    constructor() {
      this.idx = -1;
      this.lastLen = 0;
      this.menuOpen = false;

      this.macros = [
        { name: 'Summarize', text: 'Summarize this chat so far in 3 bullet points.' },
        { name: 'Fix Code', text: 'Check this code for errors and optimize it.' },
        { name: 'Explain', text: 'Explain the previous answer like I am 5 years old.' }
      ];

      this.boot();
    }

    boot() {
      this.injectStyles();
      this.createMenu();
      this.bindKeys();
      this.observeDOM();
      console.log('[KKGPT] Loaded');
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        html, body {
          background: ${K.BG} !important;
          overflow: hidden !important;
          font-size: ${K.SCALING_FONT}px !important;
        }

        main {
          transform: none !important;
          width: 100% !important;
        }

        ${K.REMOVE.join(',')} {
          display: none !important;
        }

        article, [data-testid*="conversation-turn"] {
          background: #121212 !important;
          border: 2px solid #222 !important;
          border-radius: 20px !important;
          margin: 24px auto !important;
          width: 92% !important;
          padding: 32px !important;
        }

        .tzn-focus {
          outline: 6px solid ${K.ACCENT} !important;
          transform: scale(1.02);
          z-index: 9999;
        }

        #kk-menu {
          position: fixed;
          top: 0;
          left: -420px;
          width: 380px;
          height: 100%;
          background: rgba(5,5,5,0.97);
          border-right: 4px solid ${K.ACCENT};
          padding: 40px 24px;
          transition: 0.25s ease;
          z-index: 1000000;
        }

        #kk-menu.active {
          left: 0;
        }

        .kk-item {
          padding: 22px;
          margin-bottom: 18px;
          background: #1a1a1a;
          border-radius: 14px;
          color: white;
          text-align: center;
        }

        .kk-item:focus {
          background: #222;
        }

        #prompt-textarea {
          font-size: 1.5rem !important;
          background: #1a1a1a !important;
          color: white !important;
        }
      `;
      document.head.appendChild(style);
    }

    createMenu() {
      const menu = document.createElement('div');
      menu.id = 'kk-menu';
      menu.innerHTML = `<h2 style="color:${K.ACCENT};text-align:center;">KING KRISPY</h2>`;

      this.macros.forEach(m => {
        const el = document.createElement('div');
        el.className = 'kk-item';
        el.tabIndex = 0;
        el.textContent = m.name;
        el.onclick = () => this.sendPrompt(m.text);
        menu.appendChild(el);
      });

      document.body.appendChild(menu);
    }

    getFocusable() {
      return Array.from(
        document.querySelectorAll('button, textarea, a, [role="button"], .kk-item')
      ).filter(el =>
        el.offsetParent !== null &&
        el.getClientRects().length
      );
    }

    navigate(dir) {
      const els = this.getFocusable();
      if (!els.length) return;

      if (els.length !== this.lastLen) {
        this.idx = -1;
        this.lastLen = els.length;
      }

      this.idx = (this.idx + dir + els.length) % els.length;

      els.forEach(e => e.classList.remove('tzn-focus'));
      const target = els[this.idx];
      target.classList.add('tzn-focus');
      target.focus();
    }

    sendPrompt(text) {
      const input = document.querySelector('#prompt-textarea');
      if (!input) return;

      input.focus();

      const proto = Object.getPrototypeOf(input);
      const setter =
        Object.getOwnPropertyDescriptor(proto, 'value')?.set ||
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;

      if (!setter) return;

      setter.call(input, text);
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const trySend = () => {
        const btn =
          document.querySelector('[data-testid="send-button"]') ||
          document.querySelector('button[type="submit"]') ||
          document.querySelector('form button');

        if (!btn || btn.disabled) return setTimeout(trySend, 100);

        btn.click();
        this.toggleMenu(false);
      };

      trySend();
    }

    toggleMenu(force) {
      this.menuOpen = force !== undefined ? force : !this.menuOpen;
      document.getElementById('kk-menu')?.classList.toggle('active', this.menuOpen);
    }

    bindKeys() {
      window.addEventListener('keydown', e => {
        const k = e.keyCode || e.which;
        if (k === K.KEYS.UP) this.navigate(-1);
        else if (k === K.KEYS.DOWN) this.navigate(1);
        else if (k === K.KEYS.BLUE) this.toggleMenu();
        else if (k === K.KEYS.ENTER && !this.menuOpen) {
          document.querySelector('.tzn-focus')?.click();
        }
      });
    }

    observeDOM() {
      const clean = () => {
        K.REMOVE.forEach(sel => {
          document.querySelectorAll(sel).forEach(e => e.remove());
        });
      };

      clean();

      new MutationObserver(clean).observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  const wait = () => {
    if (!document.body || !document.querySelector('main')) {
      return setTimeout(wait, 100);
    }
    new KingKrispyGPT();
  };

  wait();
})();
