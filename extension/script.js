const urlHome = "https://jisho.hlorenzi.com"
const urlSearch = "https://jisho.hlorenzi.com/search/"

const debounceDelayMs = 500
let debounceId = null

const popup = document.createElement("iframe")
popup.src = urlHome
popup.sandbox = "allow-scripts allow-same-origin"
popup.style.display = "none"
popup.style.borderRadius = "0.25em"
popup.style.border = "0"
popup.style.boxShadow = "0 0.25em 0.5em 0 black"
document.body.appendChild(popup)


document.addEventListener("selectionchange", () => {
    popup.style.display = "none"

    const selection = document.getSelection()
    console.log(selection)

    if (!selection)
        return

    const text = selection.toString().trim()
    if (text === "")
        return

    window.clearTimeout(debounceId)
    
    debounceId = window.setTimeout(() => {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        const w = 400
        const h = 300
        const x = Math.max(0, (rect.left + rect.right) / 2 - w / 2 + window.scrollX)
        const y = rect.bottom + 4 + window.scrollY

        popup.style.display = "block"
        popup.style.position = "absolute"
        popup.style.left = `${x}px`
        popup.style.top = `${y}px`
        popup.style.width = `${w}px`
        popup.style.height = `${h}px`

        popup.contentWindow.history.pushState(null, "", "/search/" + text)
        
        const ev = new Event("lorenzi_pushstate")
        popup.contentWindow.dispatchEvent(ev)
        
        console.log(x, y, popup)
    }, debounceDelayMs)
})