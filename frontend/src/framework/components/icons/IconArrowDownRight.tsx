import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconArrowDownRight(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 90,50
                L 55,85
                L 55,65
                L 30,65
                L 10,45
                L 10,0
                L 40,0
                L 40,35
                L 55,35
                L 55,15
                Z
            "/>
        </Framework.IconBase>
	)
}