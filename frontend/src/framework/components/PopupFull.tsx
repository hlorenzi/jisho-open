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
    padding: 0.25em;
    border: 0;
    max-width: min(calc(100% - 0.5em), ${ Framework.pageWidth });
    max-height: calc(100vh - 4em);
    background-color: transparent;

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
    border-radius: 0.25rem;
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`