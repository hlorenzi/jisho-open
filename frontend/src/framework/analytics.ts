import * as Framework from "./index.ts"


let gTagId: string | null = null
let gIsAdmin = false


declare function gtag(...args: any[]): void;


export function setUserAdmin(isAdmin: boolean)
{
	gIsAdmin = isAdmin
}


export function init(tagId: string)
{
	if (!tagId)
		return

    gTagId = tagId
	
	if (typeof gtag === "function")
		return

    if (Framework.isDev())
		console.log("%cAnalytics.init", "color: white; background-color: purple;")
	
	overrideCookies()

	const script1 = document.createElement("script")
	script1.async = true
	script1.src = `https://www.googletagmanager.com/gtag/js?id=${ gTagId }`
	document.body.appendChild(script1)

	const script2 = document.createElement("script")
	script2.innerHTML = `
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
        gtag('consent', '${ gTagId }', {
            ad_storage: 'denied',
			analytics_storage: 'denied',
			functionality_storage: 'denied',
			personalization_storage: 'denied',
			security_storage: 'denied',
            client_storage: 'none',
        });
		gtag('config', '${ gTagId }', {
            send_page_view: false,
        });
		gtag('js', new Date());
	`
	document.body.appendChild(script2)
}


/// From https://stackoverflow.com/a/75625761/1161194
function overrideCookies()
{
	/*const overriddenCookies: any = {}

	Object.defineProperty(document, "cookie", {
		get: function() {
			const allCookies: string[] = []
			for (const [key, value] of Object.entries(overriddenCookies)) {
				allCookies.push(`${key}=${value}`)
			}

			return allCookies.join("; ")
		},
			
		set: function(value: string) {
			const cookieParts = value.split("=")
			const cookieName = cookieParts.shift()!
			const cookieValue = cookieParts.join("=")

			overriddenCookies[cookieName] = cookieValue
			return value
		}
	})*/
}


function isAllowed()
{
	return (
		gTagId &&
		!gIsAdmin &&
        !Framework.isDev() &&
		typeof gtag === "function"
	)
}


export function navigate(href: string)
{
	if (!isAllowed())
		return
	
	if (Framework.isDev())
		console.log("%cAnalytics.navigate", "color: white; background-color: purple;", href)
	
	gtag("event", "page_view", {
		page_location: href,
	})
}


export function event(name: string)
{
	if (!isAllowed())
		return
	
    if (Framework.isDev())
		console.log("%cAnalytics.event", "color: white; background-color: purple;", name)
	
	gtag("event", name)
}


export function exception(descr: string)
{
	if (!isAllowed())
		return
	
    if (Framework.isDev())
		console.log("%cAnalytics.exception", "color: white; background-color: purple;", name)
	
	gtag("event", "exception", {
		description: descr,
		fatal: true,
	})
}