import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconArrowLeft(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 0,50
                L 50,100
                L 50,70
                L 100,70
                L 100,30
                L 50,30
                L 50,0
                Z
            "/>
        </Framework.IconBase>
	)
}