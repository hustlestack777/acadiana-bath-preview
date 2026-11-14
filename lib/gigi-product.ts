import { WINDOW_PRICE_LINE } from "./windows";

const BATH_NEXT = "Get My Free Quote, and your consultant will go over it when they measure.";
const WINDOW_NEXT =
  "Get an estimate on our windows page, then set a time to take measurements for the real quote.";

export type ProductTopic = "bath" | "window";

export type ProductMatch = { text: string; topic: ProductTopic; id?: string };

const OTHER_ROOM = ["kit", "chen"].join("");

/** Spoken product answers. Specific questions beat the short window price line. */
export function matchProduct(message: string): ProductMatch | null {
  const text = message.toLowerCase();
  if (!text) return null;

  if (new RegExp(OTHER_ROOM, "i").test(text)) {
    return {
      topic: "bath",
      text: `We focus on bathrooms, and we also do window estimates. We don't remodel kitchens. Is there a bathroom or some windows I can help with?`,
    };
  }

  if (/\b(kohler|moen|delta|hansgrohe|brizo|toto|schluter|fireclay|bedrosians|daltile|cle tile|zia tile|ann sacks)\b/.test(text)) {
    return {
      topic: "bath",
      text: `I won't name a fixture or waterproofing brand we haven't confirmed. Your consultant will go over fixtures and the shower assembly when they measure. ${BATH_NEXT}`,
    };
  }

  if (/\bargon\b|\bkrypton\b|\bzion\b/.test(text)) {
    return {
      topic: "window",
      text: `That's argon, a safe inert gas sealed between the panes. It insulates better than plain air. Krypton is the same idea for a tighter gap, and it costs more. You don't maintain it. If a unit fogs, the seal has failed and the glass gets replaced. ${WINDOW_NEXT}`,
    };
  }

  if (/low-?\s?e|fading|fade/.test(text)) {
    return {
      topic: "window",
      text: `Low-E is a thin coating that reflects heat and cuts a lot of the ultraviolet light that fades floors and fabrics. You still get daylight. Around here I want a coating that keeps solar heat out, not a glass made to collect winter sun. It helps with fading. It is not a promise that nothing will ever lighten. ${WINDOW_NEXT}`,
    };
  }

  if (/triple[\s-]?pane|double[\s-]?pane|three pane|two pane/.test(text)) {
    return {
      topic: "window",
      text: `Double-pane glass with Low-E and argon is the workhorse here, and it can meet ENERGY STAR for our area. Triple-pane insulates more and can help with comfort, condensation, and noise. I won't promise a big extra drop in the electric bill just from the third pane. ${WINDOW_NEXT}`,
    };
  }

  if (/\bnfrc\b|u-factor|shgc|solar heat|energy star/.test(text)) {
    return {
      topic: "window",
      text: `The NFRC label is the scorecard for the whole window. U-factor is insulation, and lower is better. SHGC is how much of the sun's heat comes through, and lower is better here. Visible light is the VT number. Air leakage should be tight. Lafayette sits in ENERGY STAR's Southern zone, so we look for a U-factor of 0.32 or lower and a solar-heat number of 0.23 or lower. ${WINDOW_NEXT}`,
    };
  }

  if (/electric bill|utility bill|energy bill/.test(text)) {
    return {
      topic: "window",
      text: `Better windows can cut heat gain and humid air compared with old, leaky glass. I won't invent a dollar figure for your bill. In our climate the win is mostly less afternoon heat and a tighter seal. ${WINDOW_NEXT}`,
    };
  }

  if (/condens|noise|sound/.test(text) && /window|pane|glass/.test(text)) {
    return {
      topic: "window",
      text: `A tighter, better-insulated window keeps the room-side glass closer to room temperature, which means less condensation. Indoor humidity still matters. An extra pane or laminated glass can also quiet a room. Tell us if noise is a goal and we'll look at that option. ${WINDOW_NEXT}`,
    };
  }

  if (/\bpella\b/.test(text)) {
    return {
      topic: "window",
      text: `We work with Pella. Vinyl, including the 250 Series and Encompass, is the everyday path. Impervia is fiberglass. Lifestyle and Reserve are aluminum-clad wood. We'll match the line to your house when we measure. We are not a factory store. ${WINDOW_NEXT}`,
    };
  }

  if (/\b(black|white)\b/.test(text) && /frame|window/.test(text)) {
    return {
      topic: "window",
      text: `Yes. Black and white frames are both available. A black frame can look sharp next to brass or oak, and white is the quieter choice. We'll confirm the exact color on the line you choose. ${WINDOW_NEXT}`,
    };
  }

  if (/impact|hurricane/.test(text) && /window|glass/.test(text)) {
    return {
      topic: "window",
      text: `Some lines offer impact-resistant glass. Whether you need it depends on the house and what you want the window to stand up to. ${WINDOW_NEXT}`,
    };
  }

  if (/zellige/.test(text) && /seal/.test(text)) {
    return {
      topic: "bath",
      text: `Glazed zellige does not need a sealer. Unglazed natural zellige is more porous and should be sealed. We'll tell you which one you're looking at before it goes on the wall. ${BATH_NEXT}`,
    };
  }

  if (/zellige/.test(text) && /grout/.test(text)) {
    return {
      topic: "bath",
      text: `Grout is part of the look, and it fills the little pits and uneven edges on handmade tile. For glazed zellige we often use Mapei Ultracolor Plus FA. For unglazed natural zellige, Mapei Flexcolor CQ. You can preview Mapei colors on our custom tile page. ${BATH_NEXT}`,
    };
  }

  if (/zellige/.test(text) && /floor/.test(text)) {
    return {
      topic: "bath",
      text: `Zellige is a strong wall tile. It can be used in a wet area when the shower is waterproofed, and some people use it on a light-traffic floor. For a shower floor I usually want more grip, a mosaic or a textured porcelain, and I keep the zellige on the walls where the light can hit it. ${BATH_NEXT}`,
    };
  }

  if (/zellige/.test(text) && /look-?alike|look alike|porcelain|factory/.test(text)) {
    return {
      topic: "bath",
      text: `Real handmade zellige moves a little in color and shape. A zellige-look tile, including some ceramics we can pull from TileBar, is a factory tile with more uniformity. Both can be beautiful. We won't call a look-alike the handmade tile. ${BATH_NEXT}`,
    };
  }

  if (/zellige/.test(text)) {
    return {
      topic: "bath",
      text: `Zellige is handmade glazed tile, with an uneven glossy surface. Light hits each piece a little differently, and small pits or edge chips are part of that look. We blend the boxes so the wall doesn't stripe. We work with Riad Tile for handmade zellige. Glazed zellige does not need a sealer, and the grout color is what makes it sing. It is a strong choice for a shower wall or a color-drenched bath. ${BATH_NEXT}`,
    };
  }

  if (/riad/.test(text)) {
    return {
      topic: "bath",
      text: `Yes. We work with Riad Tile for handmade zellige and other handmade tile. In-stock tile typically ships in about 6 to 12 days. Made-to-order pieces take longer. ${BATH_NEXT}`,
    };
  }

  if (/tilebar|tile bar/.test(text)) {
    return {
      topic: "bath",
      text: `Yes. We work with TileBar. The catalog covers porcelain, ceramic, stone-look, patterned floors, and zellige-look tile. We'll check that the exact tile is rated for a shower wall or a shower floor, not just that it looks right. ${BATH_NEXT}`,
    };
  }

  if (/dcof|slip|shower floor/.test(text)) {
    return {
      topic: "bath",
      text: `A shower floor needs traction under wet feet. That usually means a textured porcelain or a mosaic, and we look at the tile's slip rating, called DCOF. A polished stone-look tile can be right for a wall and a poor choice underfoot. ${BATH_NEXT}`,
    };
  }

  if (/mapei|ultracolor|flexcolor|kerapoxy|\bgrout\b/.test(text)) {
    return {
      topic: "bath",
      text: `We use Mapei grout and caulk colors. In a shower I want something that stands up to water. Ultracolor Plus FA is a dense cement grout. Flexcolor CQ is a ready-to-use grout. Epoxy grout is the most stain-resistant, and it does not take a sealer. We caulk the corners, because grout is not meant to flex. You can preview the colors on our custom tile page. ${BATH_NEXT}`,
    };
  }

  if (/onyx/.test(text) && /steam/.test(text)) {
    return {
      topic: "bath",
      text: `Onyx wall panels are not intended for a steam shower. If steam is the goal, tell us up front and we'll choose another material. We install The Onyx Collection shower panels, bases, and accessories, and Onyx is a preferred material. ${BATH_NEXT}`,
    };
  }

  if (/onyx/.test(text) && /made of|what is onyx|alumina|resin|gelcoat/.test(text)) {
    return {
      topic: "bath",
      text: `Onyx is a solid-surface material: mostly alumina trihydrate, a mineral, mixed with a polyester resin, with a tough gelcoat on the face. Color goes all the way through the panel. We install The Onyx Collection shower panels, bases, and accessories. ${BATH_NEXT}`,
    };
  }

  if (/onyx/.test(text) && /clean|care|vinegar/.test(text)) {
    return {
      topic: "bath",
      text: `A simple weekly cleaning is enough for an Onyx shower. Use a non-abrasive cleaner. Skip grit, which can dull the surface. Diluted white vinegar works well on hard-water film. We install The Onyx Collection shower panels, bases, and accessories. ${BATH_NEXT}`,
    };
  }

  if (/\bonyx\b/.test(text)) {
    return {
      topic: "bath",
      text: `Yes. We install The Onyx Collection shower panels, bases, and accessories, and Onyx is a preferred material. We also install other quality solid-surface options, so we can fit your style. Screens don't do the colors justice. Your consultant will bring samples when they measure. ${BATH_NEXT}`,
    };
  }

  if (/flooret|vinyl plank|waterproof plank/.test(text)) {
    return {
      topic: "bath",
      text: `We work with Flooret for wood-look waterproof plank next to the bath. Laminate is only water-resistant, so I wouldn't treat that the same way. The shower itself still gets a proper wet-area floor, usually tile. ${BATH_NEXT}`,
    };
  }

  if (/wallism|wallpaper|mural/.test(text)) {
    return {
      topic: "bath",
      text: `Yes, on a dry, well-ventilated wall, such as behind a tub or vanity. We work with Wallism for that. We keep paper out of the shower and out of the splash zone by a sink. ${BATH_NEXT}`,
    };
  }

  if (/frameless|shower glass/.test(text)) {
    return {
      topic: "bath",
      text: `Yes. Frameless clear glass is a look we use a lot. It makes a shower feel more open. It is safety glass, and the thickness depends on the panel. Squeegee after you shower, or hard water will show. ${BATH_NEXT}`,
    };
  }

  if (/waterproof/.test(text)) {
    return {
      topic: "bath",
      text: `A tiled shower needs a waterproof assembly under the tile, and the floor has to slope to the drain. That matters as much as the tile you see. Your consultant will go over the assembly for your shower when they measure. ${BATH_NEXT}`,
    };
  }

  if (/curbless|no-step|barrier-free|step-free/.test(text)) {
    return {
      topic: "bath",
      text: `When the floor height and the drain allow it, yes. Your consultant checks that when they measure. ${BATH_NEXT}`,
    };
  }

  if (/\bpenny\b/.test(text)) {
    return {
      id: "penny",
      topic: "bath",
      text: `Penny tile is the little round mosaic, about the size of a penny, set on mesh sheets. It looks great on a shower floor, where the grout joints give wet feet more grip, and it can cover a whole wall or a short accent if you want that vintage dotted look. Grout does a lot of the work: a darker color hides soap film and makes each circle pop, and a color close to the tile reads softer. Slope the floor to the drain so water doesn't sit in those joints. We use Mapei grout, and {{owner}} does custom tile. You can pick penny tile for the floor or the wall in Design My Bathroom. Are you thinking penny tile for the shower floor or a whole wall?`,
    };
  }

  if (/\bherringbone\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Herringbone is a zigzag of rectangular tiles, each one meeting the next at a right angle. It looks beautiful on a shower wall and as a floor, and it reads more detailed than a big straight tile. {{owner}} does custom tile, including herringbone, chevron, and arabesque. Do you want that zigzag on the floor or on the wall?`,
    };
  }

  if (/\bchevron\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Chevron is the continuous V, with the tile ends cut so the points meet. It feels a little sharper and more modern than herringbone, which is a broken zigzag. Both work on a shower wall or a floor, and {{owner}} does that custom tile. Are you picturing chevron on the wall or underfoot?`,
    };
  }

  if (/\barabesque\b|\bdiamond mosaic\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Arabesque is the curved lantern shape, often with a small diamond at the joints. It is a classic marble-mosaic look for a floor or a feature wall, and it pairs well with a calmer field tile. {{owner}} does custom tile, and Design My Bathroom has arabesque as a floor and a wall choice. Do you want it underfoot or as the accent wall?`,
    };
  }

  if (/\b(hexagon|hex tile|hex mosaic)\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Hex is the six-sided mosaic. It is a classic shower floor, and a black or light hex also works as a lower-wall accent. The grout joints add grip under wet feet. {{owner}} does custom tile, and hex is one of the floor choices in Design My Bathroom. Are you thinking hex for the floor or the wall?`,
    };
  }

  if (/\blarge[- ]format\b|\bbig tile\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Large-format tile has fewer grout lines, so a shower wall or a dry floor reads calmer and a little bigger. On a shower floor I still want enough texture for wet feet, so a big polished slab is better on the wall than underfoot. {{owner}} does custom tile, and large porcelain is one of the floor choices in Design My Bathroom. Are you using the big tile on the walls or the floor?`,
    };
  }

  if (/\bgeometric\b/.test(text)) {
    return {
      id: "geometric",
      topic: "bath",
      text: `Geometric tile is the patterned side of the catalog: herringbone, chevron, and arabesque or diamond mosaics, plus hex. Herringbone is a broken zigzag, chevron is a continuous V, and arabesque is the curved lantern. {{owner}} does custom tile, and Design My Bathroom has each of those for the floor and for a wall or accent. Which of those shapes are you drawn to?`,
    };
  }

  return null;
}

export const PRODUCT_PRICE_RULE = `Starting at $5K is for bathroom remodels only. ${WINDOW_PRICE_LINE} Never use the bathroom starting price in a window answer.`;
