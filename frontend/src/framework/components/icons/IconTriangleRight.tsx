import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconTriangleRight(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 10,10
                L 90,50
                L 10,90
                Z
            "/>
        </Framework.IconBase>
	)
}