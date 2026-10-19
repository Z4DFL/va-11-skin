window.__ModuleLoader__.load({
  id: '@local/va11halla-skin',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // ------------------------------------------------------------------
    // Theme skin: alias-token override layer (light + dark), applied over
    // whatever built-in theme is active. Source id = package id.
    // ------------------------------------------------------------------
    const TOKENS = {
      '--dsw-alias-bg-base': { light: '#17141f', dark: '#17141f' },
      '--dsw-alias-bg-layer-1': { light: '#211c2d', dark: '#211c2d' },
      '--dsw-alias-bg-layer-2': { light: '#2b2539', dark: '#2b2539' },
      '--dsw-alias-bg-overlay': { light: '#342c46', dark: '#342c46' },
      '--dsw-alias-border-l1': { light: '#4b3d68', dark: '#4b3d68' },
      '--dsw-alias-border-l2': { light: '#6b5493', dark: '#6b5493' },
      '--dsw-alias-brand-primary': { light: '#ff2d8f', dark: '#ff2d8f' },
      '--dsw-alias-label-primary': { light: '#f2ecfa', dark: '#f2ecfa' },
      '--dsw-alias-label-secondary': { light: '#bfb2d4', dark: '#bfb2d4' },
      '--dsw-alias-state-error-primary': { light: '#ff3b5c', dark: '#ff3b5c' },
      '--dsw-alias-state-idle-primary': { light: '#8674a6', dark: '#8674a6' },
      '--dsw-alias-state-success-primary': { light: '#35e0e0', dark: '#35e0e0' },
      '--dsw-alias-state-warn-primary': { light: '#ffb020', dark: '#ffb020' },
      '--dsw-specific-sidebar-fill': { light: '#1a1624', dark: '#1a1624' },
    };

    // ------------------------------------------------------------------
    // Official character art (embedded; personal local theme use only).
    // ------------------------------------------------------------------
    const ART = {
      jill: 'data:image/webp;base64,__JILL__',
      dana: 'data:image/webp;base64,__DANA__',
      logo: 'data:image/webp;base64,__LOGO__',
    };

    const CSS = [
      "@font-face{font-family:'V11 Mono';font-style:normal;font-weight:400;font-display:swap;",
      "src:url(data:font/woff2;base64,__FONT__) format('woff2')}",
      '.v11-char-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}',
      '.v11-char{position:absolute;height:auto;image-rendering:pixelated;user-select:none;',
      '-webkit-mask-image:linear-gradient(to bottom,#000 94%,transparent 100%);',
      'mask-image:linear-gradient(to bottom,#000 94%,transparent 100%);',
      'animation:v11-bob 9s ease-in-out infinite alternate}',
      '.v11-char-dana{left:292px;bottom:0;width:280px}',
      '.v11-char-jill{right:-18px;bottom:0;width:280px;animation-delay:-3s}',
      '.v11-tagline{text-align:center;font-size:13px;line-height:18px;color:var(--dsw-alias-label-secondary);opacity:.8;',
      "letter-spacing:1.5px;font-family:'V11 Mono',ui-monospace,'Courier New',monospace;text-transform:uppercase;animation:v11-fadein .8s ease}",
      '@keyframes v11-bob{from{transform:translateY(0)}to{transform:translateY(-3px)}}',
      '@keyframes v11-fadein{from{opacity:0}to{opacity:.75}}',
      '.v11-signbar{position:absolute;top:9px;left:0;right:0;padding-left:270px;display:flex;justify-content:center;pointer-events:none;z-index:2}',
      '.v11-signbar-img{width:300px;height:auto;user-select:none;',
      'filter:drop-shadow(0 0 4px rgba(255,45,143,.9)) drop-shadow(0 0 14px rgba(255,45,143,.6))',
      'drop-shadow(0 0 34px rgba(255,45,143,.32)) drop-shadow(0 0 64px rgba(53,224,224,.16));',
      'animation:v11-neon 6s ease-in-out infinite}',
      '@keyframes v11-neon{0%,42%,56%,100%{opacity:1}45%{opacity:.82}48%{opacity:.97}50%{opacity:.88}53%{opacity:.99}}',
      '@media (max-width:1200px){.v11-char-dana{left:290px}.v11-char-dana,.v11-char-jill{width:232px}}',
      '@media (max-width:900px){.v11-char{opacity:.4}}',
      '@media (prefers-reduced-motion:reduce){.v11-char{animation:none}}',
    ].join('');

    // ------------------------------------------------------------------
    // Frame-wide characters: Dana left of the chat, Jill on the right.
    // ------------------------------------------------------------------
    function Characters() {
      return h('div', { className: 'v11-char-layer', 'aria-hidden': true },
        h('img', { className: 'v11-char v11-char-dana', src: ART.dana, alt: '' }),
        h('img', { className: 'v11-char v11-char-jill', src: ART.jill, alt: '' })
      );
    }

    // ------------------------------------------------------------------
    // Original game logo: centered above the conversation.
    // ------------------------------------------------------------------
    function SignBar() {
      return h('div', { className: 'v11-signbar', 'aria-hidden': true },
        h('img', { className: 'v11-signbar-img', src: ART.logo, alt: '' })
      );
    }

    // ------------------------------------------------------------------
    // Composer-dock tagline: one fixed bar quote.
    // ------------------------------------------------------------------
    function makeTagline(fallbackT) {
      return function Tagline(props) {
        const t = props.t || fallbackT;
        return h('div', { className: 'v11-tagline', 'aria-hidden': true }, t('tagline'));
      };
    }

    return {
      inject: ['slots', 'theme', 'locale'],
      apply(ctx) {
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/va11halla-skin';
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'va11halla: stylesheet');

        ctx.effect(() => ctx.locale.register('va11halla', {
          zh: {
            'tagline': 'Time to mix harness and change life',
          },
          en: {
            'tagline': 'Time to mix harness and change life',
          },
        }), 'va11halla: locale');

        ctx.effect(() => ctx.theme.overrideTokens('@local/va11halla-skin', TOKENS), 'va11halla: token skin');

        // Force the dark appearance so native controls, scrollbars and the
        // color-scheme metadata follow the skin as well.
        try {
          if (ctx.theme.getTheme().preference !== 'dark') ctx.theme.setTheme('dark');
        } catch { /* theme unavailable: the token layer still renders dark */ }

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'va11halla-scene', order: -10,
        }, Characters));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay', id: 'va11halla-signbar', order: -9,
        }, SignBar));

        const tagline = makeTagline(ctx.locale.bind('va11halla'));
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock', id: 'va11halla-tagline', order: 50, locale: 'va11halla',
        }, tagline));
      },
    };
  },
});
