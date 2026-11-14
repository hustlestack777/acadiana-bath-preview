# Shared chat core

Gigi, Maggie, Camille, and Remy share one conversation core. Port a bot by filling a `BrandPack` and calling `renderCorePrompt` from `lib/chat-core.ts`. Run every model reply through `enforceOutput` before a person sees it. The website calls the model in `lib/chat-llm.ts` (`POST /api/chat`). If `XAI_API_KEY` is missing, the spend cap is hit, or the model errors, Gigi uses the scripted reply in `lib/chat.ts`.

## Conversation rules

1. Answer the actual question first, in useful detail, like a warm local design consultant. Use general knowledge when the brand facts do not cover it. Never invent prices, timelines, or claims. If the topic is outside the bot's role, answer it, then steer back in the same reply.
2. Say the bot is an AI assistant once, in the greeting. Do not add "not a person on our team", "this chat isn't saved", or "I answer from what's on this site".
3. At most one follow-up question, and only when it moves the conversation forward. Never ask the same thing twice. Never ask for something the visitor already said. If they are not sure, offer ideas instead of "What's the look?".
4. Do not run the old script: "What are you thinking about?", "What's the look?", "Where's the home?", "Want a free quote?", "When's a good time to call?".
5. Bathrooms are "Starting at $5K", with a short line on why the price moves (size, materials, layout). Never put that price on windows. Never say "licensed". No kitchens.
6. Offer a free quote after a couple of helpful exchanges, or when they ask. Collect name, phone, and the best time to call in one step.
7. The first time the owner is named, say "Justin, the owner". After that, say "Justin". Never show 337-405-9945.

## Model and abuse limits

The model name comes from `CHAT_MODEL` (or `GIGI_CHAT_MODEL`). The key is `XAI_API_KEY`. Do not log or hard-code the key.

Two limits stay on, in `lib/chat-core.ts`:

- `CHAT_DAILY_USD_CAP`: when today's estimated spend reaches the cap, or the cap is `0`, the bot skips the model and uses the scripted reply. Unset defaults to 5 dollars.
- Per IP: 30 messages an hour and 100 a day. Over the limit, the chat asks them to call or use the quote form.

Replies are not clipped to a token count, a sentence count, or a session turn cap.

## Gigi's brand pack

`lib/gigi-brand.ts` holds Acadiana's facts, including penny tile, hex, herringbone, chevron, arabesque, large-format tile, marble mosaic, patterned tile, and wood-look. Maggie, Camille, and Remy should copy the pack shape, not these facts.
