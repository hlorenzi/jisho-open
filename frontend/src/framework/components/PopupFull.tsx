import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export type PopupFullData = {
    open: () => void
    close: () => void
    rendered: Solid.JSX.Element
}


export function makePopupFull(props: {
    childrenFn?: () => Solid.JSX.Element,
}) : PopupFullData
{
    let dialog: HTMLDialogElement | undefined

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
            <PopupDialog
                ref={ dialog }
                onClick={ onClick }
            >
                <PopupWrapper>
                    { props.childrenFn?.() }
                </PopupWrapper>
            </PopupDialog>
        </Solid.Show>

    return {
        rendered,
        open,
        close,
    }
}


const backdropKeyframes = keyframes`
    0% {
	    opacity: 0;
    }

    100% {
	    opacity: 1;
    }
`


const PopupDialog = styled.dialog`
    border: 0;
    padding: 0.25em;
    padding-left: calc(100vw - 100%);
    background-color: transparent;

	@media (max-width: ${ Framework.pageSmallWidthThreshold }) {
        padding-left: 0;
    }

    &::backdrop {
        background-color: ${ Framework.themeVar("popupOverlayColor") };
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
        animation-fill-mode: forwards;
    }
`


const PopupWrapper = styled.div`
    padding: 0.5em;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`