
export const discord = 'https://discord.gg/UJ7zraNA9R'
export const emailAddress = 'contact@dbranch.news'
export const emailList = 'https://forms.gle/mgGM7CR93e3Dbvh76'
export const medium = 'https://medium.com/@dBranchDAO'
export const twitter = 'https://twitter.com/dBranchDAO'
export const volunteerForm = 'https://forms.gle/Ui2YFUPNQ4dBhiWx7'
export const website = 'http://dbranch.news'
export const whitePaper = '/dBranch-white-paper-v1.pdf'
export const youTubePlaylist = 'https://youtube.com/playlist?list=PLsZItVIVXWEEQHTlYKjmn7FfzqNzxfZUU'

export function ExternalLink(props) { return <a href={props.url} rel="noreferrer" target="_blank">{props.children}</a>; }