import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconCircleSmall(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle
                fill="currentColor"
                cx="50"
                cy="50"
                r="25"
            />
        </Framework.IconBase>
	)
}