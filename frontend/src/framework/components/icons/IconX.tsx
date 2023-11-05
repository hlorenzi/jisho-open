import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconX(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill={ "currentColor" } stroke="none" d="
                M 25,10
                L 10,25
                L 75,90
                L 90,75
                Z
            "/>
            <path fill={ "currentColor" } stroke="none" d="
                M 75,10
                L 10,75
                L 25,90
                L 90,25
                Z
            "/>
        </Framework.IconBase>
	)
}