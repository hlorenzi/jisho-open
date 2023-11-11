import * as Solid from "solid-js"
import * as Framework from "./index.ts"


export type OnClickEvent<T> = Event & {
    currentTarget: T
    target: Element
}


export type OnClickHandler = (
    ev: OnClickEvent<HTMLButtonElement | HTMLAnchorElement>)
    => boolean | void


export interface ButtonBehaviorProps
{
    href?: string
    target?: string
    title?: string
    disabled?: boolean
    forceReload?: boolean
    blurOnClick?: boolean
    onClick?: OnClickHandler
}


export interface AnchorBehaviorProps
{
    href?: string
    target?: string
    title?: string
    disabled?: boolean
    noReload?: boolean
    forceReload?: boolean
    blurOnClick?: boolean
    onClick?: OnClickHandler
}


export function onButtonClick(ev: any, props: ButtonBehaviorProps)
{
    if (props.disabled)
        return
    
    if (props.onClick)
    {
        if (props.blurOnClick)
            ev.target.blur()
        
        if (!props.onClick(ev))
        {
            ev.preventDefault()
            ev.returnValue = false
            return false
        }
    }
    
    if (props.href && !ev.ctrlKey && !props.forceReload)
    {
        if (!props.href.startsWith("http"))
        {
            ev.preventDefault()
            ev.returnValue = false
            Framework.historyPush(props.href)
            return false
        }
    }
}


export function onAnchorClick(ev: any, props: AnchorBehaviorProps)
{
    if (props.disabled)
        return
    
    if (props.onClick)
    {
        if (props.blurOnClick)
            ev.target.blur()
        
        if (!props.onClick(ev))
        {
            ev.preventDefault()
            ev.returnValue = false
            return false
        }
    }

    if (!props.href || props.href == "#")
    {
        ev.preventDefault()
        ev.returnValue = false
        return false
    }
    
    if (props.href && !ev.ctrlKey && !props.forceReload)
    {
        if (!props.href.startsWith("http"))
        {
            ev.preventDefault()
            ev.stopPropagation()
            ev.returnValue = false

            if (props.noReload)
                Framework.historyPushNoReload(props.href)
            else
                Framework.historyPush(props.href)
            
            return false
        }
    }
}