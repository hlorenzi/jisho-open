import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconTriangleUp(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 10,80
                L 50,20
                L 90,80
                Z
            "/>
        </Framework.IconBase>
	)
}