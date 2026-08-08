document.querySelectorAll('.cp-layout').forEach((root) => initColorPalette(root));

function initColorPalette(root) {

    function hexToRgb(hex) {
        const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (!m) return null;
        return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    function relativeLuminance({ r, g, b }) {
        const channel = (c) => {
            c /= 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    }

    function contrastRatio(hex1, hex2) {
        const rgb1 = hexToRgb(hex1);
        const rgb2 = hexToRgb(hex2);
        if (!rgb1 || !rgb2) return null;

        const l1 = relativeLuminance(rgb1);
        const l2 = relativeLuminance(rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    const basePicker = root.querySelector('.cp-base-picker');
    const baseHex = root.querySelector('.cp-base-hex');
    const scaleEl = root.querySelector('.cp-scale');

    const scaleSteps = [
        { label: '50', l: 95 }, { label: '100', l: 90 }, { label: '200', l: 80 },
        { label: '300', l: 70 }, { label: '400', l: 60 }, { label: '500', l: 50 },
        { label: '600', l: 40 }, { label: '700', l: 30 }, { label: '800', l: 20 },
        { label: '900', l: 10 },
    ];

    function renderScale() {
        const hex = baseHex.value;
        const rgb = hexToRgb(hex);
        if (!rgb) return;

        const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);

        scaleEl.innerHTML = '';
        scaleSteps.forEach(step => {
            const stepRgb = hslToRgb(h, s, step.l);
            const stepHex = rgbToHex(stepRgb.r, stepRgb.g, stepRgb.b);

            const swatch = document.createElement('div');
            swatch.className = 'cp-swatch';
            swatch.style.background = stepHex;
            swatch.innerHTML = `<span class="cp-swatch-label">${step.label}</span><span class="cp-swatch-hex">${stepHex}</span>`;
            swatch.addEventListener('click', () => navigator.clipboard.writeText(stepHex));
            scaleEl.appendChild(swatch);
        });
    }

    basePicker.addEventListener('input', () => { baseHex.value = basePicker.value; renderScale(); });
    baseHex.addEventListener('input', () => {
        if (hexToRgb(baseHex.value)) { basePicker.value = baseHex.value; renderScale(); }
    });

    renderScale();

    const fgPicker = root.querySelector('.cp-fg-picker');
    const fgHex = root.querySelector('.cp-fg-hex');
    const bgPicker = root.querySelector('.cp-bg-picker');
    const bgHex = root.querySelector('.cp-bg-hex');
    const sample = root.querySelector('.cp-contrast-sample');
    const ratioEl = root.querySelector('.cp-contrast-ratio');
    const badgeEl = root.querySelector('.cp-contrast-badge');

    function updateContrast() {
        const fg = fgHex.value;
        const bg = bgHex.value;
        const ratio = contrastRatio(fg, bg);

        if (ratio === null) return;

        sample.style.color = fg;
        sample.style.background = bg;
        ratioEl.textContent = ratio.toFixed(2) + ':1';

        let badge, cls;
        if (ratio >= 7) { badge = 'AAA'; cls = 'cp-badge-pass'; }
        else if (ratio >= 4.5) { badge = 'AA'; cls = 'cp-badge-pass'; }
        else if (ratio >= 3) { badge = 'AA Large only'; cls = 'cp-badge-warn'; }
        else { badge = 'Fail'; cls = 'cp-badge-fail'; }

        badgeEl.textContent = badge;
        badgeEl.className = 'cp-contrast-badge ' + cls;
    }

    fgPicker.addEventListener('input', () => { fgHex.value = fgPicker.value; updateContrast(); });
    fgHex.addEventListener('input', () => { if (hexToRgb(fgHex.value)) { fgPicker.value = fgHex.value; updateContrast(); } });
    bgPicker.addEventListener('input', () => { bgHex.value = bgPicker.value; updateContrast(); });
    bgHex.addEventListener('input', () => { if (hexToRgb(bgHex.value)) { bgPicker.value = bgHex.value; updateContrast(); } });

    updateContrast();

    const convertHex = root.querySelector('.cp-convert-hex');
    const convertRgb = root.querySelector('.cp-convert-rgb');
    const convertHsl = root.querySelector('.cp-convert-hsl');

    function updateConvert() {
        const rgb = hexToRgb(convertHex.value);
        if (!rgb) return;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        convertRgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        convertHsl.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    convertHex.addEventListener('input', updateConvert);
    updateConvert();
}