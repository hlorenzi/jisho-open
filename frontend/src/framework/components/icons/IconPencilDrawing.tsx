import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconPencilDrawing(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 30,90
                L 10,90
                L 10,70
                L 60,20
                L 80,40
                Z

                M 65,15
                L 75,5
                L 85,15
                L 95,25
                L 85,35
                Z
            "/>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="10"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                d="
                M 40,90
                L 80,90
                L 70,75
                L 95,75
            "/>
        </Framework.IconBase>
	)
}