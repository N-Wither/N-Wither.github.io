/// <reference path="./dom.d.ts" />

import { StringUtils } from './string.js';
import { TypeUtils } from './type.js';

/**
 * @overload
 * @param {string} tagName
 * @param {any} content
 * @returns {DomUtils._ElementWrapper}
 */
/**
 * @overload
 * @param {Element} element
 * @returns {DomUtils._ElementWrapper}
 */
function createElement(tagName, content) {
    return new DomUtils._ElementWrapper(tagName, content);
}

/**
 *
 * @param {string} selector
 * @param {boolean} [unwrap = false]
 * @param {Node} from
 * @returns
 */
function select(selector, unwrap = false, from = document) {
    TypeUtils.checkWithError(from, Node, 'Param 3 ("from") is invalid.')
    if (typeof selector === 'string') {
        let el = from.querySelector(selector);
        if (el == null) {
            return null;
        } else {
            return unwrap == true ? el : new DomUtils._ElementWrapper(el);
        }
    } else if (typeof selector === 'object') {
        if (selector instanceof Document) {
            return document;
        } else if (selector instanceof HTMLElement) {
            return unwrap == true ? selector : new DomUtils._ElementWrapper(selector);
        }
    } else throw new TypeError('Invalid selector.');
}

/**
 *
 * @param {string} selector
 * @param {boolean} [unwrap = false]
 * @param {Node} from
 * @returns
 */
function selectAll(selector, unwrap = false, from = document) {
    TypeUtils.checkWithError(from, Node, 'Param 3 ("from") is invalid.')
    let list = from.querySelectorAll(selector);
    if (list.length == 0) {
        return null;
    } else {
        if (unwrap == true) {
            return list;
        } else {
            return Array.from(list).map(el => new DomUtils._ElementWrapper(el));
        }
    }
}

/**
 * Get all elements in specified node.
 * @overload
 * @param {Node} from
 * @param {{allowShadowRoot?: boolean, unwrap?: false}} options
 * @returns {DomUtils._ElementWrapper[]}
 */
/**
 * @overload
 * @param {Node} from
 * @param {{allowShadowRoot?: boolean, unwrap?: true}} options
 * @returns {Element[]}
 */
function getAllElements(from = document.body, options = { allowShadowRoot: false, unwrap: false }) {
    TypeUtils.checkWithError(from, Node, 'Param 1 ("from") is invalid.');
    TypeUtils.checkWithError(options, 'object', 'Param 2 ("options") is invalid.');
    let walker = document.createTreeWalker(from, NodeFilter.SHOW_ELEMENT, null);
    let elements = [];
    let defaultOptions = { allowShadowRoot: false, unwrap: false };
    options = Object.assign(defaultOptions, options);

    if (from.shadowRoot != null && options.allowShadowRoot == true) {
        elements.push(...getAllElements(from.shadowRoot, options));
    }

    while (walker.nextNode()) {
        let c = walker.currentNode;

        elements.push(options.unwrap == true ? c : createElement(c));

        if (c.shadowRoot != null && options.allowShadowRoot == true) {
            elements.push(...getAllElements(c.shadowRoot, options));
        }
    }

    return elements;
}

/**
 * Just like `querySelector`, but it will also search in the shadowRoot of the element (if exists).
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {{all?: false, unwrap?: false}} options
 * @returns {DomUtils._ElementWrapper | null}
 */
/**
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {{all?: true, unwrap?: false}} options
 * @returns {DomUtils._ElementWrapper[]}
 */
/**
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {{all?: false, unwrap?: true}} options
 * @returns {Element | null}
 */
/**
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {{all?: true, unwrap?: true}} options
 * @returns {Element[]}
 */
function deepSelect(selector, from = document, options = { all: false, unwrap: false }) {
    TypeUtils.checkWithError(from, Node, 'Param 2 ("from") is invalid.');
    TypeUtils.checkWithError(selector, 'string', 'Param 1 ("selector") is invalid.');

    let defaultOptions = { all: false, unwrap: false };
    options = Object.assign(defaultOptions, options);

    let elements = getAllElements(from, { allowShadowRoot: true, unwrap: true });
    let result = options.all == true ? [] : null;

    for (let el of elements) {
        if (el.matches(selector) == true) {
            if (options.all == true) {
                options.unwrap == true ? result.push(el) : result.push(createElement(el));
            } else {
                options.unwrap == true ? (result = el) : (result = createElement(el));
                break;
            }
        }
    }

    return result;
}

/**
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {false} unwrap
 * @returns {DomUtils._ElementWrapper[]}
 */
/**
 * @overload
 * @param {string} selector
 * @param {Node} from
 * @param {true} unwrap
 * @returns {Element[]}
 */
function deepSelectAll(selector, from = document, unwrap = false) {
    return deepSelect(selector, from, { all: true, unwrap: unwrap });
}

class ElementWrapper {
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
        } else if (tagName instanceof ElementWrapper) {
            this.element = tagName.element;
        }

        if (content != undefined) {
            if (Array.isArray(content)) {
                content.forEach(item => ElementWrapper.#append(this.element, item));
            } else {
                ElementWrapper.#append(this.element, content);
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
        } else if (item instanceof ElementWrapper) {
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

    /**
     *
     * @param {ElementWrapper | string | Node} element
     */
    static #parseElement(element) {
        if (element instanceof ElementWrapper) {
            return element.element;
        } else if (typeof element === 'string') {
            return document.querySelector(element);
        } else if (element instanceof Node) {
            return element;
        } else {
            return null;
        }
    }

    /**@type {HTMLElement} */
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
     * @returns {ElementWrapper}
     */
    /**
     * @overload
     * @param {string} name
     * @param {string} value
     * @returns {ElementWrapper}
     */
    css(nameOrMap, value) {
        if (typeof nameOrMap === 'string') {
            this.element.style.setProperty(nameOrMap, value);
        } else if (typeof nameOrMap === 'object') {
            Object.keys(nameOrMap).forEach(key => {
                if (typeof key === 'string') {
                    this.element.style.setProperty(StringUtils.camelToKebab(key), nameOrMap[key]);
                } else {
                    try {
                        let keyStr = String(key);
                        this.element.style.setProperty(StringUtils.camelToKebab(keyStr), nameOrMap[key]);
                    } catch {
                        console.warn('The key of the CSS map is invalid, skipped.');
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
        ElementWrapper.#append(this.element, child);
        return this;
    }

    /**
     *
     * @param {ElementWrapper | string | Node} sibling
     * @returns
     */
    insertBefore(sibling) {
        let target = ElementWrapper.#parseElement(sibling);
        if (target == null) {
            throw new TypeError('Invalid sibling.');
        }

        let parent = target.parentNode;
        if (parent == null) {
            document.body.appendChild(this.element);
        } else {
            parent.insertBefore(this.element, target);
        }

        return this;
    }

    /**
     *
     * @param {ElementWrapper | string | Node} sibling
     * @returns
     */
    insertAfter(sibling) {
        /**@type {Node} */
        let target = ElementWrapper.#parseElement(sibling);
        if (target == null) {
            throw new TypeError('Invalid sibling.');
        }

        let parent = target.parentNode;
        if (parent == null) {
            document.body.appendChild(this.element);
        } else {
            parent.insertBefore(this.element, target.nextSibling);
        }

        return this;
    }

    /**
     * @param {string} html
     * @returns
     */
    html(html) {
        this.element.innerHTML = html;
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

    remove() {
        this.element.remove();
    }

    /**
     *
     * @param {ElementWrapper | string | Node} parent
     * @returns
     */
    isChildOf(parent) {
        parent = ElementWrapper.#parseElement(parent);
        if (parent == null) {
            throw new TypeError('Invalid parent.');
        }

        return parent.contains(this.element);
    }

    /**
     *
     * @param {ElementWrapper | string | Node} sibling
     * @returns
     */
    isFollowedBy(sibling) {
        sibling = ElementWrapper.#parseElement(sibling);
        if (sibling == null) {
            throw new TypeError('Invalid sibling.');
        }

        return this.element.nextElementSibling === sibling;
    }

    /**
     * @returns {ElementWrapper | null}
     */
    get previous() {
        let previous = this.element.previousElementSibling;
        if (previous == null) {
            return null;
        } else return new ElementWrapper(previous);
    }

    /**
     * @returns {ElementWrapper | null}
     */
    get next() {
        let next = this.element.nextElementSibling;
        if (next == null) {
            return null;
        } else return new ElementWrapper(next);
    }

    /**
     * @returns {ElementWrapper | null}
     */
    get parent() {
        let parent = this.element.parentNode;
        if (parent == null) {
            return null;
        } else return new ElementWrapper(parent);
    }

    select(selector, unwrap = false) {
        return select(selector, unwrap, this.element);
    }

    selectAll(selector, unwrap = false) {
        return selectAll(selector, unwrap, this.element);
    }
}

export class DomUtils {
    static _ElementWrapper = ElementWrapper;

    /**
     * Visual effects for your elements.
     */
    static FX = {
        /**
         *
         * @param {DomUtils._ElementWrapper | HTMLElement | string} element
         * @returns {Animation}
         */
        shake: element => {
            let target;
            if (element instanceof DomUtils._ElementWrapper) {
                target = element.element;
            } else if (element instanceof HTMLElement) {
                target = element;
            } else if (typeof element === 'string') {
                target = DomUtils.createElement(element).element;
            } else {
                throw new TypeError('Invalid element.');
            }

            return target.animate(
                [
                    { transform: 'translate(0)' },
                    { transform: 'translate(-10px, -10px)' },
                    { transform: 'translate(10px, 10px)' },
                    { transform: 'translate(-10px, 10px)' },
                    { transform: 'translate(10px, -10px)' },
                    { transform: 'translate(0)' },
                ],
                {
                    duration: 200,
                }
            );
        },
    };

    static createElement = createElement;
    static select = select;
    static selectAll = selectAll;
    static getAllElements = getAllElements;
    static deepSelect = deepSelect;
    static deepSelectAll = deepSelectAll;
}

export { createElement, select, selectAll, getAllElements, deepSelect, deepSelectAll };
