/**
 * Mapei grout and caulk color names (2023 palette, supplier PDF from Justin).
 * Swatch hex values were sampled from the PDF and are approximate. Screen colors are not exact.
 */

export type GroutColor = { code: string; name: string; family: string; hex: string };

export const GROUT_COLORS: GroutColor[] = [
  { code: "5220", name: "Eggshell", family: "High-Energy", hex: "#eae6da" },
  { code: "5049", name: "Light Almond", family: "High-Energy", hex: "#e1d3c0" },
  { code: "5006", name: "Harvest", family: "High-Energy", hex: "#cab497" },
  { code: "5044", name: "Pale Umber", family: "High-Energy", hex: "#bfa58c" },
  { code: "5005", name: "Chamois", family: "High-Energy", hex: "#aa927e" },
  { code: "5042", name: "Mocha", family: "High-Energy", hex: "#877163" },
  { code: "5004", name: "Bahama Beige", family: "High-Energy", hex: "#7e7267" },
  { code: "5007", name: "Chocolate", family: "High-Energy", hex: "#5f5248" },
  { code: "5221", name: "Moonbeam", family: "Retro", hex: "#e5e2de" },
  { code: "5093", name: "Warm Gray", family: "Retro", hex: "#c5c1ba" },
  { code: "5001", name: "Alabaster", family: "Retro", hex: "#c7c0b4" },
  { code: "5039", name: "Ivory", family: "Retro", hex: "#baad9c" },
  { code: "5105", name: "Driftwood", family: "Retro", hex: "#9e9181" },
  { code: "5011", name: "Sahara Beige", family: "Retro", hex: "#8a8279" },
  { code: "5009", name: "Gray", family: "Retro", hex: "#79716b" },
  { code: "5010", name: "Black", family: "Retro", hex: "#4b4a4a" },
  { code: "5222", name: "Honey Butter", family: "Country", hex: "#e8dbd1" },
  { code: "5014", name: "Biscuit", family: "Country", hex: "#d3c8b7" },
  { code: "5223", name: "Oatmeal", family: "Country", hex: "#d7c9c1" },
  { code: "5015", name: "Bone", family: "Country", hex: "#c9b6a3" },
  { code: "5224", name: "Wicker", family: "Country", hex: "#b8a297" },
  { code: "5225", name: "Sandstorm", family: "Country", hex: "#a38a7f" },
  { code: "5226", name: "Nutmeg", family: "Country", hex: "#7e645a" },
  { code: "5079", name: "Cocoa", family: "Country", hex: "#6d5a50" },
  { code: "5038", name: "Avalanche", family: "Rock", hex: "#edeae2" },
  { code: "5077", name: "Frost", family: "Rock", hex: "#d3d0ca" },
  { code: "5227", name: "Castle Wall", family: "Rock", hex: "#c6c6bd" },
  { code: "5103", name: "Cobblestone", family: "Rock", hex: "#b8b5b1" },
  { code: "5002", name: "Pewter", family: "Rock", hex: "#a49f96" },
  { code: "5228", name: "Cavern Moss", family: "Rock", hex: "#8e918b" },
  { code: "5107", name: "Iron", family: "Rock", hex: "#82807b" },
  { code: "5047", name: "Charcoal", family: "Rock", hex: "#635f5c" },
  { code: "5229", name: "Sea Salt", family: "Chill-Out", hex: "#d0d5d3" },
  { code: "5101", name: "Rain", family: "Chill-Out", hex: "#c1c4c5" },
  { code: "5027", name: "Silver", family: "Chill-Out", hex: "#a8a6a3" },
  { code: "5230", name: "Armor", family: "Chill-Out", hex: "#9ea4a7" },
  { code: "5104", name: "Timberwolf", family: "Chill-Out", hex: "#9f9d9d" },
  { code: "5019", name: "Pearl Gray", family: "Chill-Out", hex: "#7f7e7f" },
  { code: "5231", name: "Deep Ocean", family: "Chill-Out", hex: "#5f6d76" },
  { code: "5232", name: "Night Sky", family: "Chill-Out", hex: "#49555c" },
  { code: "5201", name: "Crystal Moon", family: "Disco (glass-bead)", hex: "#c6c9b4" },
  { code: "5202", name: "Frosted Glass", family: "Disco (glass-bead)", hex: "#c9cbbe" },
  { code: "5203", name: "Star Dust", family: "Disco (glass-bead)", hex: "#b8b19d" },
  { code: "5204", name: "Pure Steel", family: "Disco (glass-bead)", hex: "#988f89" },
  { code: "5205", name: "Frozen Fire", family: "Disco (glass-bead)", hex: "#cbb17e" },
  { code: "5206", name: "Golden Rose", family: "Disco (glass-bead)", hex: "#8e622a" },
  { code: "5207", name: "Champagne Bubbles", family: "Disco (glass-bead)", hex: "#d1ad8c" },
  { code: "5208", name: "Copper Dawn", family: "Disco (glass-bead)", hex: "#805435" },
  { code: "5209", name: "Morning Dew", family: "Disco (glass-bead)", hex: "#99ad9e" },
  { code: "5210", name: "Forever Sky", family: "Disco (glass-bead)", hex: "#799293" },
  { code: "5117", name: "Pure White", family: "Classic", hex: "#eae9e8" },
  { code: "5118", name: "Jet Black", family: "Classic", hex: "#383939" },
];

export const GROUT_FAMILIES = Array.from(new Set(GROUT_COLORS.map((color) => color.family)));

export const GROUT_PICK_EVENT = "ab:grout-pick";

export function groutLabel(color: GroutColor) {
  return `Mapei ${color.code} ${color.name}`;
}

export const MAPEI_PALETTE_URL =
  "https://cdnmedia.mapei.com/docs/librariesprovider10/default-document-library/color-palette-2023-en.pdf";
