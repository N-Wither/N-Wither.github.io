declare class Foo {
    constructor() 
}

declare module 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js' {
    export * from 'lit'
}

declare module 'https://esm.sh/lit@3.2.0' {
    export * from 'lit'
}

declare module 'https://cdn.jsdelivr.net/npm/ts-dedent@2.2.0/+esm' {
    export declare function dedent(templ: TemplateStringsArray | string, ...values: unknown[]): string;
    export default dedent;
}

declare module 'https://cdn.jsdelivr.net/npm/shiki@1.4.0/+esm' {
    export * from 'shiki'
}

declare module 'https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/+esm' {
    export * from 'tippy.js'
}