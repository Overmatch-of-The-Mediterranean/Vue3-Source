import { ShapeFlags } from "packages/shared/src/shapeFlags"
import { isArray, isFunction, isObject, isString, isProxy, extend } from "@vue/shared"
import { normalizeClass, normalizeStyle } from "packages/vue/src/normalizeProp"
    
export interface VNode { 
    __v_isVNode:true
    type: any,
    props: any,
    children: any,
    shapeFlag:ShapeFlags
    
}
 
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')
export const Fragment =  Symbol('Fragment')

export function isVNode(val: any): val is VNode { 
    return val ? val.__v_isVNode : false
}
 

// 设置shapeFlag
export function createVNode(type: any, props?: any, children?: any) { 

    
    if (props) { 
        let { class: kclass, style } = props
        // class增强
        if (kclass && !isString(kclass)) { 
            props.class = normalizeClass(kclass)
        }
        
        // style增强
        if (isObject(style)) { 
            if (isProxy(style) && !isArray(style)) { 
                style = extend({}, style)
            }
            props.style = normalizeStyle(style)
         }
        
     }

    const shapeFlag = isString(type)
        ? ShapeFlags.ELEMENT
        : isObject(type)
        ? ShapeFlags.STATEFUL_COMPONENT
        : 0

    return createBaseVNode(type,props,children,shapeFlag)
}

// 创建VNode，并对VNode进行处理
export function createBaseVNode(type: any, props: any, children: any, shapeFlag: any) { 
    const VNode = {
        __v_isVNode:true,
        type,
        props,
        shapeFlag
    } as VNode

    normalizeChildren(VNode,children)

    return VNode
}
 
// 改变shapeFlags，记录VNode的类型
function normalizeChildren(VNode:any, children:any) { 

    let type = 0

    if (children == null) {
        children = null
    } else if (isArray(children)) {
        type = ShapeFlags.ARRAY_CHILDREN
        
    } else if (isObject(children)) {

    } else if (isFunction(children)) {

    } else { 
        type = ShapeFlags.TEXT_CHILDREN
        children = String(children)
        
    }

    VNode.shapeFlag |= type
    VNode.children = children
 }