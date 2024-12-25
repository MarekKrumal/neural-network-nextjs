import React from "react";
import Latex from "react-latex";

export default function ExplanationBox() {
  return (
    <div className="border p-4 bg-gray-100 w-[700px] text-sm text-gray-700">
      <h2 className="font-bold mb-2 text-lg">Co tady vidíte?</h2>
      <p className="mb-2">
        Tato aplikace zobrazuje neuronovou síť s jednou skrytou vrstvou (4
        neurony). Můžeš měnit počet vstupů, výstupů, samotné váhy a vstupní
        hodnoty.
      </p>
      <p className="mb-2">
        Pokud nastavíš <strong>1 výstup</strong>, můžeš využít sekci „Learning
        Demo“, abys síť v jednom kroku naučil přiblížit se k dané cílové
        hodnotě. Uplatňujeme zjednodušený backpropagation algoritmus.
      </p>
      <p className="mb-2">Dopředná propagace se počítá podle:</p>
      <Latex>{`$ h_j = \\sigma(\\sum_i x_i w_{i,j}), \\quad y = \\sigma(\\sum_j h_j w_{j})$`}</Latex>
      <p className="mb-2">
        V panelu <strong>Edit Configuration</strong> (nahoře) můžeš měnit
        všechny váhy a velikost sítě. Po uložení se hodnoty automaticky
        přepočítají.
      </p>
      <p className="mb-2">
        Když <strong>zvětšíš počet vstupů či výstupů</strong>, aplikace náhodně
        vygeneruje chybějící váhy, aby nedošlo k chybě. Můžeš je pak ručně
        doladit nebo použít „Learn Step“.
      </p>
    </div>
  );
}
