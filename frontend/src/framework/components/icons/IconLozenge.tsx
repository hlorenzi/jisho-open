import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconLozenge(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 50,5
                L 10,50
                L 50,95
                L 90,50
                Z
            "/>
        </Framework.IconBase>
	)
}