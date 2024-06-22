import { LanguageKey } from "./game"

declare interface EventCondition {
    day?: number
    time?: 'morning' | 'afternoon' | 'night'
    hasItem?: {item: string, count: number}[]
    eventCompleted?: string[]
}

declare interface EventReward<TYPE = 'item' | 'flag' | 'money' | 'recipe' | 'fame'> {
    type: TYPE,
    data: TYPE extends 'item' ? {
        item: string,
        count: number,
    } : TYPE extends 'flag' ? {
        flag: string,
        value: boolean,
    } : TYPE extends 'money' ? {
        money: number
    } : TYPE extends 'recipe' ? {
        recipe: string
    } : TYPE extends 'fame' ? {
        fame: number
    } : never
}

declare type EventActionType = 'dialog' | 'text' | 'condition'

declare interface EventAction<TYPE = EventActionType> {
    type: TYPE
    data: TYPE extends 'dialog' ?
        {
            name: string,
            text: string,
            icon: string,
        }
        : TYPE extends 'text' ?
        string
        : never
}

declare export class GameEvent extends EventTarget{
    constructor(id: string) {}

    id: string
    sequence: any[]
    condition: EventCondition
    repeatable: boolean
    rewards: EventReward<any>[]

    dialog(name: LanguageKey, text: LanguageKey, icon: LanguageKey): void
    text(text: LanguageKey): void
    play(): void
    lang(map: object): void
    terminate(): void
}