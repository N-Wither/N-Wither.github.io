/**
 * @param {string} tagName
 * @param {any} content
 */
function createElement(tagName, content) {
    return new DOMUtils._BetterElementWrapper(tagName, content);
}

/**
 *
 * @param {string} selector
 * @param {boolean} [unwrap = false]
 * @returns
 */
function select(selector, unwrap = false) {
    let el = document.querySelector(selector);
    if (el == null) {
        return null;
    } else {
        if (unwrap == true) {
            return el;
        } else {
            return new DOMUtils._BetterElementWrapper(el);
        }
    }
}

/**
 *
 * @param {string} selector
 * @param {boolean} [unwrap = false]
 * @returns
 */
function selectAll(selector, unwrap = false) {
    let list = document.querySelectorAll(selector);
    if (list.length == 0) {
        return null;
    } else {
        if (unwrap == true) {
            return list;
        } else {
            return Array.from(list).map(el => new DOMUtils._BetterElementWrapper(el));
        }
    }
}

export class DOMUtils {
    static _BetterElementWrapper = class BetterElementWrapper {
        /**
         * @overload
         * @param {string} tagName
         * @param {any} content
         */
        /**
         * @overload
         * @param {Element} element
         */
        constructor(tagName, content = undefined) {
            if (typeof tagName === 'string') {
                this.element = document.createElement(tagName);
            } else if (tagName instanceof HTMLElement) {
                this.element = tagName;
            }

            if (content != undefined) {
                if (Array.isArray(content)) {
                    content.forEach(item => BetterElementWrapper.#append(this.element, item));
                } else {
                    BetterElementWrapper.#append(this.element, content);
                }
            }
        }

        /**
         *
         * @param {Node} target
         * @param {any} item
         */
        static #append(target, item) {
            if (typeof item === 'string') {
                let textNode = new Text(item);
                target.appendChild(textNode);
            } else if (item instanceof Node) {
                target.appendChild(item);
            } else if (item instanceof BetterElementWrapper) {
                target.appendChild(item.element);
            } else {
                try {
                    let textNode = new Text(String(item));
                    target.appendChild(textNode);
                } catch {
                    throw new TypeError('Invalid content.');
                }
            }
        }

        element;

        get() {
            return this.element;
        }

        /**
         *
         * @param {string} name
         * @param {string} value
         * @returns 
         */
        attr(name, value) {
            if (value === null) {
                this.element.removeAttribute(name);
            } else {
                this.element.setAttribute(name, value);
            }
            return this;
        }

        /**
         *
         * @param {string} name
         * @param {any} value
         */
        prop(name, value) {
            this.element[name] = value;
            return this;
        }

        /**
         * @overload
         * @param {object} map
         * @returns {BetterElementWrapper}
         */
        /**
         * @overload
         * @param {string} name
         * @param {string} value
         * @returns {BetterElementWrapper}
         */
        css(nameOrMap, value) {
            if (typeof nameOrMap === 'string') {
                this.element.style.setProperty(nameOrMap, value);
            } else if (typeof nameOrMap === 'object') {
                Object.keys(nameOrMap).forEach(key => {
                    if (typeof key === 'string') {
                        this.element.style.setProperty(key, nameOrMap[key]);
                    } else {
                        try {
                            let keyStr = String(key);
                            this.element.style.setProperty(keyStr, nameOrMap[key]);
                        } catch {
                            throw new TypeError(`The type of key ${key} is invalid.`);
                        }
                    }
                });
            } else {
                throw new TypeError('Invalid argument type');
            }

            return this;
        }

        /**
         *
         * @param  {...string} className
         * @returns
         */
        class(...className) {
            this.element.classList.add(...className);
            return this;
        }

        /**
         *
         * @param {string | Node} parent
         */
        appendTo(parent) {
            if (typeof parent === 'string') {
                let target = document.querySelector(parent);
                if (target == null) {
                    throw new Error('Parent not found.');
                } else {
                    target.appendChild(this.element);
                }
            } else if (parent instanceof Node) {
                parent.appendChild(this.element);
            } else {
                throw new TypeError('Invalid parent.');
            }

            return this;
        }

        /**
         *
         * @param {string | Node} child
         */
        append(child) {
            BetterElementWrapper.#append(this.element, child);
            return this;
        }

        /**
         * @param {string} event
         * @param {EventListenerOrEventListenerObject | null} callback
         * @param {boolean | AddEventListenerOptions | undefined} options
         * @returns
         */
        on(event, callback, options) {
            this.element.addEventListener(event, callback, options);
            return this;
        }
    };

    static createElement = createElement;
    static select = select;
    static selectAll = selectAll;
}

export { createElement, select, selectAll };