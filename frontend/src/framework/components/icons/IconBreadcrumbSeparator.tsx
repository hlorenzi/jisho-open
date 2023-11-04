import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconBreadcrumbSeparator(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="15"
                strokeLinecap="round"
                d="
                M 50,30
                L 70,50
                L 50,70
            "/>
        </Framework.IconBase>
	)
}