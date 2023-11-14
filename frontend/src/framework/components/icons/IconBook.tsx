import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconBook(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 50,5
                L 20,5
                Q 10,5, 10,15
                L 10,85
                Q 10,95, 20,95
                L 90,95
                L 90,85
                L 20,85
                L 20,75
                L 90,75
                L 90,5
                Z
            "/>
        </Framework.IconBase>
	)
}