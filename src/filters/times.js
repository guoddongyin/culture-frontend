export const times = sendtime => {
    return new Date(sendtime).toLocaleString().split(' ')[0].replace(/\//g,'-')
}
