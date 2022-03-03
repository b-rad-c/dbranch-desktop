export default function FilesPage(props) {

const label = 'files'
return (
<main>
    <div className='content'>
        <p className='inline-header'><strong>published :: </strong>0 {label}</p>
    </div>
    <div className='content'>
        <p className='inline-header'><strong>draft :: </strong>0 {label}</p>
    </div>
</main>
);
}