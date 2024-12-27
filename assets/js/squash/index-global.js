import sQuash from "./index.js";

if( globalThis != undefined ) {
    globalThis.sQuash = sQuash;
    globalThis.TypeUtils = sQuash.Type
}