import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconPlus(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 10,40
                L 90,40
                L 90,60
                L 10,60
                Z
            "/>

            <path fill="currentColor" stroke="none" d="
                M 40,10
                L 40,90
                L 60,90
                L 60,10
                Z
            "/>
        </Framework.IconBase>
	)
}