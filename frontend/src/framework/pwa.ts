import * as Framework from "./index.ts"


let pwaDeferredPrompt: BeforeInstallPromptEvent | undefined = undefined


interface BeforeInstallPromptEvent extends Event
{
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed"
        platform: string
    }>
    prompt(): Promise<void>
}


declare global
{
    interface WindowEventMap
    {
        beforeinstallprompt: BeforeInstallPromptEvent
    }
}


export function pwaEnable()
{
    if ("serviceWorker" in navigator)
    {
        window.addEventListener("load", async () => {
            const registration = await navigator.serviceWorker
                .register("/pwa_worker.js")
            
            if (Framework.isDev())
                console.log("ServiceWorker registration successful with scope:", registration.scope)
        })
    }


    window.addEventListener("beforeinstallprompt", (ev) => {
        if (Framework.isDev())
            console.log("beforeinstallprompt")
        
        pwaDeferredPrompt = ev
    })
}


export function pwaInstall()
{
    if (pwaDeferredPrompt === undefined)
    {
        window.alert(
            "Could not start the installation, or the app is already installed!\n\n" +
            "If you're using Safari on iOS, please install via:\n\n" +
            "    Share > Add to Home Screen"
        )
        return
    }
    
    pwaDeferredPrompt.prompt()
}