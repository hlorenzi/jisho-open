import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconFolderOpen(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 20,15
                Q 10,15, 10,25
                L 10,75
                Q 10,85, 20,85
                L 80,85
                Q 85,85, 90,75
                L 100,45
                Q 100,35, 90,35

                L 50,35
                Q 45,35, 40,45
                L 30,75
                L 20,75
                L 35,35
                Q 40,25, 50,25
                L 60,25
                L 50,15
                Z
            "/>
        </Framework.IconBase>
	)
}