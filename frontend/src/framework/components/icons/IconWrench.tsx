import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconWrench(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill={ "currentColor" } stroke="none" d="
                M 55,35
                L 35,55
                L 75,95
                L 95,75
                Z
            "/>
            <path fill={ "currentColor" } stroke="none" d="
                M 30,40
                L 40,30
                L 20,10
                A 30,30, 45,1,1, 10,20
                Z
            "/>
        </Framework.IconBase>
	)
}