import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconBackspace(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 0,50
                L 35,10
                L 95,10
                L 95,90
                L 35,90
                Z

                M 40,20
                L 25,35

                L 42,50
                
                L 25,65
                L 40,80

                L 55,63

                L 70,80
                L 85,65
                
                L 68,50

                L 85,35
                L 70,20
                
                L 55,37
                Z"
            />
        </Framework.IconBase>
	)
}