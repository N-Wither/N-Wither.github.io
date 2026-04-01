export namespace ArrayUtils {
    /**
     * Split an array into chunks of specified size, returns a new array of arrays.
     */
    export function chunk<T>(arr: T[], size: number): T[][] {
        size = Math.round(size)
        if (size <= 1 || Number.isNaN(size)) {
            return arr.map((e) => [e])
        } else {
            let index = 0
            let resIndex = 0
            let result: T[][] = []
            while (index < arr.length) {
                result[resIndex++] = arr.slice(index, index += size)
            }
            return result
        }
    }

    /**
     * Remove specified values from an array, returns the **modified array**.
     */
    export function remove<T>(arr: T[], values: T[]): T[] {
        for(let i = 0; i < arr.length; i++) {
            if(values.includes(arr[i])) {
                arr.splice(i, 1);
                i--;
            }
        }
        return arr;
    }

    /**
     * Shuffle an array, returns the **modified array**.
     */
    export function shuffle<T>(arr: T[]): T[] {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr
    }

    /**
     * Remove duplicate values from an array, returns a new array.
     * 
     * **Note**: this is a very very simplified implementation, don't use it for production.
     */
    export function unique<T>(arr: T[]): T[] {
        return Array.from(new Set(arr))
    }

    /**
     * Like `range()` in Python, returns an array of numbers from `0` to `length - 1`.
     */
    export function range(length: number): number[] {
        return Array.from({ length }).map((_, i) => i)
    }
}
