import { compareObjects } from './utils.js'

export const defaultData = {
    saves: {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
    },
    settings: {
        language: 'en-us',
    },
    autoLoad: undefined
}

export class GameData {
    static getData() {
        let local = localStorage.getItem('reminiscence_game_data')
        if(local == null) {
            localStorage.setItem('reminiscence_game_data', JSON.stringify(defaultData))
            return null
        }
        else {
            let data = JSON.parse(local)
            return compareObjects(defaultData, data)
        }
    }

    static saveData(data) {
        localStorage.setItem('reminiscence_game_data', JSON.stringify(data))
    }

    /**
     * @param {string} path 
     * @example GameData.getItem('saves.1.currentDay')
    */
    static getItem(path) {
        let data = GameData.getData()
        if(data == null) return null
        let keys = path.split('.')
        let result = data
        for(let i = 0; i < keys.length; i++) {
            if(result[keys[i]] == null) return null
            result = result[keys[i]]
        }
        return result
    }

    /**
     * 
     * @param {string} path 
     * @param {any} value 
     * @example GameData.setItem('saves.1.currentDay', 12)
     */
    static setItem(path, value) {
        let data = GameData.getData()
        if(data == null) return
        let keys = path.split('.')
        let result = data
        for(let i = 0; i < keys.length - 1; i++) {
            if(result[keys[i]] == null) result[keys[i]] = {}
            result = result[keys[i]]
        }
        result[keys[keys.length - 1]] = value
        GameData.saveData(data)
    }
}