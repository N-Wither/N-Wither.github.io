import { TypeUtils } from './type.js';

function remove(arr,...value) {
    if(arguments.length == 0) throw new TypeError('Expected at least 1 argument, but got 0')
    if(Array.isArray(arr) == false) throw new TypeError(`Type '${TypeUtils.typeOf(arr, true)}' cannot be assigned to type 'Array'`)
    for(let i = 0; i < arr.length; i++) {
        if(value.includes(arr[i])) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

function shuffle(arr) {
    if(arguments.length == 0) throw new TypeError('Expected 1 argument, but got 0')
    if(Array.isArray(arr) == false) throw new TypeError(`Type '${TypeUtils.typeOf(arr, true)}' cannot be assigned to type 'Array'`)
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function unique(arr) {
    if(arguments.length == 0) throw new TypeError('Expected 1 argument, but got 0')
    if(Array.isArray(arr) == false) throw new TypeError(`Type '${TypeUtils.typeOf(arr, true)}' cannot be assigned to type 'Array'`)
    return [...new Set(arr)];
}

export const ArrayUtils = {
    remove, shuffle, unique,

    [Symbol.toStringTag]: 'ArrayUtils',
    toString() {return '[namespace ArrayUtils]';}
}