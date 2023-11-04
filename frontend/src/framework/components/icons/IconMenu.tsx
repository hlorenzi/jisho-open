import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconMenu(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill={ "currentColor" } stroke="none" d="
                M 10,15
                L 90,15
                L 90,30
                L 10,30
                Z

                M 10,42.5
                L 90,42.5
                L 90,57.5
                L 10,57.5
                Z

                M 10,70
                L 90,70
                L 90,85
                L 10,85
                Z
            "/>
        </Framework.IconBase>
	)
}