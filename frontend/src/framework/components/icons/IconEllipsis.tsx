import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconEllipsis(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle fill={ "currentColor" } stroke="none"
                cx="15"
                cy="50"
                r="12"
            />
            <circle fill={ "currentColor" } stroke="none"
                cx="50"
                cy="50"
                r="12"
            />
            <circle fill={ "currentColor" } stroke="none"
                cx="85"
                cy="50"
                r="12"
            />
        </Framework.IconBase>
	)
}