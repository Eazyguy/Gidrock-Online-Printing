export function generateGID():string{
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase()
    const time = Date.now().toString().slice(-4)
    return `GID-${rand}${time}`
}