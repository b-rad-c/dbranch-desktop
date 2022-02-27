import * as constants from '../constants';
import { ExternalLink } from '../constants'

const pClass = 'text-dark text-start info-content'
export default function Info() {
    return (
    <main>
        <div className='text-dark'>
            <h1>Info stuffs</h1>

            <p className={pClass}>
                <h2>White paper</h2>
                ::&nbsp;<ExternalLink url={constants.whitePaper}>download</ExternalLink>
            </p>

            <p className={pClass}>
                <h2>Media</h2>
                ::&nbsp;<ExternalLink url={constants.medium}>medium</ExternalLink>
                <br />
                ::&nbsp;<ExternalLink url={constants.youTubePlaylist}>youtube</ExternalLink>
            </p>

            <p className={pClass}>
                <h2>Contact</h2>
                ::&nbsp;<ExternalLink url={constants.twitter}>twitter</ExternalLink>
                <br />
                ::&nbsp;<ExternalLink url={constants.discord}>discord</ExternalLink>
                <br />
                ::&nbsp;<ExternalLink url={constants.emailList}>email list</ExternalLink>
                <br />
                ::&nbsp;<ExternalLink url={constants.volunteerForm}>help</ExternalLink>
                <br />
                ::&nbsp;<a href={"mailto:" + constants.emailAddress}>{constants.emailAddress}</a>
            </p>
        </div>
        
    </main>
    );
    }