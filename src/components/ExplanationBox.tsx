import Latex from "react-latex";

export default function ExplanationBox() {
  return (
    <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded mb-6">
      <h2 className="text-xl font-bold text-blue-300 mb-4">
        Co najdeš v aplikaci?
      </h2>

      <p className="mb-3">
        Tato aplikace slouží k vizualizaci neuronových sítí a umožňuje
        uživatelům experimentovat s různými nastaveními a sledovat, jak změny
        ovlivňují chování sítě. Můžeš:
        <ul className="list-disc list-inside mt-1">
          <li>
            Nastavit <strong>počet vstupů, skrytých vrstev a výstupů</strong>.
          </li>
          <li>
            Interaktivně upravovat <strong>váhy (weights)</strong> mezi
            jednotlivými vrstvami.
          </li>
          <li>
            Sledovat <strong>vizualizaci neuronů a jejich aktivací</strong> v
            reálném čase.
          </li>
          <li>
            Experimentovat s rozdílným počtem vrstev a pozorovat jejich vliv na
            chování sítě.
          </li>
          <li>
            Pochopit, jak se výstupy neuronové sítě mění na základě různých
            vstupních dat.
          </li>
          <li>
            Naučit se základní principy fungování neuronových sítí díky
            intuitivnímu zobrazení a jednoduchým vysvětlením.
          </li>
        </ul>
      </p>

      <hr className="border-gray-700 my-4" />

      <h2 className="text-xl font-bold text-blue-300 mb-4">
        Neuronové sítě: Co to je a jak fungují?
      </h2>

      <p className="mb-3">
        Neuronové sítě jsou modely inspirované fungováním lidského mozku.
        Skládají se z propojených "neurons" (umělých neuronů), které spolu
        komunikují pomocí spojení nazývaných váhy. Váhy určují, jak silně se
        přenáší signál z jednoho neuronu na druhý.
      </p>

      <p className="mb-3">
        Vstupy (data) procházejí sítí přes několik vrstev (vstupní, skryté a
        výstupní). Každá vrstva provádí jistý výpočet a pošle výsledek do další.
        Síť se tak může „naučit“ rozpoznávat složitější vzory či řešit úlohy,
        jako je klasifikace nebo predikce.
      </p>

      <p className="mb-4">
        V této aplikaci můžeš sledovat, jak se výstup mění, když změníš počet
        vstupů, skrytých neuronů, výstupních neuronů nebo přímo hodnoty vah
        (weights). Každý neuron zobrazuje svou aktuální hodnotu (aktivaci),
        která vznikne vynásobením vstupů vahami a uplatněním aktivační funkce
        (sigmoid).
      </p>

      <h3 className="text-lg font-bold text-blue-300 mb-2">
        Co znamenají jednotlivé části neuronové sítě?
      </h3>

      <h4 className="text-md font-bold text-blue-200 mb-2">Vstupy (Inputs)</h4>
      <p className="mb-3">
        Vstupy představují data, která chceme zpracovat. Například:
        <ul className="list-disc list-inside mt-1">
          <li>
            Při analýze obrazu mohou být vstupy hodnoty pixelů (jas či barva).
          </li>
          <li>
            Při predikci počasí mohou být vstupy teploty, tlak nebo vlhkost.
          </li>
        </ul>
        Počet vstupů odpovídá počtu atributů, které síť analyzuje.
      </p>

      <h4 className="text-md font-bold text-blue-200 mb-2">
        Výstupy (Outputs)
      </h4>
      <p className="mb-3">
        Výstupy jsou výsledky sítě. Například:
        <ul className="list-disc list-inside mt-1">
          <li>
            Při klasifikaci obrázků může být výstup pravděpodobnost, že obrázek
            obsahuje kočku.
          </li>
          <li>
            Při předpovědi počasí může být výstup očekávaná teplota za hodinu.
          </li>
        </ul>
        Počet výstupů odpovídá počtu možných výsledků.
      </p>

      <h4 className="text-md font-bold text-blue-200 mb-2">Váhy (Weights)</h4>
      <p className="mb-3">
        Váhy určují sílu spojení mezi neurony. Pokud je váha vysoká, vstupní
        hodnota má silný vliv na výsledek. Záporné váhy mají opačný vliv. Váhy
        se postupně „učí“, aby síť dokázala co nejlépe odpovídat na zadaný úkol.
      </p>
      <div className="bg-gray-900 p-3 rounded mb-2">
        <Latex>
          {String.raw`$\text{Výstup neuronu} = \sigma(\sum \text{Vstup} \times \text{Váha})$`}
        </Latex>
      </div>
      <p className="mb-2 text-sm">
        Váhy určují, jak síť „váží“ jednotlivé vstupy. Čím větší váha, tím větší
        vliv na výsledek.
      </p>

      <h4 className="text-md font-bold text-blue-200 mb-2">
        Skryté vrstvy (Hidden Layers)
      </h4>
      <p className="mb-3">
        Skryté vrstvy jsou mezi vstupem a výstupem. Tyto vrstvy pomáhají síti
        „naučit se“ složité vzory. Více vrstev umožňuje síti zvládnout
        složitější problémy, ale může síť také učinit náročnější na výpočet.
        <ul className="list-disc list-inside mt-1">
          <li>
            <strong>Více vrstev:</strong> Lepší pro složité problémy (např.
            rozpoznávání obličejů).
          </li>
          <li>
            <strong>Méně vrstev:</strong> Vhodné pro jednoduché problémy (např.
            předpověď jednoduchých čísel).
          </li>
        </ul>
      </p>

      <h3 className="text-lg font-bold text-blue-300 mb-2">
        Jak si to představit jednoduše?
      </h3>
      <p className="mb-2">
        Každý neuron si „poslechne“ výstupy předchozí vrstvy. Z každého vstupu
        dostane číslo, které vynásobí váhou (ta říká, jak moc ten vstup ovlivní
        výsledek), a sečte je dohromady. Nakonec výsledek ještě „přetvoří“
        pomocí funkce sigmoid, takže dostane číslo od 0 do 1.
      </p>

      <div className="bg-gray-900 p-3 rounded mb-2">
        <Latex>
          {String.raw`$\text{Výstup neuronu} = \sigma(\text{Součet všech (Vstup × Váha) })$`}
        </Latex>
      </div>

      <hr className="border-gray-700 my-4" />

      <p className="mb-4">
        Experimentuj s tím a sleduj, jak i malé změny vah mohou mít velký dopad
        na finální výsledek. Takhle neuronové sítě „přemýšlejí“.
      </p>
    </div>
  );
}
