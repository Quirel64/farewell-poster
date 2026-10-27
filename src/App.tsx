import { modules } from './data/people'
import { LedPixelGrid } from './components/LedPixelGrid'
import { PersonGallery } from './components/PersonGallery'
import { PasswordGate } from './components/PasswordGate'
import {
  BalloonsEasterEgg,
  SpoilerCatEasterEgg,
  MeteorRockEasterEgg,
} from './components/EasterEggs'

function App() {
  return (
    <PasswordGate>
      <main>
      {/* ── Hero ── */}
      <section className="hero section-shell" style={{ position: 'relative' }}>
        <p className="eyebrow">een poster om te herinneren</p>
        <h1>een vaarwel<br /><span>in mijn stijl.</span></h1>
        <p className="hero-copy">een unieke vaarwel memoir vanuit de lens van een van de deelnemers.</p>
        <a className="scroll-link" href="#in-lights">vooruitspoelen naar de led show <span aria-hidden="true">↓</span></a>

        {/* Easter Egg 1: Floating Balloons + Cat 1 */}
        <BalloonsEasterEgg />
      </section>

      {/* ── Shared Year (modules) ── */}
      <section className="shared-year section-shell">
        <div className="section-heading">
          <p className="eyebrow">zoveel meegemaakt en nooit genoeg tijd om alles te vertellen</p>
          <h2>een groot verhaal opgesomt in zo kort als ik het kan</h2>
          <p>de zes modules elk met zijn unieke soort groei.</p>
        </div>
        <div className="module-grid">
          {modules.map((module, index) => (
            <article className="module-card" key={module.label}>
              <div className="module-card-header">
                <h3>{module.label}</h3>
                {/* Easter Egg 3: Meteor & Quartz Rock at Module 6 header, where the telescope aims */}
                {index === 5 && <MeteorRockEasterEgg />}
              </div>
              <LedPixelGrid artwork={module.artwork} label={`${module.label} pixel artwork`} shape="square" />
              <div className="module-content">
                <p className="module-memory">{module.memory}</p>

                {/* Easter Egg 2: Spoiler Bar & Cat 2 at Module 2 (Emoties) */}
                {index === 1 && <SpoilerCatEasterEgg />}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <div id="in-lights">
        <PersonGallery />
      </div>
      {/* ── Therapists Thank You ── */}
      <section className="therapists section-shell">
        <div className="section-heading">
          <p className="eyebrow">voor de begeleiding</p>
          <h2>een bedankje aan de therapeuten</h2>
          <p>
            ik wil jullie natuurlijk bedanken `(jooske, hilde, isa, rebecca, eline en natuurlijk degene die het gestart hebben, andere eline en iris.)` voor het starten van deze groep en het altijd klaarstaan om ons te helpen.
            ook merk ik dat over de loop der tijd jullie meer observant zijn geworden en ons betere vragen konden stellen
            zodat we beter de diepgang konden vinden. ook vond ik het gezellig wanneer jullie meededen met de opdrachten
            want dat hielp voor mij ook om jullie beter te leren kennen dan alleen als een therapeut, wat al helemaal hielp
            omdat er veel wisselingen zijn geweest. ik wens jullie veel succes met de volgende groep en misschien zie
            ik jullie nog eens een keer in het gebouw! 
          </p>
        </div>
      </section>

      {/* ── Thank You ── */}
      <section className="thanks section-shell">
        <p className="eyebrow">mijn laatste woorden van dit werkje</p>
        <h2>Bedankt<br />voor het lezen.</h2>
        <p>
          dit was echt een groot avontuur voor mij en ik zal het wel een beetje missen dat deze behandeling
          eindigt, maar er is ook heel veel groei gebeurd in deze periode voor mij en ik hoop ook voor de
          rest. het was echt heel leerzaam en leuk om met iedereen hieraan mee te doen — en ondanks dat we
          verwisselingen, uitvallen en ziek zijn allemaal hebben gehad, vind ik dat iedereen trots mag zijn
          dat we allemaal het einde van de deeltijd hebben gehaald.
        </p>
      </section>

      <footer>
        <p>gemaakt met de herinneringen en een beetje motivatie.</p>
      </footer>

      <p style={{ textAlign: 'center', padding: '1rem 1.25rem 2.5rem', color: '#bdb0ca', fontSize: '0.92rem' }}>
        trouwens... hebben jullie mijn tweede steen gezien? hij zou ergens op deze pagina moeten zitten.
        klik maar eens rond om hem te vinden. mischien vind je mijn huisdieren ook wel.
      </p>

      <p style={{ textAlign: 'center', padding: '1rem 1.25rem 2.5rem', color: '#bdb0ca', fontSize: '0.92rem' }}>
        en nu jullie toch naar het einde zijn gescrolled heb ik de projectjes die mij meegeholpen hebben om dit te maken!
       <a href="https://quirel64.github.io/media-player/" style={{color:'orange'}}>die media player waar ik mee aan de gang was</a> en <a href="https://quirel64.github.io/markit2d/" style={{color:'orange'}}> en mijn eerste project waar ik de artworks mee heb gemaakt (ik raad het niet aan om deze te gebruiken omdat het mijn eerste project was die nooit afgemaakt was.)</a>
      </p>
      </main>
    </PasswordGate>
  )
}

export default App
