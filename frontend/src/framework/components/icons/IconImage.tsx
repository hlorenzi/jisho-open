import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconImage(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 20,10
                Q 10,10, 10,20
                L 10,80
                Q 10,90, 20,90
                L 80,90
                Q 90,90, 90,80
                L 90,20
                Q 90,10, 80,10
                Z

                M 20,80
                L 40,50
                L 55,70
                L 65,60
                L 80,80
                Z
            "/>
        </Framework.IconBase>
	)
}