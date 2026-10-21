/**
 * StorePulse - Motor de internacionalización (ES / EN)
 *
 * Cómo funciona:
 *  - Los textos viven en translations/es.js y translations/en.js
 *    (objeto global window.STOREPULSE_I18N).
 *  - En el HTML, cada elemento traducible lleva una clave:
 *      data-i18n="hero.title"                  -> reemplaza el contenido del elemento
 *      data-i18n-placeholder="form.x"          -> reemplaza el atributo placeholder
 *      data-i18n-aria-label="nav.menuAria"     -> reemplaza el atributo aria-label
 *      data-i18n-content="meta.description"    -> reemplaza el atributo content (<meta>)
 *  - Los botones con data-lang="es" | "en" cambian el idioma.
 *  - El idioma elegido se guarda en localStorage y se reutiliza en todas las páginas.
 *
 * Se usan archivos .js (y no .json + fetch) para que la página funcione también
 * abriendo index.html con doble clic (protocolo file://).
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'storepulse-lang';
    const DEFAULT_LANG = 'es';
    const dictionaries = window.STOREPULSE_I18N || {};
    const ATTRIBUTES = ['placeholder', 'aria-label', 'content', 'title'];

    let currentLang = DEFAULT_LANG;

    function isSupported(lang) {
        return Object.prototype.hasOwnProperty.call(dictionaries, lang);
    }

    function readSavedLang() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null; // navegación privada o almacenamiento bloqueado
        }
    }

    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            /* sin persistencia: el idioma se mantiene solo en esta visita */
        }
    }

    /** Devuelve el texto de una clave en el idioma actual (con respaldo en español). */
    function t(key) {
        const dict = dictionaries[currentLang] || {};
        if (key in dict) return dict[key];
        const fallback = dictionaries[DEFAULT_LANG] || {};
        if (key in fallback) return fallback[key];
        console.warn('[i18n] Clave sin traducir:', key);
        return key;
    }

    function translatePage(root) {
        const scope = root || document;

        scope.querySelectorAll('[data-i18n]').forEach((el) => {
            const value = t(el.getAttribute('data-i18n'));
            if (el.tagName === 'TITLE') {
                el.textContent = value;
            } else {
                el.innerHTML = value;
            }
        });

        ATTRIBUTES.forEach((attr) => {
            scope.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
                el.setAttribute(attr, t(el.getAttribute(`data-i18n-${attr}`)));
            });
        });
    }

    function updateSwitches() {
        document.querySelectorAll('[data-lang]').forEach((btn) => {
            const active = btn.getAttribute('data-lang') === currentLang;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
    }

    function setLanguage(lang) {
        if (!isSupported(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        document.documentElement.lang = lang;
        translatePage();
        updateSwitches();
        saveLang(lang);
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    function init() {
        document.querySelectorAll('[data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
        });
        setLanguage(readSavedLang() || DEFAULT_LANG);
    }

    // API pública para main.js y otras páginas
    window.i18n = {
        t,
        setLanguage,
        getLanguage: () => currentLang
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();