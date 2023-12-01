import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


type SetProgressFunc = (progress0to100: number) => void


export type PopupLongOperationData = {
    run: (fn: (setProgress: SetProgressFunc) => Promise<void>) => Promise<void>
    rendered: Solid.JSX.Element
}


export function makePopupLongOperation(props: {
    title: string,
}) : PopupLongOperationData
{
    let dialog: HTMLDialogElement | undefined = undefined

    const [isOpen, setIsOpen] = Solid.createSignal(false)
    const [progress, setProgress] = Solid.createSignal(0)

    const open = () => {
        setIsOpen(true)
        dialog?.showModal()
    }

    const close = () => {
        setIsOpen(false)
        dialog?.close()
    }

    const rendered =
        <Solid.Show when={ isOpen() }>
            <PopupDialog ref={ dialog }>
                <PopupWrapper>
                    <h2>
                        { props.title }
                    </h2>
                    <br/>
                    <Framework.LoadingBar
                        progress0to100={ progress() }
                    />
                </PopupWrapper>
            </PopupDialog>
        </Solid.Show>

    const run = async (fn: (setProgress0to100: SetProgressFunc) => Promise<void>) => {
        try
        {
            setProgress(0)
            open()
            await fn(setProgress)
            setProgress(100)
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


const backdropKeyframes = keyframes`
    0% {
	    opacity: 0;
    }

    100% {
	    opacity: 1;
    }
`


const PopupDialog = styled.dialog`
    padding: 0.25em;
    border: 0;
    width: 25em;
    max-width: min(calc(100% - 0.5em), ${ Framework.pageWidth });
    max-height: calc(100vh - 4em);
    background-color: transparent;
    
    &::backdrop {
        background-color: ${ Framework.themeVar("popupOverlayColor") };
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
        animation-fill-mode: forwards;
    }
`


const PopupWrapper = styled.div`
    max-width: 100%;
    max-height: 100%;
    padding: 0.5em;
    color: ${ Framework.themeVar("textColor") };
    border: 1px solid ${ Framework.themeVar("borderColor") };
    background-color: ${ Framework.themeVar("pageBkgColor") };
    border-radius: ${ Framework.themeVar("borderRadius") };
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
`