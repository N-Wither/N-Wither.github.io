import { ColorUtils } from './color.js';
import { FunctionUtils } from './function.js';
import { DomUtils } from './dom.js';
import { RandomUtils } from './random.js';
import { StringUtils } from './string.js';
import { TypeUtils } from './type.js';

export namespace sQuash {
    export const Color: typeof ColorUtils;
    export const Func: typeof FunctionUtils;
    export const Dom: typeof DomUtils;
    export const Rand: typeof RandomUtils;
    export const Str: typeof StringUtils;
    export const Type: typeof TypeUtils;
}
