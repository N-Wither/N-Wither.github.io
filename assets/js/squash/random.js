import { TypeUtils } from "./type.js";

/**
 * Utility class for random number generation.
 */
export class RandomUtils {
    /**
     * Generate a random integer between min and max (inclusive).
     * @param {number} min
     * @param {number} max
     * @returns
     */
    static randomInt(min = 0, max = 100) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generate a random number between min and max (inclusive).
     * @param {number} min
     * @param {number} max
     * @returns
     */
    static randomNumber(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Pick a random element from an iterable object (like array).
     * @param {Iterable | ArrayLike} arr
     */
    static randomPick(arr) {
        if (TypeUtils.isIterable(arr)) {
            arr = Array.from(arr);
        } else {
            throw new TypeError('The argument must be an iterable object.');
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
