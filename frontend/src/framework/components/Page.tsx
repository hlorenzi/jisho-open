import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


export const pageWidth = "60rem"
export const pageSmallWidthThreshold = "66rem"


const DivLayout = styled.div`
    width: 100vw;
    min-height: 100vh;

    display: grid;
    grid-template: auto 1fr / 1fr auto 1fr;
    background-color: ${ Framework.themeVar("voidBkgColor") };

    overflow-x: hidden;

	@media (max-width: ${ pageSmallWidthThreshold })
	{
        grid-template: auto 1fr / 0fr 1fr 0fr;
    }
`


const DivContent = styled.div`
    grid-row: 2;
    grid-column: 2;

	width: ${ pageWidth };
	max-width: 100vw;
	overflow-x: hidden;

	padding-bottom: 4rem;
    
	text-align: left;
	color: ${ Framework.themeVar("textColor") };
	background-color: ${ Framework.themeVar("pageBkgColor") };

    border-left: 1px solid ${ Framework.themeVar("borderColor") };
    border-right: 1px solid ${ Framework.themeVar("borderColor") };
    
	padding-left: ${ Framework.themeVar("pagePaddingBig") };
	padding-right: ${ Framework.themeVar("pagePaddingBig") };

    --local-pagePadding: ${ Framework.themeVar("pagePaddingBig") };
    
	@media (max-width: ${ pageSmallWidthThreshold })
	{
        width: calc(100% - ${ Framework.themeVar("pagePaddingSmall") });

		border-left: 0;
		border-right: 0;

        --local-pagePaddingSmall: min(4vw, ${ Framework.themeVar("pagePaddingSmall") });

        padding-left: var(--local-pagePaddingSmall);
        padding-right: var(--local-pagePaddingSmall);
        
        --local-pagePadding: var(--local-pagePaddingSmall);
	}
`


export function Page(props: {
    children: Solid.JSX.Element,
    width?: string,
    sideMenu?: Solid.JSX.Element,
    title?: string,
})
{
    const siteTitle = "Lorenzi's Jisho Open"

    Solid.createComputed(() => {
        document.title = props.title ?
            `${ props.title } • ${ siteTitle }` :
            siteTitle
    })

    return <DivLayout>
        <DivContent>
            <Framework.LogoHeader/>
            <main>
                { props.children }
            </main>
        </DivContent>
    </DivLayout>
}