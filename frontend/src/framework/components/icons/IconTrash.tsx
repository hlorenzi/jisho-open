import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconTrash(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill={ "currentColor" } stroke="none" d="
                M 15,20
                L 25,20
                Q 25,10, 35,10
                L 65,10
                Q 75,10, 75,20
                L 85,20
                L 85,30
                L 15,30
                Z
                
                M 25,35
                L 75,35
                L 75,80
                Q 75,90, 65,90
                L 35,90
                Q 25,90, 25,80
                Z
            "/>
        </Framework.IconBase>
	)
}