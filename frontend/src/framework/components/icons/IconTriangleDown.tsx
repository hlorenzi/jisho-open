import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconTriangleDown(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 10,20
                L 50,80
                L 90,20
                Z
            "/>
        </Framework.IconBase>
	)
}