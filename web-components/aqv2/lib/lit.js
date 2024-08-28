let module = await Promise.any([
    import('https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js'),
    import('https://esm.sh/lit@3.2.0')
])

export const { LitElement, html, css } = module