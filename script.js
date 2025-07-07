const drinks = [
  { name: "Pivo 10° (4 %)", abv: 4 },
  { name: "Pivo 12° (5 %)", abv: 5 },
  { name: "Víno bílé (12 %)", abv: 12 },
  { name: "Víno červené (13 %)", abv: 13 },
  { name: "Víno růžové (11.5 %)", abv: 11.5 },
  { name: "Sekt (11 %)", abv: 11 },
  { name: "Slivovice (50 %)", abv: 50 },
  { name: "Vodka (40 %)", abv: 40 },
  { name: "Rum (37.5 %)", abv: 37.5 },
  { name: "Fernet (38 %)", abv: 38 },
  { name: "Griotka (20 %)", abv: 20 },
  { name: "Medovina (13 %)", abv: 13 },
  { name: "Tequila (38 %)", abv: 38 },
  { name: "Whisky (40 %)", abv: 40 },
  { name: "Cuba Libre", abv: 10 },
  { name: "Gin & Tonic", abv: 9 },
  { name: "Mojito", abv: 8 },
  { name: "Aperol Spritz", abv: 11 },
  { name: "Piña Colada", abv: 13 },
  { name: "Tequila Sunrise", abv: 12 },
  { name: "B52", abv: 24 },
  { name: "Jägermeister", abv: 35 }
];

// Vytvoření 5 výběrových řádků
const container = document.getElementById("drink-rows");
for (let i = 0; i < 5; i++) {
  const row = document.createElement("div");
  row.className = "drink-entry";
  row.innerHTML = `
    <label>
      Nápoj ${i + 1}:
      <select id="select-${i}">
        <option value="">– vyber nápoj –</option>
        ${drinks.map((d, j) => `<option value="${j}">${d.name}</option>`).join('')}
      </select>
      &nbsp;&nbsp; Množství:
      <input type="number" id="volume-${i}" placeholder="ml" min="0" style="width:80px">
    </label>
  `;
  container.appendChild(row);
}

document.getElementById("alcoholForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const gender = document.getElementById("gender").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  const r = gender === "male" ? 0.71 : 0.58;
  const beta = 0.015;
  const parseTime = t => {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  };
  const H = parseTime(endTime) - parseTime(startTime);

  let totalAlcohol = 0;
  for (let i = 0; i < 5; i++) {
    const selected = document.getElementById(`select-${i}`).value;
    const volume = parseFloat(document.getElementById(`volume-${i}`).value);
    if (selected !== "" && !isNaN(volume) && volume > 0) {
      const drink = drinks[selected];
      totalAlcohol += volume * (drink.abv / 100) * 0.789;
    }
  }

  if (totalAlcohol === 0) {
    document.getElementById("result").innerHTML = "Zadej alespoň jeden nápoj.";
    document.getElementById("result").style.display = "block";
    return;
  }

  const bac0 = totalAlcohol / (weight * 1000 * r) * 1000;
  const bac = Math.max(0, bac0 - beta * H);
  const tSobriety = bac / beta;
  const soberDecimal = parseTime(endTime) + tSobriety;
  const soberH = Math.floor(soberDecimal) % 24;
  const soberM = Math.round((soberDecimal % 1) * 60);

 document.getElementById("result").style.display = "block";
document.getElementById("result").innerHTML =
  `💧 <strong>Odhadované promile:</strong> ${bac.toFixed(3)} ‰<br>` +
  `⏰ <strong>Vystřízlivíte přibližně v:</strong> ${String(soberH).padStart(2, '0')}:${String(soberM).padStart(2, '0')}<br><br>` +
  `<small>Výpočty jsou orientační. Skutečné odbourávání závisí na individuálních faktorech.</small>`;
});