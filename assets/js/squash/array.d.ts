export namespace ArrayUtils {
    /**
     * Removes specified values from an array, returns the modified array.
     * @param arr The array to remove values from.
     * @param value The values to remove.
     */
    export function remove<T>(arr: T[], ...value: T[]): T[]
    /**
     * Shuffles an array in-place, returns the modified array.
     * @param arr The array to shuffle.
     */
    export function shuffle<T>(arr: T[]): T[]
    /**
     * Make all values in an array unique, returns a new array.
     * @param arr
     */
    export function unique<T>(arr: T[]): T[]
}
