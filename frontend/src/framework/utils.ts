export async function copyToClipboard(str: string): Promise<boolean>
{
	if (!navigator.clipboard)
        return false
    
    await navigator.clipboard.writeText(str)
    return true
}