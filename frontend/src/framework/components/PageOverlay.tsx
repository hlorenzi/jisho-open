import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export function PageOverlay(props: {
    childrenTop?: Solid.JSX.Element,
    childrenBottom?: Solid.JSX.Element,
})
{
	return <DivOverlay>
        <DivLayout>
            <DivContent>
                <DivZones>
                    { props.childrenTop ?? <div/> }
                    <div/>
                    { props.childrenBottom ?? <div/> }
                </DivZones>
            </DivContent>
        </DivLayout>
	</DivOverlay>
}


const DivOverlay = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100%;
    height: 100dvh;
    overflow: hidden;
    pointer-events: none;
    z-index: 1000;
`


const DivLayout = styled.div`
    width: 100vw;
    height: 100%;

    display: grid;
    grid-template: auto 1fr / 1fr auto 1fr;
    background-color: transparent;
    overflow: hidden;
    pointer-events: none;

	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        grid-template: auto 1fr / 0fr 1fr 0fr;
    }
`


const DivContent = styled.div`
    grid-row: 2;
    grid-column: 2;

	width: ${ Framework.pageWidth };
	max-width: 100vw;
    height: 100%;
	overflow: hidden;
    pointer-events: none;

	text-align: left;
	color: ${ Framework.themeVar("textColor") };
	background-color: transparent;

	padding-left: ${ Framework.themeVar("pagePaddingBig") };
	padding-right: ${ Framework.themeVar("pagePaddingBig") };

    --local-pagePadding: ${ Framework.themeVar("pagePaddingBig") };
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        width: calc(100% - ${ Framework.themeVar("pagePaddingSmall") });

        --local-pagePaddingSmall: min(2vw, ${ Framework.themeVar("pagePaddingSmall") });

        padding-left: var(--local-pagePaddingSmall);
        padding-right: var(--local-pagePaddingSmall);
        
        --local-pagePadding: var(--local-pagePaddingSmall);
	}

    @media (pointer: coarse)
    {
        width: 100%;
    }
`


const DivZones = styled.div`
    display: grid;
    grid-template: auto 1fr auto / 1fr;
    height: 100%;
`