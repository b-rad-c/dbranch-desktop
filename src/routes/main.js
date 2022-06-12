import { Link } from 'react-router-dom'
import { ipfsDownloadURL } from '../constants'
import { ExternalURL } from '../utilities/misc'

export default function MainPage() {

return (
<main>
    <div className='content'>
        <h1>Welcome to the dBranch news ecosystem!</h1>
        <h3>Instructions</h3>
        <ul>
            <li>Install an IPFS node, the easiest way to run one locally is to install <ExternalURL url={ipfsDownloadURL}>IPFS Desktop</ExternalURL>.</li>
            <li>Go to the <Link to='/browse'>browse</Link> tab to browse the dbranch news ecosystem!</li>
            <li>Go to the <Link to='/settings'>settings</Link> tab to test your connection or change the default IPFS address.</li>
            <li>Go to the <Link to='/edit'>editor</Link> tab to draft an article, you can save it on your computer and publish to IPFS when you're ready.</li>
            <li>Go to the <Link to='/files'>files</Link> tab to view your drafts and published articles.</li>
        </ul>
    </div>
</main>
);
}