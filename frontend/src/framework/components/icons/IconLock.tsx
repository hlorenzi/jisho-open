import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconLock(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path
                fill="currentColor"
                stroke="none"
                d="
                    M 20,50
                    L 20,90
                    L 80,90
                    L 80,50
                    Z
            "/>
            <path
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                stroke-linecap="square"
                d="
                    M 32,50
                    L 32,40
                    Q 32,20, 50,20
                    Q 68,20, 68,40
                    L 68,50
            "/>
        </Framework.IconBase>
	)
}