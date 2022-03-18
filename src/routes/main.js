import { Link } from "react-router-dom";

export default function MainPage() {

const openIPFSDesktop = (e) => { window.dBranch.openInBrowser('https://docs.ipfs.io/install/ipfs-desktop/'); e.preventDefault() }

return (
<main>
    <div className='content'>
        <h1>Welcome to the dBranch editor!</h1>
        <p>
            To use this program you will need an IPFS node to connect to. 
            The easiest way to run one locally is to install <a href='https://docs.ipfs.io/install/ipfs-desktop/' onClick={openIPFSDesktop}>IPFS Desktop</a>.
            Head to the <Link to='/settings'>settings</Link> tab to test your connection or adjust the address.
        </p>
    </div>
</main>
);
}