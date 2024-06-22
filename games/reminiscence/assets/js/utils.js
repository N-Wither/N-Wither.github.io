/// <reference path="./game.d.ts" />

/**
 * A util function to compare two objects and make the second onject the same structure as the first one.
 * if a key in the first object is not present in the second object, it will be added with the value in the first object.
 * if not, it will be kept the same.
 */
export function compareObjects(obj1, obj2) {
    if(typeof obj1 !== 'object') {
        throw new TypeError('The first argument must be an object.')
    }
    if(typeof obj2 !== 'object') {
        obj2 = structuredClone(obj1);
    }
    for (let key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            if (!obj2.hasOwnProperty(key)) {
                obj2[key] = obj1[key];
            }
            else {
                if (typeof obj1[key] === 'object') {
                    if(typeof obj2[key] === 'object')
                    obj2[key] = compareObjects(obj1[key], obj2[key]);
                    else obj2[key] = obj1[key];
                }
            }
        }
    }
    return obj2;
}

/**
 * 
 * @param {string} name 
 * @returns {ExtendedHTMLElement}
 */
export function createElement(name) {
    let element = document.createElement(name);
    element.attribute = function (name, value) {
        this.setAttribute(name, value);
        return this;
    };
    element.class = function (...tokens) {
        this.classList.add(...tokens);
        return this;
    }
    element.property = function (name, value) {
        this[name] = value;
        return this;
    }
    return element
}

/**
 * A function to determines if a value (or an Array of values) is included in an array
 * @param {Array} arr 
 * @param {any | any[]} value 
 * @param {'and' | 'or'} type 
 * @returns {boolean}
 */
export function includes(arr, value, type = 'and') {
    if (Array.isArray(value)) {
        if(type === 'and'){
            return value.every(val => arr.includes(val));
        }
        else {
            return value.some(val => arr.includes(val));
        }
    }
    return arr.includes(value);
}