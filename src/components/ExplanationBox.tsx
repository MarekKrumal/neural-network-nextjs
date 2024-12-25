import React from "react";
import Latex from "react-latex";

export default function ExplanationBox() {
  return (
    <div className="border p-4 bg-gray-100 w-[700px] text-sm text-gray-700">
      <h2 className="font-bold mb-2 text-lg">Co tady vidíte?</h2>
      <p className="mb-2">
        Tato aplikace zobrazuje neuronovou síť, kde můžeš{" "}
        <strong>dynamicky</strong> měnit:
        <ul className="list-disc list-inside ml-2">
          <li>Počet vstupů (modré vlevo)</li>
          <li>Počet skrytých neuronů (světle modré uprostřed)</li>
          <li>Počet výstupů (tmavě modré vpravo)</li>
        </ul>
        Spolu s těmito změnami se automaticky upravují i váhy.
      </p>
      <p className="mb-2">Pro dopřednou propagaci používáme sigmoid funkci:</p>
      <Latex>{`$ z_j = \\sum_i x_i w_{i,j}, \\quad h_j = \\sigma(z_j)$`}</Latex>
      <p>
        A výstup
        <Latex>{`$ y = \\sigma\\Bigl(\\sum_j h_j w_{j}\\Bigr). $`}</Latex>
      </p>
      <p className="mb-2">
        V sekci <strong>Learning Demo</strong> (pokud máš 1 výstup) můžeš
        kliknutím na <em>Learn Step</em> poukázat na základní backprop. Výstup
        by se měl přiblížit zadanému cíli.
      </p>
    </div>
  );
}
