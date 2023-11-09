import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconExternal(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                stroke-linecap="square"
                stroke-linejoin="round"
                d="
                M 40,20
                L 20,20
                L 20,80
                L 80,80
                L 80,60
            "/>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                stroke-linecap="square"
                stroke-linejoin="round"
                d="
                M 60,10
                L 90,10
                L 90,40
            "/>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                stroke-linecap="round"
                d="
                M 90,10
                L 50,50
            "/>
        </Framework.IconBase>
	)
}