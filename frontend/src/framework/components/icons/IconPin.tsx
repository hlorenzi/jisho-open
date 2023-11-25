import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconPin(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle fill={ "currentColor" } stroke="none"
                cx="50"
                cy="40"
                r="30"
            />
            <path fill="currentColor" stroke="none" d="
                M 35,30
                L 30,100
                L 65,50
                Z
            "/>
        </Framework.IconBase>
	)
}