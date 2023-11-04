import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconHelp(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle
                fill="currentColor"
                stroke="none"
                fillRule="evenodd"
                cx="50"
                cy="50"
                r="50"
            />
            <path
                fill="none"
                stroke="var(--theme-iconDetailColor)"
                strokeWidth="12"
                strokeLinecap="square"
                d="
                M 30,40
                Q 30,20, 50,20
                L 50,20
                Q 70,20, 70,35
                L 70,35
                Q 70,50, 55,50
                L 55,50
                Q 50,50, 50,60
                M 50,80
                L 50,81
            "/>
        </Framework.IconBase>
	)
}