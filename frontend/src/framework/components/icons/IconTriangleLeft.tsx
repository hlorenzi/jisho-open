import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconTriangleLeft(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 90,10
                L 10,50
                L 90,90
                Z
            "/>
        </Framework.IconBase>
	)
}