import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../index.ts"


const hasObserver = !!window.IntersectionObserver


export function Image(props: {
    alt?: string,
    src?: string,
    srcset?: string,
    size?: string,
    style?: Solid.JSX.CSSProperties,
})
{
    let imgRef: HTMLImageElement | undefined = undefined


    const [visible, setVisible] =
        Solid.createSignal(hasObserver ? false : true)

    const [opacity, setOpacity] =
        Solid.createSignal(hasObserver ? "0" : "1")

    
    if (hasObserver)
    {
        Solid.createEffect(() => {
            if (!imgRef)
                return
            
            const intersectObserver = new IntersectionObserver((entries) => {
                for (const entry of entries)
                {
                    if (!entry.isIntersecting)
                        continue
                    
                    (entry.target as HTMLImageElement).onload =
                        () => setOpacity("1")

                    setVisible(true)
                }
            })

            intersectObserver.observe(imgRef)

            Solid.onCleanup(() => {
                intersectObserver.unobserve(imgRef!)
            })
        })
    }

	return <StyledImage
        ref={ imgRef }
        alt={ props.alt }
        src={ visible() ? props.src : "" }
        srcSet={ visible() ? props.srcset : "" }
        opacity={ opacity() }
        size={ props.size }
        style={ props.style }/>
}


const StyledImage = styled.img<{
    size?: string,
    opacity: string,
}>`
    opacity: ${ props => props.opacity };
    transition: opacity 0.1s;
    ${ props => props.size ? `
        width: ${ props.size };
        height: ${ props.size };
    ` : `` }
`