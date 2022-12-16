import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <article className="container prose">
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello there!</h1>
                        <p className="py-6">I am <i>MAC!</i>, or <i>Mina Arbitrated Contracts</i> if you want to be formal. I am an <a href="">zkApp</a> that makes zkApps (yes, really!).</p>
                        <Link href="/create"><button className="btn btn-primary">Get Started</button></Link>
                        <p>The best part is you don't even need to know how to code! If you are confused check the <Link href="/about">about page</Link> to learn more!</p>
                    </div>
                </div>
            </div>
            <p>If you are new to blockchain and totally confused what is this website about, you might first want to check what is <a href="https://minaprotocol.com/" target="_blank" rel="noreferrer">Mina Protocol</a> developed by <a href="https://o1labs.org/">O(1) Labs</a> and what are <a href="https://minaprotocol.com/zkapps" target="_blank" rel="noreferrer">zkApps</a>. For sure you heard of apps and maybe even of <a href="https://en.wikipedia.org/wiki/Smart_contract" target="_blank" rel="noreferrer">Smart Contracts</a> but most likely you never though you might make one, now there's your chance!</p>
            <p><i>MAC!</i> is one of those ideas that could bring blockchain technology to real life. It is a contract building engine that allows you to define some sort of criterion and disburse funds based on satisfaction of this criterion. The possibilities are only limited by your imagination! You you could even use it to secure real life interaction that do not even involve MINA coin transactions, all you need is set the payment to 0.00 MINA and let <i>MAC!</i> deposit amounts secure your real-life interaction.</p>
            <p>Once you define your Smart Contract you can use <i>MAC!</i> to deploy it and export it under a form of MacPacks, which are encoded zero-knowledge circuits in an easy to share form. Another innovation of <i>MAC!</i>.</p>
            <p>This is an early and highly experimental implementation of <i>MAC!</i>. It supports two modes, <a href="https://www.aurowallet.com/" target="_blank" rel="noreferrer">AURO wallet mode</a> and PrivateKey mode - which requires you to provide your private key. The AURO mode is extremely buggy, wallet often breaks and refuses to provide the address after windows event indicating account change. As soon as AURO wallet gets debugged and works correctly (especially for deployment) the private key mode is going to be removed.</p>
        </article>
    )
}
