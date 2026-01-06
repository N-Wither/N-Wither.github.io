export namespace MiscUtils {
    const circular = crypto.randomUUID();
    let stylesheetAdded = false;

    function addStylesheetForDetails() {
        let styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(`
details .null {
    color: #C33335;
}
details .number {
    color: #2675B5;
}
details .string {
    color: #DC4E35;
}
details .array {
    color: gray;
}
details .func {
    color: #B24695;
}
details .bool {
    color: #359C79;
}`);
        document.adoptedStyleSheets.push(styleSheet);
        stylesheetAdded = true;
    }

    export function objectToDetails(o: any, summary = o.constructor.name, isFirst = false, maxLength = Infinity) {
        if (stylesheetAdded == false) {
            addStylesheetForDetails();
        }

        function isArrayLike(obj: any) {
            if (obj === null || typeof obj != 'object') return false;
            if (Array.isArray(obj)) return true;
            if (obj instanceof HTMLAllCollection) return true;

            return Boolean(obj.length && obj[Symbol.iterator]);
        }

        if (isArrayLike(o)) {
            summary += ` <span class="array">${o.constructor.name}(${o.length})</span>`;
        }

        let str = `<details><summary>${summary}</summary>`;
        let entries = Object.entries(o).map(([k, v]) => (o[k] === o ? [k, circular] : [k, v])) as [string, any][];

        // Handle special case for non-plain objects, Window is specially treated because reading window.constructor may throw SecurityError
        if (o instanceof Window) {
            if (isFirst == false) {
                return `<div>${summary}: <span class="array">Window</span></div>`;
            }
        } else if (
            typeof o == 'object' &&
            o != null &&
            Object.getPrototypeOf(o)?.constructor != Object &&
            isFirst == false &&
            !isArrayLike(o)
        ) {
            return `<div>${summary}: <span class="array">${Object.getPrototypeOf(o)?.constructor.name}</span></div>`;
        }

        if (isArrayLike(o)) {
            (entries as unknown as [any, any]).sort((a, b) => a - b);
        } else if (typeof o == 'object' && o != null) {
            entries.sort((a, b) => a[0].localeCompare(b[0]));
        }

        for (let i = 0; i < Math.min(maxLength, entries.length); i++) {
            let [k, v] = entries[i];
            if (typeof v != 'object' || v == null) {
                let value = '';
                if (v === null) {
                    value = '<span class="null">null</span>';
                } else if (v === undefined) {
                    value = '<span class="null">undefined</span>';
                } else if (typeof v == 'boolean') {
                    value = `<span class="bool">${v}</span>`;
                } else if (typeof v == 'number' || isNaN(Number(v)) == false) {
                    value = `<span class="number">${v}</span>`;
                } else if (typeof v == 'string') {
                    if (v == circular) {
                        value = `<span class="array">[CIRCULAR ${o[k].constructor.name}]</span>`;
                    } else value = `<span class="string">${v}</span>`;
                } else if (typeof v == 'function') {
                    value = `<span class="func">[Function ${v.name == '' ? '&lt;ANONYMOUS&gt;' : v.name}]</span>`;
                }
                str += `<div>${k}: ${value}</div>`;
            } else {
                str += objectToDetails(v, k);
            }
        }

        if (entries.length == 0) {
            str += '<span class="array">[NO OWN PROPERTIES]</span>';
        }

        if (entries.length > maxLength) {
            str += `<span class="array" style="font-style: italic;">+${entries.length - 100} more...</span>`;
        }

        str += '</details>';
        return str;
    }
}
