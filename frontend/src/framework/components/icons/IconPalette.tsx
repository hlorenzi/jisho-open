import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


export function IconPalette(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none" d="
                M 50,5
                Q 5,5, 5,50
                L 5,50
                Q 5,70, 30,70
                L 40,70
                Q 50,70, 50,75
                L 50,75
                Q 50,95, 70,95
                L 70,95
                Q 95,95, 95,50
                L 95,50
                Q 95,5, 50,5
                Z
            "/>
            <ellipse
                fill="var(--theme-iconDetailColor)"
                stroke="none"
                cx="27"
                cy="42"
                rx="8"
                ry="6"
            />
            <ellipse
                fill="var(--theme-iconDetailColor)"
                stroke="none"
                cx="38"
                cy="25"
                rx="8"
                ry="6"
            />
            <ellipse
                fill="var(--theme-iconDetailColor)"
                stroke="none"
                cx="62"
                cy="25"
                rx="8"
                ry="6"
            />
            <ellipse
                fill="var(--theme-iconDetailColor)"
                stroke="none"
                cx="73"
                cy="42"
                rx="8"
                ry="6"
            />
            <ellipse
                fill="var(--theme-iconDetailColor)"
                stroke="none"
                cx="65"
                cy="70"
                rx="4"
                ry="4"
            />
        </Framework.IconBase>
	)
}