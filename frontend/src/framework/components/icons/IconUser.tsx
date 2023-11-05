import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconUser(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle
                fill="currentColor"
                stroke="none"
                fill-rule="evenodd"
                cx="50"
                cy="30"
                r="20"
            />
            <path fill="currentColor" stroke="none" d="
                M 20,90
                L 80,90
                Q 50,30, 20,90
                Z
            "/>
        </Framework.IconBase>
	)
}