/// <reference path='./event.d.ts' />

import { type ConsoleDialog } from './components/console-dialog.js';
import { defaultMap } from './lang.js';

type LanguageKey = keyof typeof defaultMap;

interface Document {
    createElement(tagName:'console-dialog', options?: ElementCreationOptions): ConsoleDialog;
}

interface ExtendedHTMLElement extends HTMLElement {
    attribute(name: string, value: any): ExtendedHTMLElement;
    class(...tokens: string[]): ExtendedHTMLElement;
}