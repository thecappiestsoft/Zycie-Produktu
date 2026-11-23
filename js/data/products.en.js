/* Nakładka tłumaczeń EN dla kart produktów */
"use strict";
/* English overlay for product cards (same quiz order: the first answer is the correct one) */
const PRODUCTS_EN = {
 can:{ name:"Aluminium can", material:"aluminium", symSub:"aluminium",
   binWhy:"In Poland cans go in the yellow bin together with plastics. A can with a deposit is best returned to a deposit machine.",
   src:{good:"ASI-certified bauxite",goodD:"A mine that restores the land and controls its waste (red mud)."},
   eco:{title:"Thinner can wall",desc:"Less aluminium for the same volume of drink."},
   factProd:"Aluminium is produced by electrolysis of aluminium oxide dissolved in molten cryolite. The process uses a huge amount of electricity (about 13–15 kWh per 1 kg of metal).",
   factRec:"Remelting aluminium scrap takes about 95% less energy than producing it from bauxite. Aluminium can be recycled practically forever.",
   real:"0.33 l can: on the order of 0.1–0.2 kg CO₂e (depending on recycled content and energy source).",
   quiz:[
    {q:"Which ore is aluminium obtained from?", a:["Bauxite","Haematite","Galena","Cassiterite"], why:"Bauxite is a rock rich in hydrated aluminium oxides. Haematite (Fe₂O₃) is an iron ore, galena (PbS) a lead ore and cassiterite (SnO₂) a tin ore."},
    {q:"How is metallic aluminium obtained from aluminium oxide?", a:["By electrolysis of Al₂O₃ dissolved in molten cryolite","By reduction with coke in a blast furnace","By roasting with sulfur","By fractional distillation"], why:"Aluminium is too reactive to be reduced with carbon like iron. Electrolysis is used, which is why primary aluminium is so energy-intensive."},
    {q:"What is the formula of aluminium oxide?", a:["Al₂O₃","AlO","AlO₂","Al₃O₂"], why:"Aluminium is trivalent (Al³⁺) and oxygen divalent (O²⁻), so Al₂O₃."},
    {q:"Why doesn't aluminium rust like iron?", a:["It is covered by a tight layer of Al₂O₃","It does not react with oxygen","It contains added gold","It is a noble metal"], why:"A thin, tight layer of aluminium oxide protects the metal from further oxidation (passivation)."}
   ]},
 glass:{ name:"Glass bottle", material:"soda-lime glass", symSub:"silica", repairLabel:"Washing and refilling",
   binWhy:"In Poland packaging glass goes in the green bin. A returnable bottle goes back to the shop or a deposit machine.",
   src:{good:"Local sand and more cullet",goodD:"A shorter haul for raw materials and fewer carbonates, which release CO₂ when melted."},
   eco:{title:"Lighter bottle",desc:"Thinner walls: less glass to melt."},
   factProd:"The glass batch (sand, soda ash, limestone) melts at about 1500°C. Decomposition of the carbonates releases additional CO₂.",
   factRec:"Cullet melts more easily than raw materials: every 10% of cullet in the batch cuts energy use by about 2–3% and reduces CO₂ from carbonate decomposition. Glass is heavy, so transport matters a lot.",
   real:"Single-use 0.33 l bottle: on the order of 0.2–0.4 kg CO₂e. A returnable bottle spreads this footprint over many refills.",
   quiz:[
    {q:"What is the main raw material for making glass?", a:["Quartz sand (SiO₂)","Bauxite","Rock salt (NaCl)","Graphite (C)"], why:"Soda-lime glass is mostly silica, SiO₂, with added soda ash and limestone."},
    {q:"Why is soda ash (Na₂CO₃) added to the glass batch?", a:["It lowers the melting point","It colours the glass green","It removes oxygen from it","It increases its mass"], why:"Soda ash acts as a flux: it lowers the melting point of silica, which saves energy."},
    {q:"Which gas is released when carbonates (CaCO₃, Na₂CO₃) decompose in a glass furnace?", a:["CO₂","O₂","SO₂","H₂"], why:"CaCO₃ → CaO + CO₂. This is one reason why adding cullet reduces the carbon footprint."},
    {q:"What gives bottles their green colour?", a:["Added iron and chromium compounds","Chlorophyll","Added metallic copper","Aluminium oxide"], why:"Iron and chromium ions colour glass green. That's why clear and coloured glass are sometimes sorted separately."}
   ]},
 pet:{ name:"PET bottle", material:"poly(ethylene terephthalate)", symSub:"polyester",
   binWhy:"In Poland PET bottles go in the yellow bin. A bottle with a deposit is best returned to a deposit machine.",
   src:{good:"Partly bio-based PET",goodD:"Some of the ethylene glycol comes from sugar cane instead of oil."},
   eco:{title:"Lighter bottle with a tethered cap",desc:"Less plastic, and the cap doesn't get lost in the environment."},
   factProd:"PET is made by polycondensation of terephthalic acid and ethylene glycol, which are obtained from crude oil and natural gas.",
   factRec:"Mechanical recycling shortens the polymer chains, so in the game a PET bottle can be recovered at most twice. After that it goes into lower-quality products.",
   real:"0.5 l bottle: on the order of 0.08–0.15 kg CO₂e. Burning PET releases fossil carbon as CO₂.",
   quiz:[
    {q:"Which fossil raw materials is PET made from?", a:["Crude oil and natural gas","Bauxite","Quartz sand","Limestone"], why:"PET monomers come from processing oil and gas, so recycled PET saves fossil fuels."},
    {q:"Which group of polymers does PET belong to?", a:["Polyesters","Polyamides","Proteins","Polysaccharides"], why:"PET is poly(ethylene terephthalate), a polyester: the monomers are joined by ester bonds."},
    {q:"Which monomers is PET made from?", a:["Terephthalic acid and ethylene glycol","Ethylene and propylene","Glucose","Vinyl chloride"], why:"A dicarboxylic acid and a diol form a polyester in polycondensation, with water as a by-product."},
    {q:"What forms when PET burns completely?", a:["CO₂ and H₂O","Only soot","SO₂ and NH₃","Only oxygen"], why:"PET contains only C, H and O, so complete combustion gives CO₂ and water. This CO₂ comes from fossil carbon."}
   ]},
 tshirt:{ name:"Cotton T-shirt", material:"cotton (cellulose)", symSub:"cellulose", repairLabel:"Repair at a tailor's",
   binWhy:"Since 2025 Polish municipalities must collect textiles separately: in clothing bins or at a municipal collection point, not with mixed waste.",
   src:{good:"Organic cotton",goodD:"No synthetic nitrogen fertilisers, so less N₂O from the soil."},
   eco:{title:"Stronger seams and better fabric",desc:"Production costs slightly more tokens, but you can repair the T-shirt once more."},
   factProd:"Growing cotton needs a lot of water and fertiliser, and spinning, weaving and dyeing use a lot of energy. According to WWF, one T-shirt takes about 2,700 litres of water.",
   factRec:"Mechanical recycling shortens the fibres, so recovered fibre is blended with new fibre. In the game a T-shirt can be recovered only once.",
   real:"T-shirt: on the order of 2–7 kg CO₂e. Sources differ a lot because they count washing and drying differently.",
   quiz:[
    {q:"Which compound is the main component of cotton fibre?", a:["Cellulose","Keratin","Starch","Fibroin"], why:"Cotton is almost pure cellulose. Keratin makes up wool and fibroin makes up silk."},
    {q:"Cellulose is a polymer of:", a:["glucose","fructose","amino acids","ethylene"], why:"Cellulose consists of chains of β-glucose molecules. You'll find the same polymer in paper."},
    {q:"Which greenhouse gas is released from soil heavily fertilised with nitrogen?", a:["Nitrous oxide (N₂O)","Helium (He)","Argon (Ar)","Hydrogen (H₂)"], why:"N₂O forms when nitrogen fertilisers are transformed in the soil, and it is a powerful greenhouse gas."},
    {q:"Which gas forms when cotton decomposes in a landfill without oxygen?", a:["Methane (CH₄)","Ozone (O₃)","Chlorine (Cl₂)","Neon (Ne)"], why:"Anaerobic bacteria break down cellulose and release methane, which warms the climate much more strongly than CO₂."}
   ]},
 phone:{ name:"Smartphone", material:"metals, glass, plastics", repairLabel:"Service: battery or screen",
   binWhy:"E-waste goes back to an electronics shop or a municipal collection point. It must never go in any of the coloured bins.",
   src:{good:"Metals from certified mines",goodD:"Controlled sources of tin, tantalum, tungsten and gold that don't fund conflicts."},
   eco:{title:"Modular design",desc:"Battery and screen can be swapped without glue: the phone survives one more repair."},
   factProd:"About 80% of a smartphone's carbon footprint comes from production: mining metals and making the chips.",
   factRec:"Copper, gold and cobalt, among others, are recovered from e-waste, but a new smartphone still needs a lot of new production. That's why repair achieves much more than recycling.",
   real:"Smartphone (whole life cycle): on the order of 50–80 kg CO₂e, most of it from production.",
   quiz:[
    {q:"Which ore is tantalum for phone capacitors obtained from?", a:["Coltan","Galena","Magnetite","Bauxite"], why:"Coltan is a mixture of the minerals columbite and tantalite. Its mining is sometimes linked to armed conflicts."},
    {q:"Which element is the basis of integrated circuits?", a:["Silicon","Sulfur","Sodium","Calcium"], why:"Processors are made on wafers of very pure silicon, which takes a lot of energy."},
    {q:"Where does lithium for batteries come from?", a:["From brines and minerals such as spodumene","From bauxite","From quartz sand","From limestone"], why:"Lithium is recovered from brines (by evaporating the water) or from ores such as spodumene."},
    {q:"Which ore provides most of the copper for conductive tracks?", a:["Chalcopyrite (CuFeS₂)","Bauxite","Halite (NaCl)","Quartz (SiO₂)"], why:"Most copper comes from sulfide ores such as chalcopyrite. Poland has large deposits of such ores in Lower Silesia."}
   ]},
 bag:{ name:"Paper bag", material:"paper (cellulose)", symSub:"cellulose", repairLabel:"Reusing the bag",
   binWhy:"In Poland clean paper and cardboard go in the blue bin. Greasy or wet paper goes in mixed waste.",
   src:{good:"FSC-certified wood",goodD:"The forest is replanted and felling is planned."},
   eco:{title:"Thicker paper and strong handles",desc:"More material, but you can use the bag once more."},
   factProd:"In the kraft process lignin is removed from wood, leaving cellulose pulp. A paper bag has a larger production footprint than a plastic bag, so it only pays off when reused many times.",
   factRec:"Each time paper is recycled the cellulose fibres get shorter, so paper can be recycled about 5–7 times. In the game you can recover the bag at most 3 times.",
   real:"Paper bag: on the order of 0.05–0.1 kg CO₂e. In a landfill it decomposes without oxygen, releasing methane.",
   quiz:[
    {q:"What is the main raw material for making paper?", a:["Wood (cellulose)","Quartz sand","Crude oil","Bauxite"], why:"Paper is a web of cellulose fibres, usually from wood."},
    {q:"What is removed from wood in the kraft process?", a:["Lignin","Cellulose","Glucose","Silica"], why:"Lignin binds the fibres together in wood. Removing it gives cellulose pulp for papermaking."},
    {q:"Why can paper be recycled only a few times?", a:["The cellulose fibres get shorter","Paper turns into plastic","Cellulose dissolves in water","Paper contains heavy metals"], why:"Short fibres don't bond well, so the paper loses strength."},
    {q:"Which compound is often used to bleach pulp without chlorine?", a:["Hydrogen peroxide (H₂O₂)","Hydrochloric acid (HCl)","Sodium chloride (NaCl)","Ammonia (NH₃)"], why:"Totally chlorine-free (TCF) bleaching uses hydrogen peroxide and ozone, among others, which reduces toxic organochlorine compounds in wastewater."}
   ]}
};

