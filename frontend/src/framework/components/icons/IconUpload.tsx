import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconUpload(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 50,15
                L 100,60
                L 70,60
                L 70,90
                L 30,90
                L 30,60
                L 0,60
                Z

                M 15,15
                L 85,15
                L 85,0
                L 15,0
                Z
            "/>
        </Framework.IconBase>
	)
}