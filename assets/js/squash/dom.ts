/* eslint-disable @typescript-eslint/no-namespace */
/** Cache map for queried elements */
const queriedElements = new Map<string, Element>()

export type sQuashDomTarget = Element | DomWrapper<Element> | string | DocumentFragment
export type sQuashDomContent = sQuashDomTarget | sQuashDomTarget[]
type ArrayAble<T> = ArrayLike<T> | Iterable<T>

function parseDomTarget(t: sQuashDomTarget): ParentNode | null {
  if (typeof t == 'string') {
    return document.querySelector(t)
  } else if (t instanceof Element || t instanceof DocumentFragment) {
    return t
  } else if (t instanceof DomWrapper) {
    return t.get()
  } else {
    throw new TypeError('Invalid target: ' + t)
  }
}

/**
 * Invalid targets will be ignored.
 * @param c
 */
function parseDomContent(c: sQuashDomContent): Node[] {
  const content = Array.isArray(c) ? c : [c]
  return content
    .map((el) => (typeof el == 'string' ? new Text(el) : el instanceof DomWrapper ? el.get() : el instanceof Element ? el : null))
    .filter((e) => e != null)
}

export class DomWrapper<T extends Element = Element> {
  private readonly element: T
  constructor(e: T) {
    this.element = e
  }

  static #clearElement =
    typeof Element.prototype.replaceChildren == 'function'
      ? function (e: Element) {
          e.replaceChildren()
        }
      : function (e: Element) {
          while (e.firstChild) {
            e.removeChild(e.firstChild)
          }
        }

  /** Unwrap the element. */
  get(): T {
    return this.element
  }

  /** Get or set a property. */
  prop<P extends keyof T>(name: P): T[P]
  prop<P extends keyof T>(name: P, value: T[P]): this
  prop(name: string, value: unknown): this
  prop<P extends keyof T>(name: P, value?: T[P]): T[P] | this {
    if (arguments.length == 1) {
      return this.element[name]
    } else {
      this.element[name] = value!
      return this
    }
  }

  /** Get an attribute. */
  attr(name: string): string | null
  /** Set an attribute. */
  attr(name: string, value: string): this
  /** Remove an attribute. */
  attr(name: string, value: null): this
  attr(name: string, value?: string | null): string | null | this {
    if (value === undefined) {
      return this.element.getAttribute(name)
    } else if (value === null) {
      this.element.removeAttribute(name)
      return this
    } else {
      this.element.setAttribute(name, value)
      return this
    }
  }

  removeAttr(name: string): this {
    this.element.removeAttribute(name)
    return this
  }

  class(): string
  class(className: string): this
  class(className?: string): string | this {
    if (className == undefined) {
      return this.element.className
    } else {
      this.element.className = className
      return this
    }
  }

  addClass(className: string): this {
    this.classList.add(className)
    return this
  }
  removeClass(className: string): this {
    this.classList.remove(className)
    return this
  }
  toggleClass(className: string): this {
    this.classList.toggle(className)
    return this
  }
  replaceClass(className: string, newClassName: string): this {
    this.classList.replace(className, newClassName)
    return this
  }

  /** Append another child to self. */
  append(element: Node | DomWrapper<Element>): this {
    const e = element instanceof DomWrapper ? element.get() : element
    this.element.appendChild(e)
    return this
  }

  /**
   * Append the element to other element.
   * @param target default: `document.body`
   * @returns
   */
  appendTo(target: sQuashDomTarget = document.body): this {
    parseDomTarget(target)?.appendChild(this.element)
    return this
  }

  /** Short-hand for `addEventLitsener` */
  on<E extends keyof HTMLElementEventMap>(event: E, handler: (this: T, ev: HTMLElementEventMap[E]) => void): this
  on(event: string, handler: EventListenerOrEventListenerObject): this {
    this.element.addEventListener(event, handler as EventListenerOrEventListenerObject)
    return this
  }

  /** Get or set the `textContent` of the element. */
  text(): string
  text(text: string): this
  text(text?: string): string | this {
    if (text === undefined) {
      return this.element.textContent
    } else {
      this.element.textContent = text
      return this
    }
  }

  /** Get or set the `innerHTML` of the element. */
  html(): string
  html(html: string): this
  html(html?: string): string | this {
    if (html === undefined) {
      return this.element.innerHTML
    } else {
      this.element.innerHTML = html
      return this
    }
  }

  clear(): this {
    DomWrapper.#clearElement(this.element)
    return this
  }

  insertBefore(element: sQuashDomTarget): void {
    const e = parseDomTarget(element)
    if (e) {
      if (e.parentNode) {
        e.parentNode.insertBefore(this.element, e)
      }
    }
  }

  insertAfter(element: sQuashDomTarget): void {
    const e = parseDomTarget(element)
    if (e && e.parentNode) {
      if (e.nextSibling) {
        e.parentNode.insertBefore(this.element, e.nextSibling)
      }
    }
  }

  replaceWith(element: Element | DomWrapper<Element>): this {
    this.element.replaceWith(element instanceof DomWrapper ? element.get() : element)
    return this
  }

  select<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>
  select<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>
  select(selector: string): DomWrapper<Element>
  select(selector: string): DomWrapper<Element> {
    return DomUtils.select(selector, this.element)
  }

  $ = this.select

  selectAll<T extends keyof HTMLElementTagNameMap>(selector: T): DomWrapper<HTMLElementTagNameMap[T]>[]
  selectAll<T extends keyof SVGElementTagNameMap>(selector: T): DomWrapper<SVGElementTagNameMap[T]>[]
  selectAll(selector: string): DomWrapper<Element>[]
  selectAll(selector: string): DomWrapper<Element>[] {
    return DomUtils.selectAll(selector, this.element)
  }

  $$ = this.selectAll

  style(): CSSStyleDeclaration
  style(css: { [property: string]: string }): this
  style(css?: { [property: string]: string }): CSSStyleDeclaration | this {
    if (css === undefined) {
      if ('style' in this.element) {
        return this.element.style as CSSStyleDeclaration
      } else {
        throw new TypeError('The wrapped element is not a HTMLElement!')
      }
    } else {
      if (this.element instanceof HTMLElement) {
        Object.entries(css).forEach(([k, v]) => {
          //@ts-ignore in this case the element is a HTMLElement, so style exists.
          const style: CSSStyleDeclaration = this.element.style
          style.setProperty(k, v)
        })
      }
      return this
    }
  }

  remove(): this {
    this.element.remove()
    return this
  }

  clone(deep = true): DomWrapper {
    return new DomWrapper(this.element.cloneNode(deep) as Element)
  }

  get classList(): DOMTokenList {
    return this.element.classList
  }
  get className(): string {
    return this.element.className
  }
  set className(c) {
    this.element.className = c
  }
  get id(): string {
    return this.element.id
  }
  set id(id) {
    this.element.id = id
  }
  /**
   * @throws {TypeError} if the wrapped element is not an `<input>` element.
   */
  get validValue(): string | number {
    if (this.element instanceof HTMLInputElement) {
      switch (this.element.type) {
        case 'number': {
          const max = Number(this.element.max)
          const min = Number(this.element.min)
          const step = Number(this.element.step) || 1
          let value = this.element.valueAsNumber
          value = Number.parseInt((value / step).toString())
          value = value > max ? max : value < min ? min : value
          return Number.isNaN(value) ? min : value
        }
        case 'text': {
          const max = this.element.maxLength
          return this.element.value.slice(max)
        }
        default: {
          return this.element.value
        }
      }
    } else throw new TypeError('The wrapped element is not an <input> element!')
  }
}

/**
 * An extended array of DomWrappers for bulk operation.
 */
export class DomWrapperArray<T extends Element> extends Array<DomWrapper<T>> {
  constructor() {
    super()
  }

  /**
   * Converts a regular array (or any other iterable set) of `DomWrappers` or `Element` to `DomWrapperArray`.
   */
  static override from<E extends Element>(arr: ArrayAble<DomWrapper<E> | E>): DomWrapperArray<E> {
    const result: DomWrapperArray<E> = new DomWrapperArray()
    for (const w of Array.from(arr).map((e) => (e instanceof DomWrapper ? e.get() : e))) {
      result.push(new DomWrapper(w))
    }
    return result
  }

  override filter(predicate: (value: DomWrapper<T>, index: number, array: DomWrapper<T>[]) => unknown, thisArg?: unknown): DomWrapperArray<T> {
    return DomWrapperArray.from(super.filter(predicate, thisArg))
  }

  on<E extends keyof HTMLElementEventMap>(ev: E, listener: (this: T, ev: HTMLElementEventMap[E]) => void): this {
    this.forEach((e) => {
      e.on(ev, listener)
    })
    return this
  }

  remove(): this {
    this.forEach((wrapper) => {
      wrapper.remove()
    })
    return this
  }

  class(className: string): this {
    for (const w of this) {
      w.class(className)
    }
    return this
  }

  addClass(className: string): this {
    for (const w of this) {
      w.classList.add(className)
    }
    return this
  }

  toggleClass(className: string): this {
    for (const w of this) {
      w.classList.toggle(className)
    }
    return this
  }

  removeClass(className: string): this {
    for (const w of this) {
      w.classList.remove(className)
    }
    return this
  }

  attr(name: string, value: string): this {
    for (const w of this) {
      w.attr(name, value)
    }
    return this
  }

  removeAttr(name: string): this {
    for (const w of this) {
      w.attr(name, null)
    }
    return this
  }
}

/**
 * A set of DOM-related utility functions.
 */
export namespace DomUtils {
  export const DOMWrapper = DomWrapper
  export const DOMWrapperArray = DomWrapperArray
  export function select<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>
  export function select<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>
  export function select(selector: string, from?: sQuashDomTarget): DomWrapper<Element>
  export function select(selector: string, from?: sQuashDomTarget): DomWrapper<Element> {
    const source = from == undefined ? document : (parseDomTarget(from) ?? document)
    const e = source.querySelector(selector)
    if (e) {
      return new DomWrapper(e)
    } else {
      throw new Error(`Failed to select element with selector "${selector}`)
    }
  }

  export const $ = select

  export function create<T extends keyof HTMLElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<HTMLElementTagNameMap[T]>
  export function create<T extends keyof SVGElementTagNameMap>(element: T, content?: sQuashDomContent): DomWrapper<SVGElementTagNameMap[T]>
  export function create(element: string, content?: sQuashDomContent): DomWrapper<Element>
  export function create(element: string, content?: sQuashDomContent): DomWrapper<Element> {
    const e = document.createElement(element) as Element
    if (content) {
      const c = parseDomContent(content)
      e.append(...c)
    }
    return new DomWrapper(e)
  }

  export const make = create

  export function selectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapperArray<HTMLElementTagNameMap[T]>
  export function selectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapperArray<SVGElementTagNameMap[T]>
  export function selectAll(selector: string, from?: sQuashDomTarget): DomWrapperArray<Element>
  export function selectAll(selector: string, from?: sQuashDomTarget): DomWrapperArray<Element> {
    const source = from == undefined ? document : (parseDomTarget(from) ?? document)
    const result = new DomWrapperArray()
    Array.from(source.querySelectorAll(selector)).forEach((e) => result.push(new DomWrapper(e)))
    return result
  }

  export const $$ = selectAll

  /**
   * Select an element with class/id and still keeps type hinting.
   * @param element
   * @param extra id and/or class name
   * @param from
   */
  export function selectWith<T extends keyof HTMLElementTagNameMap>(
    element: T,
    extra: string,
    from?: sQuashDomTarget
  ): DomWrapper<HTMLElementTagNameMap[T]>
  export function selectWith(element: string, extra: string, from?: sQuashDomTarget): DomWrapper<Element>
  export function selectWith(element: string, extra: string, from?: sQuashDomTarget): DomWrapper<Element> {
    if (queriedElements.has(element + extra)) {
      return new DomWrapper(queriedElements.get(element + extra) as Element)
    } else {
      const result = select(element + extra, from)
      queriedElements.set(element + extra, result.get())
      return result
    }
  }

  export const $w = selectWith

  /** Like `select` but also search in shadow DOMs */
  export function deepSelect<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>
  export function deepSelect<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>
  export function deepSelect(selector: string, from?: sQuashDomTarget): DomWrapper<Element>
  export function deepSelect(selector: string, from?: sQuashDomTarget): DomWrapper<Element> | null {
    const source = from == undefined ? document : (parseDomTarget(from) ?? document)
    const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT)
    while (treeWalker.nextNode()) {
      const current = treeWalker.currentNode as Element
      if (current.matches(selector)) {
        return new DomWrapper(current)
      }
      if (current.shadowRoot != null) {
        const shadowResult = deepSelect(selector, current.shadowRoot)
        if (shadowResult) {
          return shadowResult
        }
      }
    }
    return null
  }

  export const $d = deepSelect

  export function deepSelectAll<T extends keyof HTMLElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<HTMLElementTagNameMap[T]>[]
  export function deepSelectAll<T extends keyof SVGElementTagNameMap>(selector: T, from?: sQuashDomTarget): DomWrapper<SVGElementTagNameMap[T]>[]
  export function deepSelectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[]
  export function deepSelectAll(selector: string, from?: sQuashDomTarget): DomWrapper<Element>[] {
    const source = from == undefined ? document : (parseDomTarget(from) ?? document)
    const result: DomWrapper<Element>[] = []
    const treeWalker = document.createTreeWalker(source, NodeFilter.SHOW_ELEMENT)
    while (treeWalker.nextNode()) {
      const current = treeWalker.currentNode as Element
      if (current.matches(selector)) {
        result.push(new DomWrapper(current))
      }
      if (current.shadowRoot != null) {
        const shadowResult = deepSelectAll(selector, current.shadowRoot)
        result.push(...shadowResult)
      }
    }
    return result
  }

  export const $$d = deepSelectAll

  export function wrap<T extends Element>(e: T): DomWrapper<T>
  export function wrap<T extends Element>(arr: ArrayAble<T>): DomWrapperArray<T>
  export function wrap<T extends Element>(input: T | ArrayAble<T>): DomWrapper<T> | DomWrapperArray<T> {
    if (input instanceof Element) {
      return new DomWrapper(input)
    } else {
      return DomWrapperArray.from(input)
    }
  }

  export function forAll<T extends keyof HTMLElementTagNameMap>(
    selector: T,
    callback: (el: DomWrapper<HTMLElementTagNameMap[T]>, index: number, arr: DomWrapperArray<HTMLElementTagNameMap[T]>) => void
  ): void
  export function forAll(selector: string, callback: (el: DomWrapper<Element>, index: number, arr: DomWrapperArray<Element>) => void): void
  export function forAll(selector: string, callback: (el: DomWrapper<Element>, index: number, arr: DomWrapperArray<Element>) => void): void {
    const elements = DomUtils.$$(selector)
    for (let i = 0; i < elements.length; i++) {
      callback(elements[i], i, elements)
    }
  }
}

DomUtils.toString = () => '[namespace sQuash.DomUtils]'

Object.defineProperty(DomUtils, Symbol.toStringTag, { value: 'sQuash.DomUtils' })
Object.defineProperty(window, 'DomUtils', { value: DomUtils })
Object.defineProperty(DomUtils, 'new', { value: DomUtils.create })

// If new elements are added or exsiting elements are removed, clear the cache
const mutob = new MutationObserver((muts) => {
  muts.some((mut) => mut.addedNodes.length > 0 || mut.removedNodes.length > 0) && queriedElements.clear()
})

mutob.observe(document.body, { childList: true, subtree: true })
