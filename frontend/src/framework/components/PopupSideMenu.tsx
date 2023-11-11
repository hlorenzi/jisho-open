import * as Solid from "solid-js"
import { styled, keyframes } from "solid-styled-components"
import * as Framework from "../index.ts"


export function makePopupSideMenu(props: {
    childrenFn?: () => Solid.JSX.Element,
})
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
        >
            <Wrapper>
                <Content>
                    { props.childrenFn?.() }
                </Content>
            </Wrapper>
        </Dialog>
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
	    background-color: #00000018;
    }
`


const Dialog = styled.dialog`
    padding: 0;
    border: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: transparent;

    &::backdrop {
        animation-name: ${ backdropKeyframes };
        animation-duration: 0.1s;
    }
`


const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    display: grid;
    grid-template: auto / 1fr ${ Framework.pageWidth } 1fr;
    background-color: transparent;

    overflow: hidden;
    pointer-events: none;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        grid-template: auto / 0fr 1fr 0fr;
    }
`


const Content = styled.div`
    grid-column: 2;
    justify-self: end;

	width: min(60vw, calc(${ Framework.pageWidth } / 3));
    max-height: calc(100vh - 2em);
	overflow-x: hidden;
    pointer-events: all;

	text-align: left;
	color: ${ Framework.themeVar("textColor") };
	background-color: ${ Framework.themeVar("pageBkgColor") };

    border: 1px solid ${ Framework.themeVar("borderColor") };
    border-radius: 0.25rem;
    box-shadow: 0 0.15em 0.15em ${ Framework.themeVar("popupShadowColor") };
    
    margin: 1em;
    --local-pagePadding: 1em;
	padding-left: var(--local-pagePadding);
	padding-right: var(--local-pagePadding);
`