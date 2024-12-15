export namespace FunctionUtils {
    function debounce<T extends (...args: any[]) => any>(fn: T, time?: number): T
    function once<T extends (...args: any[]) => any>(fn: T): T
}