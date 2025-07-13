import { sQuash } from ".";

export namespace ObjectUtils {
    declare function get(obj: any, path: string): any
    declare function set(obj: any, path: string, value: any): void
    declare function findCircularReference(obj: any): any
    declare function hasCirularReference(obj: any): boolean
    declare function hasSelfReference(obj: any): boolean
}
