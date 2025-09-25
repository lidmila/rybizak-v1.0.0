<style>
/* Theme */
#alko-kalkulacka {
  --color-bg: #faf7fb;
  --color-card: #ffffff;
  --color-primary: #45225e;
  --color-primary-600: #5c2e7a;
  --color-accent: #f3e9f9;
  --color-border: #e7dff0;
  --color-text: #2f2a32;
  --color-muted: #75707b;
  font-family: var(--font-body, system-ui, -apple-system, Segoe UI, Roboto, sans-serif);
  color: var(--color-text);
  font-size: 15px;
  background: var(--color-bg);
  padding: 28px;
  max-width: 760px;
  margin: auto;
}

#alko-kalkulacka h2 {
  margin: 0 0 18px;
  font-size: 22px;
  line-height: 1.3;
  color: var(--color-primary);
  background: var(--color-accent);
  padding: 14px 18px;
  border-left: 6px solid var(--color-primary);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

#alko-kalkulacka form {
  background: var(--color-card);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

#alko-kalkulacka .grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 680px) {
  #alko-kalkulacka .grid {
    grid-template-columns: 1fr;
  }
}

#alko-kalkulacka label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

#alko-kalkulacka input[type="number"],
#alko-kalkulacka input[type="time"],
#alko-kalkulacka select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6d0dc;
  background: #fff;
  font-size: 14px;
}

#alko-kalkulacka .help {
  color: var(--color-muted);
  font-size: 12px;
  margin-top: 6px;
}

#alko-kalkulacka .drinks-header {
  margin: 16px 0 8px;
  font-weight: 700;
}

#alko-kalkulacka .drink-row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr auto;
  gap: 10px;
  align-items: end;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

@media (max-width: 680px) {
  #alko-kalkulacka .drink-row {
    grid-template-columns: 1fr 1fr;
  }
}

#alko-kalkulacka .row-actions {
  display: flex;
  gap: 8px;
}

#alko-kalkulacka .chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

#alko-kalkulacka .chip {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}

#alko-kalkulacka .chip:hover {
  background: var(--color-accent);
}

#alko-kalkulacka .btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

#alko-kalkulacka .btn.secondary {
  background: #efe9f5;
  color: var(--color-primary);
}

#alko-kalkulacka .btn.icon {
  padding: 8px 10px;
  line-height: 1;
}

#alko-kalkulacka .btn:hover {
  background: var(--color-primary-600);
}

#alko-kalkulacka .btn.secondary:hover {
  background: #e4dbee;
}

#alko-kalkulacka .actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

#alko-kalkulacka #result {
  display: none;
  background: var(--color-accent);
  margin-top: 22px;
  padding: 16px;
  border-left: 5px solid var(--color-primary);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  font-size: 15px;
  line-height: 1.6;
}

#alko-kalkulacka #result strong {
  color: var(--color-primary);
}

#alko-kalkulacka small {
  display: block;
  color: var(--color-muted);
  margin-top: 12px;
  font-size: 12px;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("alko-kalkulacka");

  // Dataset: common beverages and cocktails with typical ABV and default portions
  const drinks = [
    { name: "Pivo 10° (4 %)", abv: 4, defaults: [500, 330] },
    { name: "Pivo 11° (4.5 %)", abv: 4.5, defaults: [500, 330] },
    { name: "Pivo 12° (5 %)", abv: 5, defaults: [500, 330] },
    { name: "Radler (2 %)", abv: 2, defaults: [500, 330] },
    { name: "Cider (4.5 %)", abv: 4.5, defaults: [500, 330] },
    { name: "Víno bílé (12 %)", abv: 12, defaults: [150, 100, 200] },
    { name: "Víno červené (13 %)", abv: 13, defaults: [150, 100, 200] },
    { name: "Víno růžové (12 %)", abv: 12, defaults: [150, 100, 200] },
    { name: "Sekt / Prosecco (11 %)", abv: 11, defaults: [150, 100] },
    { name: "Vermut (16 %)", abv: 16, defaults: [100, 60] },
    { name: "Likér (20 %)", abv: 20, defaults: [40, 50] },
    { name: "Vodka (40 %)", abv: 40, defaults: [40, 50] },
    { name: "Rum světlý (37.5 %)", abv: 37.5, defaults: [40, 50] },
    { name: "Rum tmavý (40 %)", abv: 40, defaults: [40, 50] },
    { name: "Whisky (40 %)", abv: 40, defaults: [40, 50] },
    { name: "Gin (40 %)", abv: 40, defaults: [40, 50] },
    { name: "Tequila (38 %)", abv: 38, defaults: [40, 50] },
    { name: "Slivovice (50 %)", abv: 50, defaults: [40] },
    { name: "Fernet (38 %)", abv: 38, defaults: [40, 50] },
    { name: "Griotka (20 %)", abv: 20, defaults: [40, 50] },
    // Cocktails: approximate effective ABV for typical servings
    { name: "Aperol Spritz", abv: 11, defaults: [330, 250] },
    { name: "Mojito", abv: 10, defaults: [300, 250] },
    { name: "Gin & Tonic", abv: 12, defaults: [300, 250] },
    { name: "Cuba Libre", abv: 12, defaults: [300, 250] },
    { name: "Tequila Sunrise", abv: 12, defaults: [300, 250] },
    { name: "Margarita", abv: 18, defaults: [150] },
    { name: "Negroni", abv: 24, defaults: [100] },
    { name: "Old Fashioned", abv: 32, defaults: [90] },
    { name: "Espresso Martini", abv: 20, defaults: [120] },
    { name: "Piña Colada", abv: 13, defaults: [250] },
    { name: "Long Island Iced Tea", abv: 22, defaults: [350, 300] },
    { name: "Bloody Mary", abv: 10, defaults: [300] },
    { name: "Mimosa", abv: 10, defaults: [180, 200] },
    { name: "Paloma", abv: 10, defaults: [300] },
  ];

  const buildDrinkOptions = () => {
    const base = `<option value="">– vyber nápoj –</option>` + drinks
      .map((d, i) => `<option value="${i}">${d.name}</option>`)
      .join("");
    return base + `<option value="custom">Vlastní nápoj (% ABV)</option>`;
  };

  const html = `
    <h2>Alkohol kalkulačka</h2>
    <form id="alcoholForm" novalidate>
      <div class="grid">
        <div>
          <label for="gender">Pohlaví</label>
          <select id="gender">
            <option value="male">Muž</option>
            <option value="female">Žena</option>
          </select>
          <div class="help">Ovlivňuje rozložení vody v těle.</div>
        </div>
        <div>
          <label for="weight">Váha (kg)</label>
          <input type="number" id="weight" inputmode="decimal" min="30" max="250" placeholder="např. 80" required>
          <div class="help">Zadejte celá čísla (kg).</div>
        </div>
      </div>

      <div class="grid" style="margin-top:12px;">
        <div>
          <label for="startTime">Začátek pití</label>
          <input type="time" id="startTime" required>
        </div>
        <div>
          <label for="endTime">Konec pití</label>
          <input type="time" id="endTime" required>
        </div>
      </div>

      <div class="drinks-header">Nápoje</div>
      <div id="drink-rows"></div>

      <div class="actions">
        <button type="button" class="btn secondary" id="addRow">+ Přidat nápoj</button>
        <button type="submit" class="btn">Spočítat</button>
      </div>
    </form>
    <div id="result"></div>
  `;

  target.innerHTML = html;

  const rowsContainer = document.getElementById("drink-rows");

  function createRow(index) {
    const row = document.createElement("div");
    row.className = "drink-row";
    row.dataset.index = String(index);

    row.innerHTML = `
      <div>
        <label for="select-${index}">Nápoj</label>
        <select id="select-${index}">${buildDrinkOptions()}</select>
      </div>
      <div>
        <label for="volume-${index}">Množství (ml)</label>
        <input type="number" id="volume-${index}" inputmode="decimal" min="0" placeholder="např. 500">
        <div class="chip-list" id="chips-${index}"></div>
      </div>
      <div>
        <label for="abv-${index}">% alkoholu</label>
        <input type="number" id="abv-${index}" step="0.1" min="0" max="96" placeholder="např. 12" disabled>
      </div>
      <div class="row-actions">
        <button type="button" class="btn icon secondary" aria-label="Smazat řádek" data-remove="${index}">✕</button>
      </div>
    `;

    rowsContainer.appendChild(row);

    const selectEl = row.querySelector(`#select-${index}`);
    const volumeEl = row.querySelector(`#volume-${index}`);
    const abvEl = row.querySelector(`#abv-${index}`);
    const chipsWrap = row.querySelector(`#chips-${index}`);
    const removeBtn = row.querySelector(`[data-remove="${index}"]`);

    const renderChips = (defaults) => {
      chipsWrap.innerHTML = "";
      if (!defaults || !defaults.length) return;
      defaults.forEach((ml) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = `${ml} ml`;
        chip.addEventListener("click", () => {
          volumeEl.value = String(ml);
        });
        chipsWrap.appendChild(chip);
      });
    };

    selectEl.addEventListener("change", () => {
      const val = selectEl.value;
      if (val === "custom") {
        abvEl.disabled = false;
        abvEl.value = "";
        renderChips([]);
      } else if (val !== "") {
        const d = drinks[Number(val)];
        abvEl.value = String(d.abv);
        abvEl.disabled = true;
        renderChips(d.defaults || []);
      } else {
        abvEl.value = "";
        abvEl.disabled = true;
        renderChips([]);
      }
    });

    removeBtn.addEventListener("click", () => {
      row.remove();
      renumberRows();
    });

    return row;
  }

  function renumberRows() {
    Array.from(rowsContainer.querySelectorAll(".drink-row")).forEach((row, i) => {
      row.dataset.index = String(i);
    });
  }

  // Start with three rows
  for (let i = 0; i < 3; i++) createRow(i);

  document.getElementById("addRow").addEventListener("click", () => {
    const next = rowsContainer.querySelectorAll(".drink-row").length;
    if (next >= 20) return alert("Maximálně 20 nápojů.");
    createRow(next);
  });

  function parseTimeToHours(t) {
    if (!t || !t.includes(":")) return NaN;
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
    return h + m / 60;
  }

  function formatClock(decimalHour) {
    let h = Math.floor(decimalHour) % 24;
    if (h < 0) h += 24;
    let m = Math.round((decimalHour % 1) * 60);
    if (m === 60) { h = (h + 1) % 24; m = 0; }
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function dayOffsetLabel(offsetDays) {
    if (offsetDays <= 0) return "dnes";
    if (offsetDays === 1) return "zítra";
    if (offsetDays === 2) return "pozítří";
    return `za ${offsetDays} dnů`;
  }

  document.getElementById("alcoholForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const resultDiv = document.getElementById("result");

    if (!weight || weight < 30) {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "Zadejte platnou váhu (minimálně 30 kg).";
      return;
    }

    const startH = parseTimeToHours(startTime);
    const endH = parseTimeToHours(endTime);
    if (Number.isNaN(startH) || Number.isNaN(endH)) {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "Zadejte platné časy začátku a konce pití.";
      return;
    }

    let H = endH - startH;
    if (H < 0) H += 24; // přes půlnoc

    // Collect drinks from rows
    let totalAlcoholGrams = 0; // grams of pure ethanol
    const rows = Array.from(rowsContainer.querySelectorAll(".drink-row"));
    rows.forEach((row) => {
      const idx = row.dataset.index;
      const select = row.querySelector(`#select-${idx}`);
      const volume = row.querySelector(`#volume-${idx}`);
      const abv = row.querySelector(`#abv-${idx}`);
      const volumeMl = parseFloat(volume.value);
      const abvPct = parseFloat(abv.value);
      if (!select) return;
      if (!Number.isFinite(volumeMl) || volumeMl <= 0) return;
      if (!Number.isFinite(abvPct) || abvPct <= 0) return;
      // grams = ml * (ABV%) * density(0.789 g/ml)
      totalAlcoholGrams += volumeMl * (abvPct / 100) * 0.789;
    });

    if (totalAlcoholGrams <= 0) {
      resultDiv.style.display = "block";
      resultDiv.innerHTML = "Zadejte alespoň jeden nápoj a jeho množství.";
      return;
    }

    // Widmark constants
    const r = gender === "male" ? 0.70 : 0.60; // rozložení vody (muž/žena)
    const betaPermillePerHour = 0.15; // průměrné odbourávání v ‰/h

    // Promile (‰): A / (Wkg * r)
    const promile0 = totalAlcoholGrams / (weight * r);
    const promile = Math.max(0, promile0 - betaPermillePerHour * H);

    const tSobrietyHours = promile / betaPermillePerHour; // od konce pití
    const soberDecimal = endH + tSobrietyHours;
    const dayOffset = Math.floor(Math.max(0, soberDecimal) / 24);
    const clock = formatClock(soberDecimal);

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
      🍺 <strong>Celkem čistého alkoholu:</strong> ${totalAlcoholGrams.toFixed(1)} g<br>
      💧 <strong>Odhadované promile po skončení pití:</strong> ${Math.max(0, promile0 - (H * betaPermillePerHour)).toFixed(3)} ‰<br>
      ⏰ <strong>Střízlivý/á přibližně:</strong> ${dayOffsetLabel(dayOffset)} v ${clock}
      <small>Výpočty jsou orientační. Odbourávání alkoholu je individuální (věk, zdraví, jídlo aj.). Nikdy neřiďte pod vlivem.</small>
    `;
  });
});
</script>

<div id="alko-kalkulacka"></div>
