import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconArrowDownHollow(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase viewBox="-10 -10 120 120" { ...props }>
            <path fill="none" stroke="currentColor" stroke-width="10" d="
                M 50,100
                L 100,50
                L 70,50
                L 70,0
                L 30,0
                L 30,50
                L 0,50
                Z
            "/>
        </Framework.IconBase>
	)
}