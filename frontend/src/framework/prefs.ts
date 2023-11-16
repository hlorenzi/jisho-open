import * as Solid from "solid-js"
import * as Framework from "./index.ts"


const [prefsSignal, setPrefsSignal] = Solid.createSignal(0)


export function usePrefs<T>(prefsDefault: T): T
{
    prefsSignal()
    const prefs = Framework.LocalStorage.readJson<T>("prefs", {})
    return {
        ...prefsDefault,
        ...prefs,
    }
}


export function mergePrefs<T>(merge: Partial<T>)
{
    const newPrefs: Partial<T> = {
        ...usePrefs<Partial<T>>({}),
        ...merge,
    }

    Framework.LocalStorage.writeJson<Partial<T>>("prefs", newPrefs)
    setPrefsSignal(s => s + 1)
}