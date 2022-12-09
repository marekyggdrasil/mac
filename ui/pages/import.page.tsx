export default function _Import() {
    return (
        <div>
            <article className="container prose">
                <h1>Import Contract</h1>
                <p>The code section below is editable. Click on it and paste your MACPACK message.</p>
                <div className="rounded-md not-prose bg-primary text-primary-content">
                    <div className="p-4">
                        <code contenteditable="true">Paste your MACPACK here...
                        </code>
                    </div>
                </div>
                <p>Then hit the import button below!</p><button className="btn">Import</button>
            </article>
        </div>
    )
}
