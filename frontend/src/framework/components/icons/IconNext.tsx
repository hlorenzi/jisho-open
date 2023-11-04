import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconNext(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="15"
                strokeLinecap="round"
                d="
                M 85,50
                L 10,50

                M 50,10
                L 90,50
                L 50,90
            "/>
        </Framework.IconBase>
	)
}