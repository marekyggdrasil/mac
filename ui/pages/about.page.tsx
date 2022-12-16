export default function About() {
    return (
        <article className="container gap-8 columns-2 prose">
            <h1>About <i>MAC!</i></h1>

            <div className="break-inside-avoid">
                <h2>Mina</h2>
                <p>Mina is often referred to as the world's lightest blockchain. It is a cryptocurrency reliant on the innovative zero-knowledge technology, which, very briefly, is a wide range of mathematical or cryptographic protocols permitting one to prove existence of certain information without revealing the information itself. This is a powerful tool which makes it possible for Mina to allow off-chain smart contracts which can be validated without knowledge of the details of the contract. <i>MAC!</i> is just one of the innovative projects using this approach.</p>
            </div>

            <div className="break-inside-avoid">
                <h2>Inspirations</h2>
                <p>The very idea of arbitrated contract is nothing new. It is heavily used by many protocols, the <a href="https://bisq.network/" target="_blank" rel="noreferrer">Bisq decentralized exchange</a> is just one of the examples. The idea of MacPacks for sharing the smart contract data between the participants is inspired by <a href="https://docs.grin.mw/wiki/transactions/slatepack/" target="_blank" rel="noreferrer">slatepacks from GRIN cryptocurrency</a>, in which similar messages are exchange between the participants in order to interactively build a transaction.</p>
            </div>


            <div className="break-inside-avoid">
                <h2>Behind <i>MAC!</i></h2>

                <p>This application has been developed by <a href="https://mareknarozniak.com/" target="_blank" rel="noreferrer">Marek Narozniak</a> as part of the <a href="https://minaprotocol.com/blog/zkignite-cohort0" target="_blank" rel="noreferrer">zkIgnite program</a>. Marek has been <a href="https://minaprotocol.com/blog/meet-zkapp-builder-marek-narozniak" target="_blank" rel="noreferrer">friends with Mina</a> for quite a while before zkIgnite program which was the competition for which <i>MAC!</i> was one of the many great projects submitted.</p>
            </div>
        </article>
    );
}
