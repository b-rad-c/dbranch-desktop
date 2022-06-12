export function ExternalURL(props) {
    const openURL = (e) => { window.dBranch.openInBrowser(props.url); e.preventDefault() }
    return <a href={props.url} onClick={openURL}>{props.children}</a>
}