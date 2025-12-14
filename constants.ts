
export interface WasteCategory {
  id: number;
  title: string;
  items: string[];
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 1,
    title: "Solid Waste (General)",
    items: ["Garbage", "Rubbish", "Refuse", "Trash", "Litter", "Scrap"]
  },
  {
    id: 2,
    title: "Organic / Biodegradable Waste",
    items: ["Food waste", "Kitchen scraps", "Vegetable peels", "Fruit waste", "Leftover food", "Meat waste", "Fish waste", "Egg shells", "Tea leaves", "Coffee grounds", "Garden waste", "Leaves", "Grass clippings", "Weeds", "Flowers", "Tree branches", "Wood chips", "Animal manure", "Dead plants", "Agricultural residue"]
  },
  {
    id: 3,
    title: "Plastic Waste",
    items: ["Plastic bags", "Plastic bottles", "Plastic containers", "Plastic wrappers", "Packaging film", "Polythene", "PVC waste", "PET bottles", "HDPE containers", "Plastic cups", "Plastic straws", "Thermocol (Styrofoam)", "Microplastics"]
  },
  {
    id: 4,
    title: "Paper & Cardboard Waste",
    items: ["Paper waste", "Newspapers", "Magazines", "Books", "Office paper", "Cardboard", "Cartons", "Paper cups", "Paper plates", "Tissue paper", "Paper towels"]
  },
  {
    id: 5,
    title: "Metal Waste",
    items: ["Iron scrap", "Steel scrap", "Aluminum cans", "Tin cans", "Copper wire", "Brass scrap", "Metal shavings", "Foil", "Broken tools"]
  },
  {
    id: 6,
    title: "Glass Waste",
    items: ["Glass bottles", "Glass jars", "Broken glass", "Window glass", "Mirror glass", "Laboratory glass"]
  },
  {
    id: 7,
    title: "Electronic Waste (E-Waste)",
    items: ["Mobile phones", "Computers", "Laptops", "Tablets", "Televisions", "Monitors", "Printers", "Keyboards", "Chargers", "Batteries", "Circuit boards", "Cables", "Wires"]
  },
  {
    id: 8,
    title: "Hazardous Waste",
    items: ["Chemical waste", "Toxic waste", "Pesticides", "Insecticides", "Paints", "Solvents", "Acids", "Alkalis", "Asbestos", "Radioactive waste"]
  },
  {
    id: 9,
    title: "Biomedical / Medical Waste",
    items: ["Used syringes", "Needles", "Bandages", "Cotton swabs", "Blood-soaked materials", "Expired medicines", "Medical gloves", "Masks", "Human tissues", "Laboratory waste"]
  },
  {
    id: 10,
    title: "Industrial Waste",
    items: ["Slag", "Fly ash", "Chemical sludge", "Industrial effluents", "Scrap materials", "Waste oils", "Factory by-products"]
  },
  {
    id: 11,
    title: "Construction & Demolition Waste",
    items: ["Concrete debris", "Bricks", "Cement waste", "Tiles", "Wood scraps", "Steel rods", "Rubble", "Sand waste"]
  },
  {
    id: 12,
    title: "Liquid Waste",
    items: ["Sewage", "Wastewater", "Industrial effluent", "Oil waste", "Grease", "Chemical liquids"]
  },
  {
    id: 13,
    title: "Agricultural Waste",
    items: ["Crop residue", "Straw", "Husks", "Bagasse", "Animal waste", "Spoiled grains"]
  },
  {
    id: 14,
    title: "Textile Waste",
    items: ["Old clothes", "Fabric scraps", "Cotton waste", "Synthetic fibers", "Yarn waste"]
  },
  {
    id: 15,
    title: "Miscellaneous Waste",
    items: ["Rubber waste", "Tires", "Leather waste", "Batteries", "Bulbs", "CFLs", "Diapers", "Sanitary napkins"]
  }
];

export const GLOBAL_WASTE_STATS = [
  { name: 'Organic', value: 44, fill: '#db2777' }, // pink-600
  { name: 'Paper', value: 17, fill: '#facc15' },
  { name: 'Plastic', value: 12, fill: '#3b82f6' },
  { name: 'Glass', value: 5, fill: '#a8a29e' },
  { name: 'Metal', value: 4, fill: '#94a3b8' },
  { name: 'Other', value: 18, fill: '#f87171' },
];