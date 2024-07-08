import { DOMUtils } from "./dom.js"
import { FunctionUtils } from "./function.js"
import { StringUtils } from "./string.js"
import { TypeUtils } from "./type.js"
import { RandomUtils } from "./random.js"
import { ColorUtils } from "./color.js"

export default class AQuery {
    static DOM = DOMUtils
    static Func = FunctionUtils
    static Str = StringUtils
    static Type = TypeUtils
    static Rand = RandomUtils
    static Color = ColorUtils
}

export const { createElement, select, selectAll } = DOMUtils
export const { debounce, once } = FunctionUtils
export const { camelToKebab, kebabToCamel, capitalize } = StringUtils
export const { check, checkWithError, isIterable, isSubclassOf } = TypeUtils
export const { randomInt, randomNumber, randomPick } = RandomUtils
export const { hexToRGBA, rgbToHSLA, create: createColor } = ColorUtils