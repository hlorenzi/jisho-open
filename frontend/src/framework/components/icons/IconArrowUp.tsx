import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconArrowUp(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
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