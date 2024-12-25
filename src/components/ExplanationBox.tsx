import React from "react";
import Latex from "react-latex";

export default function ExplanationBox() {
  return (
    <div className="border p-4 bg-gray-100 w-[700px] text-sm text-gray-700">
      <h2 className="font-bold mb-2 text-lg">Co tady vidíte?</h2>
      <p className="mb-2">
        Tato aplikace zobrazuje jednoduchou neuronovou síť s jednou skrytou
        vrstvou. Můžete zadat vstupní hodnoty (modré neurony), jejichž signál
        projde skrytou vrstvou (světle modré neurony) a vyústí do výstupních
        neuronů (tmavě modré).
      </p>
      <p className="mb-2">
        Váhy mezi vrstvami řídí, jak silně se vstupy přenáší do dalších neuronů.
        Dopřednou propagaci popisuje vzorec:
      </p>
      <Latex>
        {`$z_j^{(hidden)} = \\sigma\\Bigl(\\sum_{i} x_i \\cdot w_{i,j}\\Bigr), 
          \\quad y_k = \\sigma\\Bigl(\\sum_{j} h_j \\cdot w_{j,k}\\Bigr)$`}
      </Latex>
      <p className="mt-2">
        Kliknutím na <strong>Edit Weights</strong> můžete změnit váhy. Tím
        uvidíte, jak se změní výsledné aktivace a výstup.
      </p>
    </div>
  );
}
