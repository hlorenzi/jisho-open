import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconArrowUpHollow(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase viewBox="-10 -10 120 120" { ...props }>
            <path fill="none" stroke="currentColor" stroke-width="10" d="
                M 50,0
                L 100,50
                L 70,50
                L 70,100
                L 30,100
                L 30,50
                L 0,50
                Z
            "/>
        </Framework.IconBase>
	)
}