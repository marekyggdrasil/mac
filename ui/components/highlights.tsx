export const MinaValue = ({ children }) => {
    return (
        <code className="rounded-md bg-primary p-1">
            { children }
        </code>
)}

export const MinaBlockchainLength = ({ children }) => {
    return (
        <code className="rounded-md bg-accent p-1">
            { children }
        </code>
)}

export const MinaSecretValue = ({ children }) => {
    return (
        <code className="rounded-md bg-secondary p-1 blurred">
            { children }
        </code>
)}
