import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export type PopupData = {
    open: (anchorElem?: HTMLElement) => void
    close: () => void
    rendered: Solid.JSX.Element
}


export function makePopupSideMenu(props: {
    childrenFn?: () => Solid.JSX.Element,
})
{
    let dialog: HTMLDialogElement | undefined = undefined

    const [isOpen, setIsOpen] = Solid.createSignal(false)

    const open = (anchorElem?: HTMLElement) => {
        setIsOpen(true)
        dialog?.showModal()
    }

    const close = () => {
        setIsOpen(false)
        dialog?.close()
    }

    const onClick = (ev: Event) => {
        if (ev.target === dialog)
            close()
    }

    const rendered = <Solid.Show when={ isOpen() }>
        <Dialog
            ref={ dialog }
            onClick={ onClick }
            class="PopupPageSideMenu"
        >
            <DivPageLayout>
                <DivPageContent>
                    <DivPageContent2>
                        { props.childrenFn?.() }
                    </DivPageContent2>
                </DivPageContent>
            </DivPageLayout>
        </Dialog>
    </Solid.Show>

    return {
        open,
        close,
        rendered,
    } satisfies PopupData
}


const backdropKeyframes = keyframes`
    0% {
	    background-color: transparent;
    }

    100% {
	    background-color: #00000018;
    }
`


const Dialog = styled.dialog`
    margin: 0;
    padding: 0;
    border: 0;
    position: fixed;
    width: 100vw;
    min-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    background-color: transparent;
    outline: 0;

    &::backdrop {
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
    }
`


const DivPageLayout = styled.div`
    width: 100vw;
    min-height: 100vh;

    display: grid;
    grid-template: auto / 1fr auto 1fr;
    background-color: transparent;

    overflow-x: hidden;
    pointer-events: none;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        grid-template: auto / 0fr 1fr 0fr;
    }
`


const DivPageContent = styled.div`
    grid-column: 2;

    display: grid;
    grid-template: auto / auto;

	width: ${ Framework.pageWidth };
	max-width: 100vw;
	overflow-x: hidden;
    pointer-events: none;

	text-align: left;
	color: ${ Framework.themeVar("textColor") };

    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    
	padding: 0;
    --local-pagePadding: 1.5em;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        width: 100%;
		border-right: 0;
	}

    @media (pointer: coarse)
    {
        width: 100%;
    }
`


const DivPageContent2 = styled.div`
    width: 16em;
    max-width: 75vw;

    background-color: ${ Framework.themeVar("pageBkgColor") };
    justify-self: end;
    pointer-events: all;

    border-left: 1px solid ${ Framework.themeVar("borderColor") };
    box-shadow: -0.15em 0 0.15em ${ Framework.themeVar("popupShadowColor") };
    
    padding-top: 4em;
	padding-left: var(--local-pagePadding);
	padding-right: var(--local-pagePadding);
`