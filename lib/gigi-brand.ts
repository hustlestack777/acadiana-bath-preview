import { PRODUCT_PRICE_RULE } from "./gigi-product";
import { WINDOW_PRICE_LINE } from "./windows";
import type { BrandPack } from "./chat-core";

/** Acadiana Bathrooms brand pack. Other bots copy this shape, not these facts. */
export const gigiBrand: BrandPack = {
  id: "gigi",
  assistantName: "Gigi",
  businessName: "Acadiana Bathrooms",
  role: "bathroom design advice and getting a free quote (windows get an estimate, not a bathroom price)",
  ownerFirst: "Justin, the owner",
  ownerShort: "Justin",
  priceVaries: "the size of the room, the materials, and how much of the layout changes",
  bathroomPrice: "Starting at $5K",
  windowPriceLine: WINDOW_PRICE_LINE,
  priceRules: PRODUCT_PRICE_RULE,
  steerBack: "I'm here for the bathroom design, and a free quote is easy when you want one.",
  onTopic:
    /\b(bath|shower|tub|tile|grout|window|quote|price|cost|ballpark|onyx|zellige|marble|quartz|quartzite|vanity|counter|design|penny|hex|herringbone|chevron|arabesque|geometric|floor|wall|niche|glass|granite|mapei|pella|flooret|wallism|riad|lafayette|kitchen|remodel|estimate|look|material|warranty|clean)\b/i,
  steered: /\b(bathroom|shower|tile|window|quote|design|remodel)\b/i,
  knowledge: [
    "Bathrooms and window estimates only. No kitchens. No granite.",
    "Floors in Design My Bathroom: penny tile (round mosaic), hex, herringbone, chevron, arabesque, large porcelain, marble mosaic, patterned, wood-look. Walls and accents include those geometric looks plus zellige and solid surface.",
    "Penny tile grips a shower floor and can cover a wall. Grout color matters. Mapei grout. Custom tile.",
    "Herringbone is a broken zigzag. Chevron is a continuous V. Arabesque is a lantern mosaic. Hex is six-sided. Large tile means fewer grout lines.",
    "We install The Onyx Collection. Onyx is a preferred solid surface. Phone (337) 522-0023.",
    WINDOW_PRICE_LINE,
  ].join(" "),
};
