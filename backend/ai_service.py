import os
import json
import uuid
import re
import random
import time
import requests

# -----------------------------------------------------------------------------
# Material Normalization & Typo Resolution
# -----------------------------------------------------------------------------
MATERIAL_ALIASES = {
    # Metal cans / Coke tins / Soda cans
    "coketin": ("Coke / Soda Tin Cans", "metal_can"),
    "coketins": ("Coke / Soda Tin Cans", "metal_can"),
    "coke tin": ("Coke / Soda Tin Cans", "metal_can"),
    "coke tins": ("Coke / Soda Tin Cans", "metal_can"),
    "coke can": ("Coke / Soda Tin Cans", "metal_can"),
    "coke cans": ("Coke / Soda Tin Cans", "metal_can"),
    "soda can": ("Coke / Soda Tin Cans", "metal_can"),
    "soda cans": ("Coke / Soda Tin Cans", "metal_can"),
    "tin can": ("Tin / Aluminum Cans", "metal_can"),
    "tin cans": ("Tin / Aluminum Cans", "metal_can"),
    "tincan": ("Tin / Aluminum Cans", "metal_can"),
    "tincans": ("Tin / Aluminum Cans", "metal_can"),
    "tins": ("Tin / Aluminum Cans", "metal_can"),
    "can": ("Tin / Aluminum Cans", "metal_can"),
    "cans": ("Tin / Aluminum Cans", "metal_can"),
    "aluminum can": ("Tin / Aluminum Cans", "metal_can"),
    "aluminium can": ("Tin / Aluminum Cans", "metal_can"),
    "beer can": ("Aluminum Beverage Cans", "metal_can"),
    "pepsi can": ("Coke / Soda Tin Cans", "metal_can"),

    # Glue gun / Adhesives
    "gkue gun": ("Hot Glue Gun", "adhesive_gun"),
    "glue gun": ("Hot Glue Gun", "adhesive_gun"),
    "gluegun": ("Hot Glue Gun", "adhesive_gun"),
    "hot glue": ("Hot Glue Gun", "adhesive_gun"),
    "hot glue gun": ("Hot Glue Gun", "adhesive_gun"),
    "hotglue": ("Hot Glue Gun", "adhesive_gun"),
    "glue": ("Craft Glue / Adhesive", "adhesive"),

    # Plastic bottles & containers
    "plastic bottle": ("Plastic Bottles", "plastic_bottle"),
    "plastic bottles": ("Plastic Bottles", "plastic_bottle"),
    "water bottle": ("Plastic Bottles", "plastic_bottle"),
    "bottle": ("Plastic / Glass Bottles", "plastic_bottle"),
    "bottles": ("Plastic / Glass Bottles", "plastic_bottle"),
    "milk jug": ("Plastic Jugs", "plastic_bottle"),

    # Cardboard & paper
    "cardboard": ("Cardboard", "cardboard"),
    "card board": ("Cardboard", "cardboard"),
    "box": ("Cardboard Box", "cardboard"),
    "cardboard box": ("Cardboard Box", "cardboard"),
    "carton": ("Cardboard Carton", "cardboard"),
    "paper": ("Paper / Cardstock", "paper"),
    "newspaper": ("Newspaper", "paper"),
    "toilet paper roll": ("Cardboard Tubes", "cardboard"),
    "egg carton": ("Egg Cartons", "egg_carton"),
    "egg cartons": ("Egg Cartons", "egg_carton"),

    # Wood & sticks
    "ice-cream sticks": ("Popsicle Sticks", "wood_stick"),
    "ice cream sticks": ("Popsicle Sticks", "wood_stick"),
    "popsicle sticks": ("Popsicle Sticks", "wood_stick"),
    "popsicle stick": ("Popsicle Sticks", "wood_stick"),
    "craft sticks": ("Popsicle Sticks", "wood_stick"),
    "sticks": ("Wooden Sticks / Twigs", "wood_stick"),
    "twigs": ("Natural Twigs", "wood_stick"),

    # Fibers & textiles
    "wool": ("Wool / Yarn", "fiber"),
    "yarn": ("Wool / Yarn", "fiber"),
    "thread": ("Craft String / Thread", "fiber"),
    "twine": ("Jute Twine", "fiber"),
    "old clothes": ("Old Clothes / Fabric", "fabric"),
    "fabric": ("Fabric Scraps", "fabric"),
    "denim": ("Old Denim Jeans", "fabric"),
    "jeans": ("Old Denim Jeans", "fabric"),

    # Glass
    "mason jar": ("Mason Jars", "glass"),
    "mason jars": ("Mason Jars", "glass"),
    "glass jar": ("Glass Jars", "glass"),
    "glass bottle": ("Glass Bottles", "glass"),
}

def normalize_material_name(raw_name):
    cleaned = raw_name.lower().strip()
    if cleaned in MATERIAL_ALIASES:
        return MATERIAL_ALIASES[cleaned][0]
    for alias_key, (canon_name, _) in MATERIAL_ALIASES.items():
        if alias_key in cleaned or cleaned in alias_key:
            return canon_name
    return raw_name.strip().title()

# -----------------------------------------------------------------------------
# Rich Seed Craft Database (Diverse Recipes)
# -----------------------------------------------------------------------------
CRAFT_RECIPE_KNOWLEDGE = [
    # --- COKE TINS & GLUE GUN PROJECTS ---
    {
        "id": "craft-coke-1",
        "title": "Embossed Coke Tin Desk Organizer & Pen Caddy",
        "tagline": "Transform recycled coke tins and hot glue into a sleek tiered workstation organizer.",
        "materialsRequired": ["Coke / Soda Tin Cans (2-3 cans)", "Hot Glue Gun & glue sticks", "Scissors / Utility shears", "Sandpaper or Washi tape", "Acrylic paint or metallic spray"],
        "materialsKeywords": ["coke", "can", "tin", "soda", "metal", "glue gun", "adhesive", "gkue gun"],
        "category": "Home Decor",
        "difficulty": "Easy",
        "estimatedTime": "20-30 minutes",
        "occasion": "Decoration",
        "description": "An ingenious modern desk caddy crafted from upcycled soda tins, bonded with hot glue and finished with raised textured filigree.",
        "steps": [
            "Rinse and dry 2 to 3 empty coke tins thoroughly.",
            "Carefully cut the top lids off the cans using a can opener or sturdy craft shears.",
            "Smooth down the cut inner rim using fine-grit sandpaper, or wrap with washi tape to eliminate any sharp metal edges.",
            "Cut one can to full height (12 cm) for pens, trim the second to 8 cm for markers, and the third to 4 cm for paperclips.",
            "Plug in your hot glue gun and let it warm up for 3 minutes until the adhesive flows smoothly.",
            "Apply generous vertical beads of hot glue along the seams where the cans meet, and press them firmly together in a clustered triangle for 15 seconds.",
            "Use the nozzle of the glue gun to draw raised 3D geometric dots, spirals, or monogram textures directly onto the metal walls.",
            "Apply a coat of matte black or pastel acrylic paint over the raised glue texture for a chic ceramic workstation piece."
        ],
        "tips": [
            "Fill the base of the tallest can with a handful of clean pebbles for satisfying weight and anti-tip stability.",
            "Buff metallic gold wax over the raised glue patterns for an antique embossed look."
        ],
        "safetyNotes": "Aluminum edges can be sharp when cutting; take your time and wrap rims with protective tape. Avoid touching the hot glue gun metal tip."
    },
    {
        "id": "craft-coke-2",
        "title": "Perforated Coke Can Ambient Tea Light Luminary",
        "tagline": "Cast magical constellation shadows across your room with perforated soda tins.",
        "materialsRequired": ["Coke / Soda Tin Cans", "Hot Glue Gun", "Thumbtack / Small nail & hammer", "Battery-powered LED tea light", "Tape"],
        "materialsKeywords": ["coke", "can", "tin", "soda", "metal", "glue gun", "lantern", "tea light"],
        "category": "Festival",
        "difficulty": "Easy",
        "estimatedTime": "25-35 minutes",
        "occasion": "Festival",
        "description": "A charming ambient lantern that turns discarded beverage cans into constellation star projectors with safe LED illumination.",
        "steps": [
            "Wash and remove any sticky residue from your coke tin.",
            "Fill the tin 3/4 with water and place in the freezer for 2 hours (the frozen ice prevents the thin aluminum from denting while punching).",
            "Sketch star patterns or geometric zig-zags on the outer tin using a permanent marker.",
            "Using a thumbtack or small nail, gently tap perforations along your pattern lines all around the cylinder.",
            "Allow the ice to melt out and dry the interior with a paper towel.",
            "Using your hot glue gun, pipe three small raised dots of glue on the bottom base to serve as non-scratch rubberized feet.",
            "Run a bead of hot glue around the top rim to seal and cushion the opening.",
            "Drop a battery-operated LED tea light candle inside and dim the lights to enjoy starry night projections."
        ],
        "tips": [
            "Spray the exterior with frosted seafoam or rose gold paint for a luxury lantern finish.",
            "Use varying nail thicknesses to create big and small constellation stars."
        ],
        "safetyNotes": "Never use real wax candles inside aluminum tins as the metal conducts heat rapidly. Always use battery LED lights."
    },
    {
        "id": "craft-coke-3",
        "title": "Rustic Twine & Coke Tin Succulent Planters",
        "tagline": "Wrap everyday beverage cans in organic textures for boho hanging greenery.",
        "materialsRequired": ["Coke / Soda Tin Cans", "Hot Glue Gun", "Twine / Wool yarn", "Potting soil & small succulents", "Awl or nail (for drainage)"],
        "materialsKeywords": ["coke", "can", "tin", "soda", "twine", "wool", "yarn", "glue gun"],
        "category": "Recycling",
        "difficulty": "Easy",
        "estimatedTime": "20-25 minutes",
        "occasion": "General",
        "description": "Cozy, organic planters wrapped in jute or yarn that breathe life into empty soda cans, perfect for windowsills and desks.",
        "steps": [
            "Cut the top lid completely off the coke can and rinse thoroughly.",
            "Punch 2 drainage holes into the bottom base using an awl or nail.",
            "Place a dime-sized dot of hot glue at the bottom rim of the can and anchor the start of your twine or yarn.",
            "Wrap the twine snugly in concentric coils upward, applying thin dots of hot glue every third rotation to anchor the wrap.",
            "Fold the top 1 cm of twine over the upper rim with hot glue to safely conceal any raw metal edges.",
            "Add small pebbles in the bottom for drainage, add soil, and tuck in a baby succulent or jade cutting.",
            "Hot-glue a hanging cord loop to both sides if you prefer to suspend your planter."
        ],
        "tips": [
            "Alternate bands of natural jute twine with colored wool for nautical or Scandinavian stripes.",
            "Water with a dropper or spray bottle once weekly."
        ],
        "safetyNotes": "Ensure drainage holes are punched before planting so roots do not become waterlogged."
    },
    {
        "id": "craft-coke-4",
        "title": "Soda Can Kinetic Metal Wind Chime",
        "tagline": "Delicate embossed metal leaves that chime with melodic whispers in the breeze.",
        "materialsRequired": ["Coke / Soda Tin Cans", "Hot Glue Gun", "Scissors", "Twine or fishing line", "Dried branch or wooden stick"],
        "materialsKeywords": ["coke", "can", "tin", "metal", "wind chime", "glue gun"],
        "category": "Art",
        "difficulty": "Medium",
        "estimatedTime": "35-45 minutes",
        "occasion": "Decoration",
        "description": "A musical kinetic garden mobile featuring hand-embossed aluminum leaves cut from soft soda cans.",
        "steps": [
            "Cut off the top and bottom of 2 coke cans, then slit down the center to yield flat rectangular aluminum sheets.",
            "Flatten the sheets under a heavy book for 10 minutes.",
            "Cut out 8 to 10 leaf or feather silhouettes (approx 6-8 cm each) with household scissors.",
            "Use a blunt ballpoint pen to score leaf veins deeply into each cutout, creating beautiful dimensional embossing.",
            "Cut strands of twine or clear line at staggered lengths (15 to 30 cm).",
            "Apply a drop of hot glue to the stem of each metal leaf, press the string into the glue, and fold the stem tip over to lock it.",
            "Tie the hanging strands along a 20 cm branch or wooden stick, securing each knot with a dot of hot glue.",
            "Hang near a window or patio where gentle breezes cause the lightweight metal leaves to click melodically."
        ],
        "tips": [
            "Alcohol inks or colored sharpies produce brilliant jewel-tone stained glass effects on shiny aluminum.",
            "Sand the edges of the cut leaves slightly with fine steel wool or emery cloth."
        ],
        "safetyNotes": "Wear lightweight gloves when handling flat aluminum sheets to protect your fingertips."
    },
    {
        "id": "craft-coke-5",
        "title": "Industrial Coke Can Wall Clock & Sunburst Plaque",
        "tagline": "Radiating metallic sunburst wall statement piece crafted with coke tins and hot glue.",
        "materialsRequired": ["Coke / Soda Tin Cans (3 cans)", "Hot Glue Gun", "Small quartz clock kit or round mirror", "Cardboard backing disc", "Gold / Bronze spray paint"],
        "materialsKeywords": ["coke", "can", "tin", "metal", "glue gun", "clock", "mirror"],
        "category": "Home Decor",
        "difficulty": "Hard",
        "estimatedTime": "45-60 minutes",
        "occasion": "Decoration",
        "description": "A high-end metallic sunburst wall accent that transforms aluminum beverage cans into radiating geometric spikes around a central dial or mirror.",
        "steps": [
            "Cut the aluminum bodies of 3 coke cans into 24 long, slender triangular ray strips (approx 12 cm long).",
            "Score a crease down the center ridge of each ray with a ruler to create a faceted, light-catching 3D angle.",
            "Cut a 15 cm circular cardboard disc to serve as the structural mounting hub.",
            "Heat your hot glue gun. Glue the outer ring of 12 long rays evenly radiating outward like clock numerals.",
            "Glue a second inner ring of 12 shorter rays staggered between the first layer, using hot glue to build dimensional depth.",
            "Spray the assembled sunburst in champagne gold or brushed bronze metallic finish.",
            "Hot-glue a round mirror or battery clock mechanism directly into the center recessed hub.",
            "Add a sawtooth picture hanger on the back and mount on an accent wall."
        ],
        "tips": [
            "Fold the ray tips into chevron points for an art-deco aesthetic.",
            "Add small adhesive rhinestones or wooden beads at ray intersections."
        ],
        "safetyNotes": "Be careful when cutting long aluminum strips; fold the sharp tips slightly inward before gluing."
    },
    {
        "id": "craft-coke-6",
        "title": "Coke Tin Cookie Cutters & Embossed Holiday Ornaments",
        "tagline": "Pliable aluminum tins shaped into precision pastry cutters and Christmas tree baubles.",
        "materialsRequired": ["Coke / Soda Tin Cans", "Hot Glue Gun", "Pliers", "Paper templates", "Ribbon"],
        "materialsKeywords": ["coke", "can", "tin", "metal", "glue gun", "ornament", "cutter"],
        "category": "Gifts",
        "difficulty": "Medium",
        "estimatedTime": "25-35 minutes",
        "occasion": "Birthday",
        "description": "Custom shaped cookie cutters and reflective metallic tree ornaments formed by bending pliable aluminum strips.",
        "steps": [
            "Cut a 3 cm wide strip around the circumference of a clean coke can.",
            "Fold the top 0.5 cm edge over using pliers and press flat to create a blunt, safe grip rim.",
            "Bend the strip around a paper stencil (heart, star, cat, or crescent moon) using small needle-nose pliers.",
            "Overlap the two free ends by 1 cm and seal securely with a high-temperature bead of hot glue.",
            "Test the cutter shape on soft playdough or pastry dough.",
            "Alternatively, punch a hole in the top apex, loop a festive satin ribbon, and hang as a glossy handmade tree ornament."
        ],
        "tips": [
            "Coat with food-grade lacquer if planning to wash and reuse frequently with dough.",
            "Emboss names or birthday dates along the outer rim using a blunt ballpoint pen."
        ],
        "safetyNotes": "Always fold the grip edge over so your fingers never press down on raw metal."
    },

    # --- OTHER UP-CYCLING MATERIALS RECIPES ---
    {
        "id": "craft-seed-cardboard",
        "title": "Geometric Cardboard Desk Organizer",
        "tagline": "Turn cardboard boxes into a modern workstation aesthetic.",
        "materialsRequired": ["Cardboard", "Paper", "Scissors / Utility knife", "Glue or Double-sided tape", "Ruler"],
        "materialsKeywords": ["cardboard", "box", "carton", "paper"],
        "category": "Home Decor",
        "difficulty": "Easy",
        "estimatedTime": "25-35 minutes",
        "occasion": "Decoration",
        "description": "A stylish, eco-friendly desktop caddy with tiered hexagonal compartments to neatly hold pens and stationery.",
        "steps": [
            "Measure and cut six cardboard rectangles (three 10x15 cm for back slots, three 10x10 cm for front slots).",
            "Score vertical fold lines along each piece to fold them into hexagonal prism tubes.",
            "Glue the tube edges securely with adhesive and allow 5 minutes to set.",
            "Assemble the tubes together in a clustered honey-comb arrangement.",
            "Trace the bottom cluster onto a flat cardboard sheet and glue it to seal the bottom.",
            "Cover the exterior with pastel paper or acrylic paint."
        ],
        "tips": ["Use marble contact paper for a luxe aesthetic."],
        "safetyNotes": "Supervise children when cutting rigid cardboard."
    },
    {
        "id": "craft-seed-bottle",
        "title": "Hanging Self-Watering Bottle Planters",
        "tagline": "Upcycle clear plastic bottles into hydroponic hanging greenery.",
        "materialsRequired": ["Plastic bottles", "Wool / Yarn", "Scissors", "Potting soil", "Small plants"],
        "materialsKeywords": ["plastic bottles", "plastic", "bottle", "wool", "yarn"],
        "category": "Recycling",
        "difficulty": "Easy",
        "estimatedTime": "20-30 minutes",
        "occasion": "General",
        "description": "An ingenious sub-irrigation planter made from recycled PET bottles that automatically wicks moisture to plant roots.",
        "steps": [
            "Rinse and remove labels from a clean plastic bottle.",
            "Cut the bottle in half horizontally with scissors.",
            "Invert the top funnel section upside-down into the bottom beaker-like base.",
            "Thread a thick piece of wool yarn (approx 20cm) through the neck into the water reservoir.",
            "Fill the top funnel with potting soil and plant your favorite succulent or mint sprig.",
            "Paint cute minimalist geometric lines on the outer plastic."
        ],
        "tips": ["Tie twine macramé style around the top rim to suspend near a sunny window."],
        "safetyNotes": "Smooth any jagged cut edges on the plastic with sandpaper."
    },
    {
        "id": "craft-seed-wool",
        "title": "Bohemian Yarn & Stick Wall Tapestry",
        "tagline": "Weave earthy textures into a cozy Scandinavian woven wall hanging.",
        "materialsRequired": ["Wool / Yarn (multiple colors)", "Ice-cream sticks / Popsicle sticks or Fallen twigs", "Scissors", "Wooden beads"],
        "materialsKeywords": ["wool", "yarn", "ice-cream sticks", "popsicle sticks", "sticks", "twigs"],
        "category": "Art",
        "difficulty": "Medium",
        "estimatedTime": "40-50 minutes",
        "occasion": "Decoration",
        "description": "A charming fiber-art wall hanging combining warm wool gradients with natural wood textures for bohemian wall accents.",
        "steps": [
            "Glue 3 popsicle sticks end-to-end to create a sturdy 25cm horizontal suspension bar.",
            "Cut 24 strands of wool yarn, each approximately 60 cm in length.",
            "Fold each yarn strand in half and loop it onto the wooden bar using a classic lark's head knot.",
            "Group strands into sets of 4 and create simple square knots or braid alternating sections.",
            "Trim the bottom fringe into a sharp V-shape with sharp shears.",
            "Attach a hanging loop to both ends of the top stick and mount on the wall."
        ],
        "tips": ["Combine contrasting yarn weights for rich tactile texture."],
        "safetyNotes": "Keep scissors away from small toddlers when trimming fibers."
    },
    {
        "id": "craft-seed-denim",
        "title": "Upcycled Denim Pocket Organizer & Wall Valet",
        "tagline": "Give retired denim jeans a second life as a rugged portable organizer.",
        "materialsRequired": ["Old clothes / Denim jeans", "Cardboard or Fabric glue / Hot glue", "Scissors", "Buttons or Ribbons"],
        "materialsKeywords": ["old clothes", "clothes", "fabric", "denim", "jeans"],
        "category": "Fashion",
        "difficulty": "Medium",
        "estimatedTime": "35-45 minutes",
        "occasion": "General",
        "description": "A chic organizer utilizing the back pockets and sturdy seams of worn denim pants, perfect for bedside or office tools.",
        "steps": [
            "Cut out the back pockets of old jeans, leaving a 1.5 cm fabric border.",
            "Cut a 25x35 cm rectangular backing panel from jeans fabric or cloth bag.",
            "Arrange 2 to 3 pockets staggered across the backing panel.",
            "Secure the pockets in place using strong fabric adhesive or hot glue.",
            "Fold the top 2 cm edge over a wooden stick or dowel to form a casing channel.",
            "Attach a sturdy denim seam strip to both ends to hang on a wall hook."
        ],
        "tips": ["Fray the denim pocket edges with a wire brush for a distressed look."],
        "safetyNotes": "Use heavy-duty fabric shears rather than paper scissors."
    },
    {
        "id": "craft-seed-egg",
        "title": "Egg Carton Blossom Fairy Lights",
        "tagline": "Turn utilitarian egg crates into romantic floral string lights.",
        "materialsRequired": ["Egg cartons", "Fairy lights (LED string)", "Acrylic paint or watercolors", "Scissors", "Glue"],
        "materialsKeywords": ["egg cartons", "egg carton", "carton", "paper"],
        "category": "Home Decor",
        "difficulty": "Easy",
        "estimatedTime": "30-40 minutes",
        "occasion": "Decoration",
        "description": "Upcycle cardboard egg cups into delicate multi-petaled blossoms that slide over LED fairy string lights.",
        "steps": [
            "Cut individual egg cups apart from a paper egg carton.",
            "Trim the rim of each cup into 4 curved petal curves with small scissors.",
            "Cut smaller secondary cups and flare the petals outward to create blooming flower layers.",
            "Paint the petals in soft pinks, lavender, and buttercup yellow hues.",
            "Poke a small cross 'X' slit into the back center of each blossom cup.",
            "Push an LED bulb from your fairy light string through the slit of each flower."
        ],
        "tips": ["Dust petal tips with fine craft glitter while paint is damp."],
        "safetyNotes": "Only use cool-running LED fairy lights."
    },
    {
        "id": "craft-seed-sticks",
        "title": "Popsicle Stick Miniature Easel & Picture Stand",
        "tagline": "Craft adorable desktop picture stands from ice-cream sticks in minutes.",
        "materialsRequired": ["Ice-cream sticks / Popsicle sticks", "Glue (Hot glue or Craft PVA)", "Acrylic paint / markers", "Scissors"],
        "materialsKeywords": ["ice-cream sticks", "popsicle sticks", "sticks", "wood"],
        "category": "Gifts",
        "difficulty": "Easy",
        "estimatedTime": "15-20 minutes",
        "occasion": "Birthday",
        "description": "A miniature artist tripod easel designed to display favorite photos, cards, or inspirational quotes.",
        "steps": [
            "Lay out three jumbo popsicle sticks in an A-frame triangle layout.",
            "Glue the two side sticks together at the apex point.",
            "Glue a horizontal stick across the lower third of the 'V' to act as the shelf ledge.",
            "Attach a third stick to the top rear apex angled backward as the kickstand leg.",
            "Paint in favorite pastel tones.",
            "Place your mini photo or greeting card onto the easel shelf."
        ],
        "tips": ["Write the recipient's name in calligraphy along the front shelf."],
        "safetyNotes": "Allow hot glue 60 seconds to cool before handling."
    }
]

# -----------------------------------------------------------------------------
# Dynamic Procedural Archetypes for ANY custom materials
# -----------------------------------------------------------------------------
DYNAMIC_ARCHETYPES = [
    {
        "name": "Multi-Tier Architectural Organizer",
        "category": "Home Decor",
        "tagline": "Modular, tiered storage vessel tailored to declutter desks and craft tables.",
        "steps": [
            "Clean and prepare {mat_primary}, ensuring all surfaces are dry and smooth.",
            "Plan a 3-tier arrangement using {mat_primary} for varying storage heights.",
            "Bond the structural joints firmly using {mat_secondary}, pressing firmly for 15 seconds.",
            "Reinforce seams and base corners with additional adhesive beads.",
            "Paint or embellish exterior surfaces with accent colors or metallic highlights.",
            "Arrange pens, scissors, stationery, or brushes in the finished compartments."
        ],
        "tip": "Add small weighted marbles or pebbles inside the base for superior stability."
    },
    {
        "name": "Ambient Constellation Lantern & Luminary",
        "category": "Festival",
        "tagline": "Intricate pierced luminary that casts ambient geometric glow and star shadows.",
        "steps": [
            "Wash and prep {mat_primary}, removing all labels and dust.",
            "Sketch constellation or mandala dot patterns across the body.",
            "Carefully pierce or cut aperture openings along your stencil lines.",
            "Use {mat_secondary} to fix decorative trim or non-scratch baseline feet.",
            "Apply a coat of hammered bronze or frosted white paint to the exterior.",
            "Place an LED battery tea light inside to project shimmering shadows on walls."
        ],
        "tip": "Never use live open-flame candles; stick to cool-touch battery LED candles."
    },
    {
        "name": "Botanical Window Planter & Herb Cradle",
        "category": "Recycling",
        "tagline": "Upcycled eco-friendly planter with drainage and natural suspension cord.",
        "steps": [
            "Cut a top or side opening in {mat_primary} to create the soil trough.",
            "Smooth cut edges and puncture 2 small drainage holes in the base.",
            "Use {mat_secondary} to anchor rustic wrapping cords, washi tape, or decorative ribs.",
            "Fasten twin hanging loops with reinforced adhesive bonding points.",
            "Layer 1 cm of gravel at the bottom, add potting mix, and tuck in your greenery.",
            "Position near a bright window and water gently once a week."
        ],
        "tip": "Succulents, mint, and pothos cuttings thrive brilliantly in upcycled planters."
    },
    {
        "name": "Kinetic Acoustic Wind Chime & Garden Mobile",
        "category": "Art",
        "tagline": "Musical garden mobile that chimes with melodious acoustic clinking in breezes.",
        "steps": [
            "Cut {mat_primary} into 6 to 8 lightweight paddle or leaf silhouettes.",
            "Smooth the perimeter of each cutout with fine sandpaper or protective edges.",
            "Emboss relief lines and geometric ridges onto the surface for dimensional texture.",
            "Fasten staggered suspension cords to each piece using {mat_secondary}.",
            "Tie the hanging strands evenly across a horizontal branch or ring.",
            "Hang on a balcony, patio, or near an open window to enjoy kinetic motion."
        ],
        "tip": "Vary the lengths of hanging cords so the pieces collide at their widest points."
    },
    {
        "name": "Geometric Wall Art Plaque & Clock Face",
        "category": "Home Decor",
        "tagline": "Faceted statement wall piece with rich 3D shadows and architectural styling.",
        "steps": [
            "Cut {mat_primary} into uniform geometric tiles (triangles or hexagons).",
            "Fold or score each piece along center lines to create faceted 3D ridges.",
            "Arrange the faceted tiles into a radial or chevron mosaic on a backing board.",
            "Glue each tile firmly in place with {mat_secondary}, creating layered shadows.",
            "Spray with matte chalk paint or antique with gold leaf paste.",
            "Mount on your living room or office wall as a conversation-starter focal point."
        ],
        "tip": "A matte monochrome finish makes the craft look like high-end designer stoneware."
    },
    {
        "name": "Custom Gift Caddy & Memory Keepsake Box",
        "category": "Gifts",
        "tagline": "Personalized gift presentation box and treasure chest for special occasions.",
        "steps": [
            "Form the base and lid chassis using your cleaned {mat_primary}.",
            "Reinforce the lid hinge and interior corners using {mat_secondary}.",
            "Line the interior with soft felt, fabric scraps, or tissue paper.",
            "Apply decorative stencils, ribbons, or personalized monograms to the lid.",
            "Fill with treats, handwritten notes, or small gifts for your recipient."
        ],
        "tip": "Tie with rustic jute twine and tuck a sprig of dried lavender for a bespoke touch."
    }
]

# -----------------------------------------------------------------------------
# Main Generation Controller
# -----------------------------------------------------------------------------
def generate_craft_ideas(materials, category=None, difficulty=None, occasion=None, count=3):
    """
    Generate structured craft ideas using Gemini AI if GEMINI_API_KEY is configured in backend/.env,
    otherwise fallback cleanly to the intelligent randomized recipe matching engine.
    """
    materials_list = [m.strip() for m in materials if m and m.strip()]
    if not materials_list:
        materials_list = ["cardboard", "paper"]

    count = max(1, min(int(count or 3), 5))
    key = os.getenv("GEMINI_API_KEY", "").strip()

    if key:
        try:
            print(f"[AI Service] Calling live Gemini API for materials: {materials_list}")
            ideas = _call_gemini_api(materials_list, category, difficulty, occasion, count, key)
            if ideas and len(ideas) > 0:
                return {
                    "crafts": ideas,
                    "engine": "Gemini AI",
                    "status": "success",
                    "count": len(ideas)
                }
        except Exception as e:
            err_msg = str(e)
            print(f"[AI Service Error] Gemini API failed: {err_msg}. Using dynamic smart engine.")
            smart_result = _smart_craft_generator(materials_list, category, difficulty, occasion, count)
            return {
                "crafts": smart_result,
                "engine": "Smart Craft Engine (Fallback)",
                "status": "success",
                "count": len(smart_result),
                "note": f"Gemini API returned an error ({err_msg[:90]}...). Used material-aware smart engine."
            }

    # Smart Algorithmic Fallback Engine
    ideas = _smart_craft_generator(materials_list, category, difficulty, occasion, count)
    return {
        "crafts": ideas,
        "engine": "Smart Craft Engine (Zero-Config)",
        "status": "success",
        "count": len(ideas),
        "note": "Generated using our dynamic craft engine. Configure GEMINI_API_KEY for live generative AI."
    }

def _call_gemini_api(materials, category, difficulty, occasion, count, api_key):
    """Calls Gemini API with JSON structured prompt, high temperature, and fresh variety seeds."""
    random_seed = random.randint(1000, 999999)
    freshness_timestamp = int(time.time() * 1000)

    prompt = f"""
You are an expert master craft maker, DIY upcycling artisan, and creative educator.
Generate exactly {count} distinct, creative, and practical DIY craft ideas tailored to the following criteria:

- Available Materials Provided by User: {', '.join(materials)}
- Preferred Craft Category: {category or 'Any / Creative'}
- Target Difficulty: {difficulty or 'Any'}
- Occasion: {occasion or 'General'}
- Randomness Seed: {random_seed} (Timestamp: {freshness_timestamp})

CRITICAL INSTRUCTIONS:
1. Pay strict attention to the EXACT materials the user provided.
2. If the user input contains typos or colloquial terms (for example: 'coketins' means Coke or soda aluminum cans/tins, 'gkue gun' means Hot Glue Gun), intelligently resolve the typo and make sure the craft ideas DIRECTLY feature those materials!
3. DO NOT output crafts using unrelated materials (like cardboard or wool) unless the user actually specified them or they serve as minor common household tools (like scissors or ruler).
4. GENERATE DIVERSE & FRESH IDEAS: Do not repeat standard cookie-cutter ideas. Explore distinct functional angles (e.g. ambient lighting, desktop utility, wall art, kinetic decor, gardening, gifts).
5. Provide realistic, step-by-step numbered instructions that directly explain how to cut, shape, bond, and assemble the user's specific items.

Return ONLY a strictly valid JSON array of objects. No markdown backticks (no ```json), no surrounding conversation.
JSON Schema:
[
  {{
    "id": "craft-unique-id",
    "title": "Creative Craft Title",
    "tagline": "Catchy 1-sentence hook",
    "category": "{category if category and category != 'All' else 'Home Decor'}",
    "difficulty": "{difficulty if difficulty and difficulty != 'All' else 'Easy'}",
    "estimatedTime": "20-30 minutes",
    "occasion": "{occasion if occasion and occasion != 'All' else 'General'}",
    "description": "Engaging 2-3 sentence overview explaining what this craft is and why it's special.",
    "materialsRequired": ["List", "of", "materials", "highlighting user items and common supplies"],
    "steps": [
      "1. Detailed step...",
      "2. Detailed step...",
      "3. Detailed step...",
      "4. Detailed step...",
      "5. Detailed step..."
    ],
    "tips": [
      "Pro tip 1",
      "Pro tip 2"
    ],
    "safetyNotes": "Specific safety note regarding cutting, heat, or edges."
  }}
]
"""
    # Configurable model via environment, with robust fallbacks
    configured_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash").strip()
    candidate_models = [
        configured_model,
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-3.8-flash"
    ]
    models = []
    for m in candidate_models:
        if m and m not in models:
            models.append(m)
    last_err = None

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.95,  # High temperature for maximum variety
                "topP": 0.95,
                "responseMimeType": "application/json"
            }
        }
        
        try:
            res = requests.post(url, json=payload, timeout=25)
            if res.status_code == 200:
                data = res.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                text = re.sub(r"^```json\s*", "", text)
                text = re.sub(r"^```\s*", "", text)
                text = re.sub(r"\s*```$", "", text)
                parsed = json.loads(text)
                
                for idx, craft in enumerate(parsed):
                    if not craft.get("id"):
                        craft["id"] = f"craft-ai-{uuid.uuid4().hex[:8]}"
                    if "materialsRequired" not in craft and "materials" in craft:
                        craft["materialsRequired"] = craft["materials"]
                return parsed
            else:
                last_err = f"Model {model} returned HTTP {res.status_code}: {res.text[:120]}"
        except Exception as e:
            last_err = str(e)
            continue
            
    raise Exception(f"Gemini generation error: {last_err}")

# -----------------------------------------------------------------------------
# Material-Aware Intelligent Smart Generator with Random Shuffling
# -----------------------------------------------------------------------------
def _smart_craft_generator(materials, category, difficulty, occasion, count):
    """
    Intelligent craft matching algorithm that normalizes user typos, matches
    domain knowledge recipes with RANDOM SHUFFLING, and synthesizes dynamic,
    fresh, non-repetitive crafts on every run.
    """
    normalized_names = [normalize_material_name(m) for m in materials]
    raw_lower = [m.lower().strip() for m in materials]
    
    has_cans = any(k in m for m in raw_lower for k in ["coke", "can", "tin", "soda", "aluminum", "tincan"])
    has_glue_gun = any(k in m for m in raw_lower for k in ["glue", "gkue", "gun", "adhesive"])

    # 1. Filter and score seed recipes
    qualifying_recipes = []
    for recipe in CRAFT_RECIPE_KNOWLEDGE:
        score = 0
        recipe_keywords = [kw.lower() for kw in recipe.get("materialsKeywords", [])]
        
        for raw in raw_lower:
            for kw in recipe_keywords:
                if kw in raw or raw in kw:
                    score += 15
                    break

        if has_cans and any(k in ["coke", "can", "tin", "soda"] for k in recipe_keywords):
            score += 25
        if has_glue_gun and any(k in ["glue gun", "adhesive"] for k in recipe_keywords):
            score += 15

        if category and category != "All":
            if recipe.get("category", "").lower() == category.lower():
                score += 5
        
        if score > 0:
            qualifying_recipes.append((score, recipe))

    # Sort recipes by score tier
    qualifying_recipes.sort(key=lambda x: x[0], reverse=True)
    
    # SHUFFLE among top scoring recipes to avoid repeating the exact same order!
    if qualifying_recipes:
        top_score = qualifying_recipes[0][0]
        # Group top tier (within 10 points of top score) and shuffle them
        top_tier = [r for s, r in qualifying_recipes if s >= top_score - 10]
        lower_tier = [r for s, r in qualifying_recipes if s < top_score - 10]
        random.shuffle(top_tier)
        random.shuffle(lower_tier)
        candidate_pool = top_tier + lower_tier
    else:
        candidate_pool = []

    selected_ideas = []
    
    # Pick up to count recipes from candidate pool
    for recipe in candidate_pool[:count]:
        idea = json.loads(json.dumps(recipe))
        idea["id"] = f"craft-{uuid.uuid4().hex[:8]}"
        
        # Inject normalized materials
        materials_display = list(idea.get("materialsRequired", []))
        for nm in normalized_names:
            if not any(nm.lower() in existing.lower() for existing in materials_display):
                materials_display.insert(0, f"{nm} (At hand)")
        idea["materialsRequired"] = materials_display[:6]

        if category and category != "All":
            idea["category"] = category
        if difficulty and difficulty != "All":
            idea["difficulty"] = difficulty
        if occasion and occasion != "All":
            idea["occasion"] = occasion

        selected_ideas.append(idea)

    # 2. Dynamic Procedural Synthesis for variety & remaining slots
    # Shuffle archetypes so every regeneration produces a brand-new concept!
    available_archetypes = list(DYNAMIC_ARCHETYPES)
    random.shuffle(available_archetypes)
    
    mat_primary = normalized_names[0] if normalized_names else "Available Materials"
    mat_secondary = normalized_names[1] if len(normalized_names) > 1 else "Craft Adhesive"

    archetype_idx = 0
    while len(selected_ideas) < count:
        arch = available_archetypes[archetype_idx % len(available_archetypes)]
        archetype_idx += 1
        
        synth_title = f"{mat_primary} {arch['name']}"
        synth_tagline = arch["tagline"]
        synth_desc = f"A customized {arch['category'].lower()} project transforming your {', '.join(normalized_names)} into an artistic {arch['name'].lower()}."
        
        steps = [
            s.replace("{mat_primary}", mat_primary).replace("{mat_secondary}", mat_secondary)
            for s in arch["steps"]
        ]

        synth = {
            "id": f"craft-synth-{uuid.uuid4().hex[:8]}",
            "title": synth_title,
            "tagline": synth_tagline,
            "category": category if category and category != "All" else arch["category"],
            "difficulty": difficulty if difficulty and difficulty != "All" else "Easy",
            "estimatedTime": "20-30 minutes",
            "occasion": occasion if occasion and occasion != "All" else "General",
            "description": synth_desc,
            "materialsRequired": normalized_names + ["Scissors / Utility Shears", "Protective Tape", "Acrylic Paint / Markers"],
            "steps": steps,
            "tips": [arch["tip"], "Add personal decorative touches to celebrate the occasion."],
            "safetyNotes": "Handle cutting tools with care and smooth all edges. Adult supervision for children using hot glue."
        }
        selected_ideas.append(synth)

    return selected_ideas
