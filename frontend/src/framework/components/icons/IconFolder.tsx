import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconFolder(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 20,15
                Q 10,15, 10,25
                L 10,75
                Q 10,85, 20,85
                L 80,85
                Q 90,85, 90,75
                L 90,35
                Q 90,25, 80,25
                L 60,25
                L 50,15
                Z
            "/>
        </Framework.IconBase>
	)
}