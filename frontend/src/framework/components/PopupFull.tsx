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
	    background-color: transparent;
    }

    100% {
	    background-color: ${ Framework.themeVar("popupOverlayColor") };
    }
`


const PopupDialog = styled.dialog`
    border: 0;
    padding: 0;
    padding-left: calc(100vw - 100%);
    width: min(calc(100% - 0.5em), calc(${ Framework.pageWidth } - 1.5em));
    max-height: calc(100vh - 8em);
    background-color: transparent;

    &:modal {
        max-height: calc(100vh - 8em);
    }

	@media (max-width: ${ Framework.pageSmallWidthThreshold }) {
        padding-left: 0;
    }

    &::backdrop {
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
        animation-fill-mode: forwards;
    }
`


const PopupWrapper = styled.div`
    max-width: 100%;
    max-height: 100%;
    padding: 0.5em;
    border: 1px solid ${ Framework.themeVar("borderColor") };
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`