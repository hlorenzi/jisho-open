import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconHelp(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <circle
                fill="currentColor"
                stroke="none"
                fill-rule="evenodd"
                cx="50"
                cy="50"
                r="50"
            />
            <g style={{ color: Framework.themeVar("iconDetailColor") }}>
                <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="12"
                    stroke-linecap="square"
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
            </g>
        </Framework.IconBase>
	)
}