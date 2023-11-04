import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconIrregular(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 0,40
                L 33,15
                L 66,40
                L 100,15
                L 100,60
                L 66,85
                L 33,60
                L 0,85
                Z
            "/>
        </Framework.IconBase>
	)
}