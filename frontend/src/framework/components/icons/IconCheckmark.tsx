import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconCheckmark(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 25,40
                L 40,55
                L 75,15
                L 90,30
                L 40,85
                L 10,55
                Z
            "/>
        </Framework.IconBase>
	)
}