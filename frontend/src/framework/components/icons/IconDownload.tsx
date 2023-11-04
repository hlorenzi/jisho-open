import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconDownload(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 50,75
                L 100,30
                L 70,30
                L 70,0
                L 30,0
                L 30,30
                L 0,30
                Z

                M 15,75
                L 85,75
                L 85,90
                L 15,90
                Z
            "/>
        </Framework.IconBase>
	)
}