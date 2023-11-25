import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export type PopupBusyData = {
    run: (fn: () => Promise<void>) => Promise<void>
    rendered: Solid.JSX.Element
}


export function makePopupBusy() : PopupBusyData
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

    const rendered = <Solid.Show when={ isOpen() }>
            <PopupDialog
                ref={ dialog }
            >
                <DivOpacity inert>
                    <Framework.LoadingBar/>
                </DivOpacity>
            </PopupDialog>
        </Solid.Show>

    const run = async (fn: () => Promise<void>) => {
        try
        {
            open()
            await fn()
        }
        finally
        {
            close()
        }
    }

    return {
        rendered,
        run,
    }
}


const PopupDialog = styled.dialog`
    padding: 0.25em;
    border: 0;
    max-width: min(calc(100% - 0.5em), ${ Framework.pageWidth });
    max-height: calc(100vh - 4em);
    background-color: transparent;
`


const DivOpacity = styled("div")`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${ Framework.themeVar("pageTransitionOverlayColor") };
    z-index: 1;
`