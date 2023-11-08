import * as Solid from "solid-js"


export interface Route
{
    patterns: string[]
    acceptsNoReload?: boolean
    load: () => Promise<PageFactory>
}


export type PageFactory = (props: RouteProps) => Solid.JSX.Element


export interface RouteProps
{
    routeMatch: Solid.Accessor<RouteMatch | null>
}


export type KeyValueObject = { [key: string]: string }


export interface RouteMatch
{
    route: Route
    matches: KeyValueObject
    query: KeyValueObject
}


export function getMatchForPath(
    routes: Route[],
    path: string,
    queryStr: string)
    : RouteMatch | null
{
    for (const route of routes)
    {
        for (const pattern of route.patterns)
        {
            const matches = matchPattern(pattern, path)
            if (matches)
            {
                const queryParser = new URLSearchParams(queryStr)
                const query: KeyValueObject = {}
                for (const [key, value] of queryParser.entries())
                {
                    query[key] = value
                }

                return {
                    route,
                    matches,
                    query,
                }
            }
        }
    }

    return null
}


export function normalizePath(
    path: string)
    : string
{
    if (path.startsWith("/"))
        path = path.slice(1)
        
    if (path.endsWith("/"))
        path = path.slice(0, path.length - 1)

    return path
}


export function matchPattern(
    pattern: string,
    path: string)
    : KeyValueObject | null
{
    if (!path)
        return null

    if (pattern === "*")
        return {}
    
    pattern = normalizePath(pattern)
    path = normalizePath(path)

    const patternFolders = pattern.split("/")
    const pathFolders = path.split("/")

    if (patternFolders.length !== pathFolders.length)
        return null

    const matches: KeyValueObject = {}
    for (let i = 0; i < patternFolders.length; i++)
    {
        if (patternFolders[i].startsWith(":"))
        {
            const argName = patternFolders[i].slice(1)
            matches[argName] = decodeURIComponent(pathFolders[i])
        }
        else if (patternFolders[i] !== pathFolders[i])
            return null
    }

    return matches
}