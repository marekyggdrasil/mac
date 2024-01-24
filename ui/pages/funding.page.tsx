import Link from "next/link";

export default function Funding() {
  return (
    <article className="container gap-8 columns-1 prose">
      <h1>
        Funding
      </h1>
      <div className="break-inside-avoid">
        <h2>zkIgnite Cohort 2</h2>
        <p>
          The electors of the zkIgnite Cohort 2 program have selected MAC! as one of the funded projects in the zkApp track.
        </p>
        <p>
          MAC! figures on the <Link href="https://minaprotocol.com/blog/cohort-2-funded-projects" target="_blank">zkIgnite Cohort 2 funded projects list announcement</Link>.
        </p>
        <p>
          Funding proposal <Link href="https://zkignite.minaprotocol.com/zkignite/zkapp-track-cohort-2/funded/suggestion/497" target="_blank">on the zkIgnite innovation platform</Link>. The <Link href="https://youtu.be/5940Ja8CbC0" target="_blank">final demo recording on YouTube</Link>, <Link href="https://twitter.com/MarekNarozniak/status/1710581027020636472" target="_blank">Twitter thread with regular updates</Link>.
        </p>
      </div>
      <div className="break-inside-avoid">
        <h2>zkIgnite Cohort 0</h2>
        <p>
          MAC! was one of the funded projects for the first cohort of the zkIgnite grants program.
        </p>
        <p><Link href="https://twitter.com/MarekNarozniak/status/1603899192815935489" target="_blank">Twitter post</Link> and <Link href="https://youtu.be/08VD7Rz7Yfo" target="_blank">YouTube demo</Link>.</p>
      </div>
    </article>
  );
}
