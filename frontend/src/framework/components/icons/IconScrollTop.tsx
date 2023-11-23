import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconScrollTop(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="15"
                stroke-linecap="round"
                d="
                    M 10,50
                    L 50,10
                    L 90,50

                    M 10,90
                    L 50,50
                    L 90,90
            "/>
        </Framework.IconBase>
	)
}