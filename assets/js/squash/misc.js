export const MiscUtils = {
    clone(obj) {
        if(typeof obj != 'object' && typeof obj != 'function' || obj == null) return obj;
        else if (typeof obj == 'function') {
            return obj.bind(null);
        }
        else {
            return Object.assign({}, obj);
        }
    }
}
