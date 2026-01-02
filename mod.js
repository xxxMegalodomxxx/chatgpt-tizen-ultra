(function() {
    'use strict';
    const K = {
        SCALING: 1.45,
        ACCENT: '#10a37f',
        BG: '#050505',
        KEYS: { UP: 38, DOWN: 40, ENT: 13, BACK: 10009, BLUE: 406, YEL: 405, GRN: 404, RED: 403, PLAY: 415 },
        REMOVE: ['nav', 'aside', 'footer', 'header', '.sticky', 'button[aria-label="Settings"]']
    };
    class KingKrispyGpt {
        constructor() {
            this.idx = -1;
            this.isMenuOpen = false;
            this.macros = [
                { name: "Summarize", text: "Summarize this chat so far in 3 bullet points." },
                { name: "Fix Code", text: "Check this code for errors and optimize it." },
                { name: "Explain", text: "Explain the previous answer like I am a 5 year old." }
            ];
            this.init();
        }
        init() {
            this.injectStyles();
            this.createUI();
            this.setupListeners();
            this.startPerformanceGuard();
            console.log("GPT TIZEN ULTRA: KING KRISPY EDITION LOADED");
        }
        injectStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                html, body { background: ${K.BG} !important; overflow: hidden !important; font-size: 26px !important; }
                main { transform: scale(${K.SCALING}); transform-origin: top left; width: ${100/K.SCALING}vw !important; height: ${100/K.SCALING}vh !important; }
                ${K.REMOVE.join(',')}, [class*="sidebar"] { display: none !important; }
                article, [data-testid*="conversation-turn"] { background: #121212 !important; border: 2px solid #222 !important; border-radius: 20px !important; margin: 30px auto !important; width: 90% !important; padding: 35px !important; }
                .tzn-focus { outline: 8px solid ${K.ACCENT} !important; transform: scale(1.03); z-index: 10000; }
                #kk-menu { position: fixed; left: -450px; top: 0; width: 400px; height: 100%; background: rgba(5,5,5,0.98); border-right: 4px solid ${K.ACCENT}; z-index: 999999; padding: 50px 30px; transition: 0.3s; }
                #kk-menu.active { left: 0; }
                .m-item { padding: 25px; background: #1a1a1a; margin-bottom: 20px; border-radius: 15px; text-align: center; color: white; }
                .m-item:focus { border-color: ${K.ACCENT}; background: #222; }
                #prompt-textarea { font-size: 1.5rem !important; background: #1a1a1a !important; color: white !important; }
            `;
            document.head.appendChild(style);
        }
        createUI() {
            const menu = document.createElement('div');
            menu.id = 'kk-menu';
            menu.innerHTML = `<h2 style="color:${K.ACCENT}">KING KRISPY PANEL</h2>`;
            this.macros.forEach(m => {
                const div = document.createElement('div');
                div.className = 'm-item';
                div.tabIndex = 0;
                div.innerText = m.name;
                div.onclick = () => this.sendPrompt(m.text);
                menu.appendChild(div);
            });
            document.body.appendChild(menu);
        }
        getNavElements() { return Array.from(document.querySelectorAll('button, textarea, a, .m-item, [role="button"]')).filter(el => el.offsetParent !== null); }
        navigate(dir) {
            const els = this.getNavElements();
            if (!els.length) return;
            this.idx = (this.idx + dir + els.length) % els.length;
            els.forEach(e => e.classList.remove('tzn-focus'));
            const target = els[this.idx];
            target.classList.add('tzn-focus');
            target.focus();
        }
        sendPrompt(text) {
            const input = document.querySelector('#prompt-textarea');
            const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            setter.call(input, text);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            setTimeout(() => { document.querySelector('button[data-testid="send-button"]').click(); this.toggleMenu(false); }, 300);
        }
        toggleMenu(state) {
            this.isMenuOpen = state !== undefined ? state : !this.isMenuOpen;
            document.getElementById('kk-menu').classList.toggle('active', this.isMenuOpen);
        }
        setupListeners() {
            window.addEventListener('keydown', (e) => {
                const c = e.keyCode;
                if (c === K.KEYS.UP) this.navigate(-1);
                else if (c === K.KEYS.DOWN) this.navigate(1);
                else if (c === K.KEYS.BLUE) this.toggleMenu();
                else if (c === K.KEYS.ENT && !this.isMenuOpen) {
                    const f = document.querySelector('.tzn-focus');
                    if (f) f.click();
                }
            });
        }
        startPerformanceGuard() {
            setInterval(() => { K.REMOVE.forEach(s => { const el = document.querySelector(s); if(el) el.remove(); }); }, 3000);
        }
    }
    setTimeout(() => { new KingKrispyGpt(); }, 1500);
})();
