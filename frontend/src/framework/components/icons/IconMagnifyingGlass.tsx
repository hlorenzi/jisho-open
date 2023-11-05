import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconMagnifyingGlass(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 60,45
                L 45,60
                L 75,90
                L 90,75
                Z
            "/>
            <circle
                fill="none"
                stroke="currentColor"
                stroke-width="15"
                cx="40"
                cy="40"
                r="25"
            />
        </Framework.IconBase>
	)
}