import * as Framework from "./index.ts"


export function readStr(key: string, def: string = "")
{
	try
	{
		const str = localStorage.getItem(key)

		//if (Framework.isDev())
		//	console.log("read storage", key, str)

		if (typeof str === "string")
			return str
	}
	catch (e)
	{
		console.error(e)
	}
			
	return def
}


export function readJson<T>(key: string, def: Partial<T> = {}): Partial<T>
{
	const str = readStr(key, "")

    //if (Framework.isDev())
	//	console.log("read storage json", key, str)
	
	if (typeof str !== "string" ||
        str === "")
		return def
	
	try
	{
		return JSON.parse(str) as Partial<T>
	}
	catch (e)
	{
		console.error(e)
	}
			
	return def
}


export function writeStr(key: string, str: string)
{
	try
	{
		//if (Framework.isDev())
		//	console.log("write storage", key, str)
		
		localStorage.setItem(key, str)
	}
	catch (e)
	{
		console.error(e)
	}
}


export function writeJson<T>(key: string, obj: T)
{
	try
	{
		//if (Framework.isDev())
		//	console.log("write storage json", key, obj)

		localStorage.setItem(key, JSON.stringify(obj))
	}
	catch (e)
	{
		console.error(e)
	}
}


export function remove(key: string)
{
	try
	{
		localStorage.removeItem(key)

		//if (Framework.isDev())
		//	console.log("delete storage", key)
	}
	catch (e)
	{
		console.error(e)
	}
}