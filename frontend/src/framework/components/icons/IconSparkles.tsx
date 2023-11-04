import * as Solid from "solid-js"
import * as Framework from "../../index.ts"


function generateSparklePath(
    x: number,
    y: number,
    halfSize: number,
    halfArmWidth: number)
    : string
{
    return `
        M ${ x + halfArmWidth },${ y - halfSize }
        L ${ x - halfArmWidth },${ y - halfSize }
        Q ${ x - halfArmWidth },${ y - halfArmWidth }, ${ x - halfSize },${ y - halfArmWidth }
        L ${ x - halfSize },${ y - halfArmWidth }
        L ${ x - halfSize },${ y + halfArmWidth }
        Q ${ x - halfArmWidth },${ y + halfArmWidth }, ${ x - halfArmWidth },${ y + halfSize }
        L ${ x - halfArmWidth },${ y + halfSize }
        L ${ x + halfArmWidth },${ y + halfSize }
        Q ${ x + halfArmWidth },${ y + halfArmWidth }, ${ x + halfSize },${ y + halfArmWidth }
        L ${ x + halfSize },${ y + halfArmWidth }
        L ${ x + halfSize },${ y - halfArmWidth }
        Q ${ x + halfArmWidth },${ y - halfArmWidth }, ${ x + halfArmWidth },${ y - halfSize }
        Z
    `
}


export function IconSparkles(props: Framework.IconBaseProps)
{
	return (
        <Framework.IconBase { ...props }>
            <path fill="currentColor" stroke="none"
                d={ generateSparklePath(40, 40, 35, 4) }
            />
            <path fill="currentColor" stroke="none"
                d={ generateSparklePath(75, 75, 20, 2.5) }
            />
        </Framework.IconBase>
	)
}