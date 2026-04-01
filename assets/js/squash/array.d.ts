export declare namespace ArrayUtils {
    /**
     * Split an array into chunks of specified size, returns a new array of arrays.
     */
    function chunk<T>(arr: T[], size: number): T[][];
    /**
     * Remove specified values from an array, returns the **modified array**.
     */
    function remove<T>(arr: T[], values: T[]): T[];
    /**
     * Shuffle an array, returns the **modified array**.
     */
    function shuffle<T>(arr: T[]): T[];
    /**
     * Remove duplicate values from an array, returns a new array.
     *
     * **Note**: this is a very very simplified implementation, don't use it for production.
     */
    function unique<T>(arr: T[]): T[];
    /**
     * Like `range()` in Python, returns an array of numbers from `0` to `length - 1`.
     */
    function range(length: number): number[];
}
