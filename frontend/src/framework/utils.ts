export function isDev()
{
    return window.location.href.startsWith("http://127.0.0.1") ||
        window.location.href.startsWith("http://localhost")
}


export function isMobile()
{
	return window.matchMedia("(pointer: coarse)").matches
}


export async function copyToClipboard(str: string): Promise<boolean>
{
	if (!navigator.clipboard)
        return false
    
    await navigator.clipboard.writeText(str)
    return true
}


export function formPlural(
    count: number,
    base: string,
    pluralSuffix: string)
{
    if (count === 1)
        return base

    return base + pluralSuffix
}


export type DateOrString = Date | string


export function dateNew(date: DateOrString): Date
{
    if (typeof date === "string")
        return new Date(date)

    return date
}


export function dateCompare(dateA: DateOrString, dateB: DateOrString)
{
	return dateNew(dateA).getTime() - dateNew(dateB).getTime()
}


export function dateMax(dateA: DateOrString, dateB: DateOrString)
{
	const timeA = dateNew(dateA).getTime()
    const timeB = dateNew(dateB).getTime()
    return new Date(Math.max(timeA, timeB))
}


export function dateToStr(date: DateOrString)
{
	return dateNew(date).toLocaleString(
		"ja-JP",
		{ dateStyle: "short" })
}


export function dateToFullStr(date: DateOrString)
{
	const timezoneOffset = (new Date()).getTimezoneOffset() * 60000
	return (new Date(dateNew(date).getTime() - timezoneOffset))
		.toISOString()
		.slice(0, -1)
		.replace("T", " ")
}


export function dateAndElapsedToStr(date: DateOrString)
{
	return `${ dateToStr(date) } (${ dateElapsedToStr(date) } ago)`
}


export function dateElapsedToStr(date: DateOrString)
{
	const millisec = new Date().getTime() - dateNew(date).getTime()
	const seconds = Math.max(1, millisec / 1000)
	const minutes = seconds / 60
	const hours = minutes / 60
	const days = hours / 24
	const weeks = days / 7
	const months = days / 30
	const years = days / 385
	
	if (minutes < 1)
		return Math.floor(seconds) + "s"
	
	if (hours < 1)
		return Math.floor(minutes) + "m"
	
	if (days < 1)
		return Math.floor(hours) + "h"
	
	if (months < 2)
		return Math.floor(days) + "d"
	
	if (years < 1)
		return Math.floor(months) + "mo"
	
	return Math.floor(years) + "y"
}