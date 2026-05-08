import { DomUtils } from './dom.js';
const ROOT_NODE = Symbol('ROOT_NODE');
const CIRCULAR_FLAG = Symbol('CIRCULAR');
const SELF_REF_FLAG = Symbol('SELF_REF');
class ObjectTreeRootNode {
    type;
    content = [];
    name = ROOT_NODE;
    constructor(type) {
        this.type = type;
    }
}
class ObjectTreePrimitiveNode {
    name;
    type;
    content;
    constructor(name, value) {
        this.name = name;
        this.type = typeof value;
        this.content = value;
    }
}
class ObjectTreeObjectNode {
    name;
    type;
    content;
    flag;
    constructor(name, type, content = []) {
        this.name = name;
        this.type = type;
        this.content = content;
    }
}
class ObjectTreeFunctionNode extends ObjectTreeObjectNode {
    functionName;
    constructor(name, func, content = []) {
        super(name, 'function', content);
        this.functionName = func.name == '' ? '<ANONYMOUS>' : func.name;
    }
}
class ObjectTreeArrayLikeNode extends ObjectTreeObjectNode {
    length;
    constructor(name, type, length, content = []) {
        super(name, type, content);
        this.length = length;
    }
}
function getType(obj) {
    function isPlainObject(o) {
        return o.constructor == Object && o[Symbol.toStringTag] == undefined ? true : false;
    }
    if (obj != null && (typeof obj == 'object' || typeof obj == 'function')) {
        const toStringTag = obj[Symbol.toStringTag];
        const constructor = obj.constructor.name;
        return isPlainObject(obj) ? 'object' : obj.constructor == Object ? toStringTag : ((typeof toStringTag == 'string') && (toStringTag != constructor) ? toStringTag : constructor);
    }
    else if (obj === null) {
        return 'null';
    }
    else
        return typeof obj;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function getFunctionName(func) {
    return func.name == '' ? '<ANONYMOUS>' : func.name;
}
export var ObjectUtils;
(function (ObjectUtils) {
    function isObject(o) {
        return (typeof o == 'object' && o != null) || typeof o == 'function';
    }
    ObjectUtils.isObject = isObject;
    function get(obj, path) {
        return typeof path == 'symbol' ? obj[path] : path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    ObjectUtils.get = get;
    function set(obj, path, value) {
        path.split('.').reduce((acc, key, index, arr) => {
            if ((index != arr.length - 1 && typeof acc[key] !== 'object') || acc[key] === null) {
                acc[key] = {};
            }
            if (index === arr.length - 1) {
                acc[key] = value;
            }
            return acc[key];
        }, obj);
    }
    ObjectUtils.set = set;
    /**
     * Get the depth of a value in an object, or -1 if it doesn't exist. Depth is defined as the number of nested objects you have to go through to get to the value, with the top-level object being at depth 0.
     * @param obj
     * @param value
     */
    function getValueDepth(obj, value) {
        return ObjectUtils.getValuePath(obj, value)?.length ?? -1;
    }
    ObjectUtils.getValueDepth = getValueDepth;
    function getValuePath(obj, value) {
        const seen = new WeakSet();
        const stack = [{ value: obj, path: [] }];
        while (stack.length) {
            const { value: currentValue, path } = stack.pop();
            if (currentValue === value && path.length > 0) {
                return path;
            }
            if ((typeof currentValue == 'object' || typeof currentValue == 'function') && currentValue !== null) {
                if (seen.has(currentValue)) {
                    continue;
                }
                seen.add(currentValue);
                stack.push(...Object.values(currentValue).map((v, i) => ({
                    value: v,
                    path: [...path, typeof v == 'symbol' ? v : Object.keys(currentValue)[i]]
                })));
            }
        }
        return null;
    }
    ObjectUtils.getValuePath = getValuePath;
    function findCircularPaths(obj) {
        const paths = [];
        const stack = new Set();
        function walk(value, currentPath) {
            if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
                if (stack.has(value)) {
                    paths.push(currentPath);
                    return;
                }
                stack.add(value);
                Reflect.ownKeys(value).forEach((key) => {
                    if (typeof value === 'function' && typeof key == 'string' && ['prototype', 'name', 'length'].includes(key))
                        return;
                    walk(value[key], `${currentPath}.${String(key)}`);
                });
                stack.delete(value);
            }
        }
        walk(obj, 'root');
        return paths.map((p) => p.replace('root.', ''));
    }
    ObjectUtils.findCircularPaths = findCircularPaths;
    function findCircularReference(obj) {
        const seen = new WeakSet();
        const stack = [obj];
        while (stack.length) {
            const value = stack.pop();
            if ((typeof value == 'object' || typeof value == 'function') && value !== null) {
                if (seen.has(value)) {
                    return value;
                }
                seen.add(value);
                stack.push(...Object.values(value));
            }
        }
        return false;
    }
    ObjectUtils.findCircularReference = findCircularReference;
    function hasCircularReference(obj) {
        return ObjectUtils.findCircularReference(obj) ? true : false;
    }
    ObjectUtils.hasCircularReference = hasCircularReference;
    function hasSelfReference(obj) {
        return ObjectUtils.findCircularReference(obj) == obj ? true : false;
    }
    ObjectUtils.hasSelfReference = hasSelfReference;
    const circularFlag = crypto.randomUUID();
    function isArrayLike(obj) {
        if (obj == null)
            return false;
        return typeof obj == 'object' && (typeof obj.length == 'number' || typeof obj.size == 'number') && typeof obj[Symbol.iterator] == 'function';
    }
    ObjectUtils.isArrayLike = isArrayLike;
    function getFunctionPropertyKeys(fun) {
        return Object.getOwnPropertyNames(fun).filter((k) => k != 'length' && k != 'name' && k != 'prototype');
    }
    ObjectUtils.getFunctionPropertyKeys = getFunctionPropertyKeys;
    function parseStructure(obj) {
        if (!((typeof obj == 'object' || typeof obj == 'function') && obj != null)) {
            return new ObjectTreeRootNode(typeof obj);
        }
        /** 用于记录当前递归路径中的祖先 */
        const ancestors = new Set();
        const tree = new ObjectTreeRootNode(typeof obj);
        function transform(value, key) {
            // 基础类型直接返回
            if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
                return [new ObjectTreePrimitiveNode(key, value)];
            }
            // console.log(value, key)
            // --- 核心逻辑：检测当前值是否在祖先路径中 ---
            if (ancestors.has(value)) {
                return [new ObjectTreeObjectNode(CIRCULAR_FLAG, getType(value), [])];
            }
            if (key && value[key] === value && Reflect.ownKeys(value).includes(key)) {
                return [new ObjectTreeObjectNode(SELF_REF_FLAG, getType(value), [])];
            }
            // 将当前对象加入祖先路径
            ancestors.add(value);
            const result = [];
            // 获取所有属性（包括不可枚举和静态属性）
            let keys = Reflect.ownKeys(value);
            if (typeof value == 'function') {
                keys = keys.filter((k) => !['prototype', 'name', 'length'].includes(k));
            }
            for (const k of keys) {
                // 递归处理子属性
                const v = value[k];
                if (v == null || (typeof v != 'object' && typeof v != 'function')) {
                    result.push(new ObjectTreePrimitiveNode(k, v));
                }
                else {
                    // console.log(k, String(value))
                    let node;
                    if (typeof v == 'function') {
                        node = new ObjectTreeFunctionNode(k, v);
                    }
                    else if (isArrayLike(v)) {
                        node = new ObjectTreeArrayLikeNode(k, getType(v), v.length ?? v.size);
                    }
                    else {
                        node = new ObjectTreeObjectNode(k, getType(v));
                    }
                    if (v == value) {
                        node.flag = SELF_REF_FLAG;
                        Object.freeze(node.content);
                    }
                    else if (ancestors.has(v)) {
                        node.flag = CIRCULAR_FLAG;
                        Object.freeze(node.content);
                    }
                    if (Object.isExtensible(node.content)) {
                        node.content.push(...transform(v, k));
                    }
                    result.push(node);
                }
            }
            // 【回溯】：处理完该分支后，将其从路径中移除
            ancestors.delete(value);
            return result;
        }
        tree.content.push(...transform(obj, 'root'));
        return tree;
    }
    ObjectUtils.parseStructure = parseStructure;
    function objectToDetails(obj, summary, option = {}) {
        const result = DomUtils.make('details');
        const summaryText = summary ? summary : getType(obj);
        if (ObjectUtils.isObject(obj) == false) {
            DomUtils.make('summary', [summaryText, ': ', String(obj)]).appendTo(result);
            return result;
        }
        const finalOption = Object.assign({ maxLength: Infinity }, option);
        function getSummaryAppendant(o) {
            const span = DomUtils.make('span').class('secondary');
            if (ObjectUtils.isObject(o) == false)
                return span;
            const text = o.constructor == Object
                ? ''
                : typeof o == 'function'
                    ? ` [Function ${getFunctionName(o)}]`
                    : ` ${o.constructor.name}${ObjectUtils.isArrayLike(o) ? `(${o.length ?? o.size})` : ''}`;
            span.text(text);
            return span;
        }
        const summaryAppendant = obj.constructor == Object ? '' : getSummaryAppendant(obj);
        const summaryElement = DomUtils.make('summary', summaryText).appendTo(result);
        if (summaryAppendant != '') {
            summaryElement.append(summaryAppendant);
        }
        const tree = ObjectUtils.parseStructure(obj);
        const NO_OWN_PROPERTIES = DomUtils.make('div', '[NO OWN PROPERTIES]').class('secondary').style({ 'font-style': 'italic' });
        function getNodeDescription(node) {
            if (node instanceof ObjectTreeFunctionNode) {
                return `[Function ${node.functionName}]`;
            }
            else {
                return node.type;
            }
        }
        function parseNode(node) {
            const nodeName = DomUtils.make('span', String(node.name)).class(node instanceof ObjectTreeFunctionNode ? 'method' : 'property');
            if (node instanceof ObjectTreePrimitiveNode) {
                return DomUtils.make('div', [DomUtils.make('span', nodeName), ': ', DomUtils.make('span', String(node.content)).class(getType(node.content))]);
            }
            else if (node instanceof ObjectTreeObjectNode) {
                if (node.flag == SELF_REF_FLAG) {
                    return DomUtils.make('div', [
                        DomUtils.make('span', nodeName),
                        ': ',
                        DomUtils.make('span', [
                            '[SELF-REF ',
                            DomUtils.make('span', getNodeDescription(node)).class(node.type),
                            ']'
                        ]).class('secondary')
                    ]);
                }
                else if (node.flag == CIRCULAR_FLAG) {
                    return DomUtils.make('div', [
                        DomUtils.make('span', nodeName),
                        ': ',
                        DomUtils.make('span', [
                            '[CIRCULAR ',
                            DomUtils.make('span', getNodeDescription(node)).class(node.type),
                            ']'
                        ]).class('secondary')
                    ]);
                }
                else {
                    const isFunction = node instanceof ObjectTreeFunctionNode;
                    const details = DomUtils.make('details');
                    const sumTxt1 = DomUtils.make('span', node.name.toString()).class(isFunction ? 'method' : 'property');
                    const sumTxt2 = isFunction
                        ? `[Function ${node.functionName}]`
                        : node.type == 'object'
                            ? ''
                            : node.type + (node instanceof ObjectTreeArrayLikeNode ? `(${node.length})` : '');
                    const summ = DomUtils.make('summary');
                    summ.append(sumTxt1);
                    if (sumTxt2 != '') {
                        summ.append(new Text(': '));
                        summ.append(DomUtils.make('span', sumTxt2).class(node.type));
                    }
                    details.append(summ);
                    if (node.content.length == 0) {
                        if (isFunction || node.type != 'object') {
                            return DomUtils.make('div', [sumTxt1, ': ', DomUtils.make('span', sumTxt2).class(node.type)]);
                        }
                        else {
                            NO_OWN_PROPERTIES.clone().appendTo(details);
                        }
                    }
                    else {
                        node.content
                            .slice(0, Math.min(finalOption.maxLength, node.content.length))
                            .map(parseNode)
                            .forEach((e) => {
                            details.append(e);
                        });
                        if (finalOption.maxLength < node.content.length) {
                            DomUtils.make('div', `+${node.content.length - finalOption.maxLength} More...`)
                                .class('secondary')
                                .appendTo(details);
                        }
                    }
                    return details;
                }
            }
            else {
                return DomUtils.make('div', '[FAILED TO PARSE]');
            }
        }
        const contentToParse = tree.content.slice(0, Math.min(finalOption.maxLength, tree.content.length));
        contentToParse.forEach((node) => {
            parseNode(node).appendTo(result);
        });
        if (tree.content.length > contentToParse.length) {
            DomUtils.make('div', `+${tree.content.length - contentToParse.length} More...`)
                .class('secondary')
                .appendTo(result);
        }
        if (tree.content.length == 0) {
            NO_OWN_PROPERTIES.clone().appendTo(result);
        }
        return result.class('obj2details');
    }
    ObjectUtils.objectToDetails = objectToDetails;
})(ObjectUtils || (ObjectUtils = {}));
Object.defineProperty(ObjectUtils, Symbol.toStringTag, { value: 'ObjectUtils' });
const obj2detailsStyle = new CSSStyleSheet();
obj2detailsStyle.replaceSync(`
details.obj2details {
  font-family: var(--font-monospace, monospace);
}

details.obj2details .property {
  color: #1884af;
}

details.obj2details .method {
  color: #264cb5;
}

details.obj2details :is(.null, .undefined) {
  color: #C33335;
}

details.obj2details .symbol {
  color: #c98d49;
}

details.obj2details .number {
  color: #2675B5;
}

details.obj2details .string {
  color: #DC4E35;
}

details.obj2details :is(.array, .secondary){
  color: gray;
}

details.obj2details :is(.func, .function) {
  color: #B24695;
}

details.obj2details :is(.bool, .boolean) {
  color: #359C79;
}
`);
document.adoptedStyleSheets.push(obj2detailsStyle);
//# sourceMappingURL=object.js.map