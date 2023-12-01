import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export type PopupSideMenuData = {
    open: () => void
    close: () => void
    rendered: Solid.JSX.Element
}


export function makePopupSideMenu(props: {
    childrenFn?: () => Solid.JSX.Element,
}) : PopupSideMenuData
{
    let dialog: HTMLDialogElement | undefined = undefined

    const [isOpen, setIsOpen] = Solid.createSignal(false)

    const open = () => {
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
    } satisfies PopupSideMenuData
}


const backdropKeyframes = keyframes`
    0% {
	    opacity: 0;
    }

    100% {
	    opacity: 1;
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
        background-color: ${ Framework.themeVar("popupOverlayColor") };
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
        animation-fill-mode: forwards;
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

	padding: 0;
    --local-pagePadding: 1.5em;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        width: 100%;
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

    border-right: 1px solid ${ Framework.themeVar("borderColor") };
    border-left: 1px solid ${ Framework.themeVar("borderColor") };
    box-shadow: -0.15em 0 0.15em ${ Framework.themeVar("popupShadowColor") };
    
    padding-top: 4em;
	padding-left: var(--local-pagePadding);
	padding-right: var(--local-pagePadding);
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
		border-right: 0;
	}
`