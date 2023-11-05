import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconWarning(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 0,100
                L 50,0
                L 100,100
                Z
            "/>
            <path
                fill="none"
                stroke="var(--theme-iconDetailColor)"
                stroke-width="12"
                stroke-linecap="square"
                d="
                M 50,30
                L 50,60
                M 50,80
                L 50,81
            "/>
        </Framework.IconBase>
	)
}