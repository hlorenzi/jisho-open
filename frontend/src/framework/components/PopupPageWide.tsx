import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const Dialog = styled.dialog<{
    y: number,
}>`
    margin: 0;
    padding: 0;
    border: 0;
    position: absolute;
    top: ${ props => props.y }px;
    width: 100vw;
    min-width: 100vw;
    overflow-x: hidden;
    background-color: transparent;
    outline: 0;

    &::backdrop {
	    background-color: #00000018; //${ Framework.themeVar("popupOverlayColor") };
    }
`


const arrowTipSize = 20


const ArrowTipShadow = styled.div<{
    x: number,
}>`
    width: 0;
    height: 0;
    z-index: -1;
    contain: layout;
    position: relative;
    left: ${ props => props.x - arrowTipSize - 0.5 }px;
    top: ${ (-arrowTipSize - 1).toString() }px;
    border-color: #0000 #0000 ${ Framework.themeVar("borderColor") } #0000;
    border-width: ${ (arrowTipSize + 1.5).toString() }px;
    border-style: solid;
    margin-bottom: ${ (-arrowTipSize * 2 - 2).toString() }px;
	pointer-events: none;
`


const ArrowTip = styled.div<{
    x: number,
}>`
    width: 0;
    height: 0;
    z-index: 1;
    contain: layout;
    position: relative;
    left: ${ props => props.x - arrowTipSize }px;
    top: ${ (-arrowTipSize).toString() }px;
    border-color: #0000 #0000 ${ Framework.themeVar("pageBkgColor") } #0000;
    border-width: ${ (arrowTipSize + 1).toString() }px;
    border-style: solid;
    margin-bottom: ${ (-arrowTipSize - 1).toString() }px;
	pointer-events: none;
`


const DivPageLayout = styled.div`
    width: 100vw;

    display: grid;
    grid-template: auto / 1fr auto 1fr;
    background-color: transparent;

    overflow-x: hidden;
    pointer-events: none;
    padding-bottom: 1em;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        grid-template: auto / 0fr 1fr 0fr;
    }
`


const DivPageContent = styled.div`
    grid-column: 2;

	width: ${ Framework.pageWidth };
	max-width: 100vw;
	overflow-x: hidden;
    pointer-events: all;

	text-align: left;
	color: ${ Framework.themeVar("textColor") };
	background-color: ${ Framework.themeVar("pageBkgColor") };

    border: 1px solid ${ Framework.themeVar("borderColor") };
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
    
	//padding-left: var(--local-pagePadding);
	//padding-right: var(--local-pagePadding);

	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        width: calc(100% - var(--local-pagePadding));

		border-left: 0;
		border-right: 0;
	}
`


export type PopupData = {
    onOpen: (anchorElem?: HTMLElement) => void
    onClose: () => void
    rendered: Solid.JSX.Element
}


export function makePopupPageWide(props: {
    childrenFn?: () => Solid.JSX.Element,
})
{
    let dialog: HTMLDialogElement | undefined = undefined

    const [open, setOpen] = Solid.createSignal(false)
    const [anchor, setAnchor] = Solid.createSignal({ x: 0, y: 0 })

    const onOpen = (anchorElem?: HTMLElement) => {
        if (anchorElem)
        {
            const rect = anchorElem.getBoundingClientRect()
            setAnchor({
                x: rect.x + rect.width / 2 + window.scrollX,
                y: rect.bottom + window.scrollY,
            })
        }

        setOpen(true)
        dialog?.showModal()
    }

    const onClose = () => {
        setOpen(false)
        dialog?.close()
    }

    const onClick = (ev: Event) => {
        if (ev.target === dialog)
            onClose()
    }

    const rendered = <Solid.Show when={ open() }>
        <Dialog
            ref={ dialog }
            onClick={ onClick }
            y={ anchor().y }
        >
            <ArrowTipShadow x={ anchor().x }/>
            <ArrowTip x={ anchor().x }/>
            <DivPageLayout>
                <DivPageContent>
                    { props.childrenFn?.() }
                </DivPageContent>
            </DivPageLayout>
        </Dialog>
    </Solid.Show>

    return {
        onOpen,
        onClose,
        rendered,
    }
}