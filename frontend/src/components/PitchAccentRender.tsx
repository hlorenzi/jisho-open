import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"


export function PitchAccentRender(props: {
    pitch: string,
})
{
	const rendered: Solid.JSX.Element[] = []

	const str = props.pitch

	let c = 0
	let prevPitch = false
	while (c < str.length)
	{
		let curPitch: boolean = prevPitch

		if (str[c] == "ꜛ")
		{
			curPitch = true
			c++
		}
		else if (str[c] == "ꜜ")
		{
			curPitch = false
			c++
		}

		let letter = str[c]
		c++

		let nasal = false
		if (str[c] == "~")
		{
			nasal = true
			c++
		}

		let silent = false
		if (str[c] == "*")
		{
			silent = true
			c++
		}
			
		let nextPitch = curPitch
		if (c < str.length)
		{
			if (str[c] == "ꜛ")
			{
				nextPitch = true
			}
			else if (str[c] == "ꜜ")
			{
				nextPitch = false
			}
		}

        if (!letter)
            break

		rendered.push(
            <PitchLines
                topLine={ curPitch }
                rightLine={ curPitch && !nextPitch }
            >
                <PitchExtra
                    nasal={ nasal }
                    silent={ silent }
                >
                    { letter }
                </PitchExtra>
            </PitchLines>
        )

		prevPitch = curPitch
	}

	return <Wrapper>
        { rendered }
    </Wrapper>
}


const Wrapper = styled.div`
    display: inline-block;
    background-color: ${ Framework.themeVar("textStrongBkgColor") };
    border: 2px solid ${ Framework.themeVar("textStrongBkgColor") };
    padding: 0.1em 0.2em 0 0.2em;
    border-radius: 0.25rem;
    margin: 0;
    margin-right: 1em;
`


const PitchLines = styled.span<{
    topLine: boolean,
    rightLine: boolean,
}>`
    ${ props => props.topLine ?
        `border-top: 2px solid ${ Framework.themeVar("text2ndColor") };` :
        ``
    }
    ${ props => props.rightLine ?
        `border-right: 2px solid ${ Framework.themeVar("text2ndColor") };` :
        ``
    }
`


const PitchExtra = styled.span<{
    nasal: boolean,
    silent: boolean,
}>`
    border-radius: 50%;

    ${ props => props.silent ?
        `border: 2px dotted ${ Framework.themeVar("text2ndColor") };` :
        ``
    }

    ${ props => props.nasal ?
        `text-decoration: ${ Framework.themeVar("text2ndColor") } wavy underline;` :
        ``
    }
`