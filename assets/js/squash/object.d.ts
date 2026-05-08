import { DomWrapper } from './dom.js';
interface ObjectTreeNode {
    name: string | symbol;
    type: string;
    content: unknown;
}
declare class ObjectTreeRootNode implements ObjectTreeNode {
    type: string;
    content: ObjectTreeNode[];
    name: symbol;
    constructor(type: string);
}
export declare namespace ObjectUtils {
    export function isObject(o: any): boolean;
    export function get(obj: any, path: string | symbol): any;
    export function set(obj: any, path: string, value: any): void;
    /**
     * Get the depth of a value in an object, or -1 if it doesn't exist. Depth is defined as the number of nested objects you have to go through to get to the value, with the top-level object being at depth 0.
     * @param obj
     * @param value
     */
    export function getValueDepth(obj: any, value: any): number;
    export function getValuePath(obj: any, value: any): (string | symbol)[] | null;
    export function findCircularPaths(obj: any): string[];
    export function findCircularReference(obj: any): any;
    export function hasCircularReference(obj: any): boolean;
    export function hasSelfReference(obj: any): boolean;
    export function isArrayLike(obj: any): boolean;
    export function getFunctionPropertyKeys(fun: Function): string[];
    export function parseStructure(obj: any): ObjectTreeRootNode;
    interface ObjectToDetailsOption {
        maxLength?: number;
    }
    export function objectToDetails(obj: object, summary?: string, option?: ObjectToDetailsOption): DomWrapper<HTMLDetailsElement>;
    export {};
}
export {};
