/**
 * StorePulse - Internationalization engine (EN / ES)
 *
 * How it works:
 *  - Translations live in translations/en.js and translations/es.js
 *    (global object window.STOREPULSE_I18N).
 *  - In the HTML, each translatable element carries a key:
 *      data-i18n="hero.title"                  -> replaces element content
 *      data-i18n-placeholder="form.x"          -> replaces placeholder attribute
 *      data-i18n-aria-label="nav.menuAria"     -> replaces aria-label attribute
 *      data-i18n-content="meta.description"    -> replaces content attribute (<meta>)
 *  - Buttons with data-lang="en" | "es" switch the active language.
 *  - The selected language is saved in localStorage across pages.
 *
 * Uses .js files instead of .json + fetch so the page also works
 * when opening index.html directly via the file:// protocol.
 */
(function () {
    'use strict';

    const STORAGE_KEY = 'storepulse.language';
    const DEFAULT_LANG = 'en';
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
            return null; // Private browsing or storage blocked
        }
    }

    function saveLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            /* No persistence: language is kept only for this visit */
        }
    }

    /** Returns the translated text for a key in the current language (with default-language fallback). */
    function t(key) {
        const dict = dictionaries[currentLang] || {};
        if (key in dict) return dict[key];
        const fallback = dictionaries[DEFAULT_LANG] || {};
        if (key in fallback) return fallback[key];
        console.warn('[i18n] Missing translation key:', key);
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

    function applyLanguage(lang) {
        if (!isSupported(lang)) lang = DEFAULT_LANG;
        currentLang = lang;
        document.documentElement.lang = lang;
        translatePage();
        updateSwitches();
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    /** Sets the language chosen by the user and stores the preference. */
    function setLanguage(lang) {
        applyLanguage(lang);
        saveLang(currentLang);
    }

    function init() {
        document.querySelectorAll('[data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
        });
        applyLanguage(readSavedLang() || DEFAULT_LANG);
    }

    // Public API for main.js and other pages
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