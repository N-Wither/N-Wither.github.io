import { LitElement } from "lit";
import { AquamarineComponentTagNameMap } from "../components/components";

export class AqElement extends LitElement {
    /**
     * A set of all connected instances of this element. Useful when you want to do something to all instances without using `querySelectorAll` (especially for those that are nested in shadow roots).
     */
    static readonly connectedInstances: Set<AqElement>

    /**
     * Alias for `querySelector`
     */
    sl<T extends keyof HTMLElementTagNameMap>(selector: T): HTMLElementTagNameMap[T] | null;
    sl<T extends keyof SVGElementTagNameMap>(selector: T): SVGElementTagNameMap[T] | null;
    sl<T extends keyof AquamarineComponentTagNameMap>(selector: T): AquamarineComponentTagNameMap[T] | null;
    sl(selector: string): Element | null;

    /**
     * Alias for `querySelectorAll`
     */
    sla<T extends keyof HTMLElementTagNameMap>(selector: T): NodeListOf<HTMLElementTagNameMap[T]>;
    sla<T extends keyof SVGElementTagNameMap>(selector: T): NodeListOf<SVGElementTagNameMap[T]>;
    sla<T extends keyof AquamarineComponentTagNameMap>(selector: T): NodeListOf<AquamarineComponentTagNameMap[T]>;
    sla(selector: string): NodeListOf<Element>;

    /**
     * Alias for `querySelectorAll`, but in shadow root.
     */
    sls<T extends keyof HTMLElementTagNameMap>(selector: T): NodeListOf<HTMLElementTagNameMap[T]>;
    sls<T extends keyof SVGElementTagNameMap>(selector: T): NodeListOf<SVGElementTagNameMap[T]>;
    sls<T extends keyof AquamarineComponentTagNameMap>(selector: T): NodeListOf<AquamarineComponentTagNameMap[T]>;
    sls(selector: string): NodeListOf<Element>;

    /**
     * Alias for `querySelectorAll`, but in shadow root.
     */
    slsa<T extends keyof HTMLElementTagNameMap>(selector: T): NodeListOf<HTMLElementTagNameMap[T]>;
    slsa<T extends keyof SVGElementTagNameMap>(selector: T): NodeListOf<SVGElementTagNameMap[T]>;
    slsa<T extends keyof AquamarineComponentTagNameMap>(selector: T): NodeListOf<AquamarineComponentTagNameMap[T]>;
    slsa(selector: string): NodeListOf<Element>;

    /**
     * Alias for `removeAttribute`
     * @param name The name of the attribute to remove.
     */
    rmAttr(name: string): void

    /**
     * `setAttribute`
     * @param name 
     * @param value 
     */
    attr(name: string, value: string | null): void
    /**
     * `getAttribute`
     * @param name 
     */
    attr(name: string): string | null
}