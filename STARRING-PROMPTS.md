# "Starring You" — AI image prompts

Paste these into your image service (Midjourney, DALL·E, Stable Diffusion,
Leonardo, etc.). If the tool supports a **reference image / face input**, attach
your headshot (`public/headshot-formal.png`) so it keeps your likeness.

**Likeness to preserve:** a man in his late 20s with long, wavy auburn/red hair
past the shoulders and a full ginger-red beard.

**How to use the output**
1. Save each image into `public/starring/source/` named by its slug (see below).
2. Best results: a **portrait** image (~1024×1536) for the poster. Optionally add
   a **landscape** (~1600×900) named `<slug>-wide.png` for the hero/backdrop.
3. Run `node scripts/generate-starring.mjs`, then hard-refresh the app.

> Tip: append your service's quality tags, e.g. `cinematic film still, 35mm,
> dramatic lighting, highly detailed, 2:3 portrait`. Add a negative prompt like
> `text, watermark, extra fingers, deformed` where supported.

---

### redbeard — *Redbeard* (Action / Adventure)
> Cinematic film still of a rugged seafaring outlaw with long auburn hair and a
> full red beard, weathered leather coat, standing on the deck of a storm-tossed
> ship at dusk, teal-and-orange color grade, dramatic rim light, sea spray,
> epic blockbuster mood. Portrait, head-and-chest framing.

### genesis-protocol — *Genesis Protocol* (Sci-Fi / Thriller)
> Cinematic sci-fi still of a man with long auburn hair and red beard inside a
> dark futuristic lab, glowing cyan holographic interfaces reflecting on his
> face, sleek tech jacket, cool blue-teal lighting, tense and mysterious.
> Portrait framing.

### the-long-game — *The Long Game* (Crime / Noir)
> Film-noir portrait of a man with long auburn hair and red beard in a dim
> smoky room, sharp dark suit, single hard key light, deep shadows, high
> contrast black-and-white with a faint warm tint, brooding and dangerous.

### static — *Static* (Horror)
> Unsettling horror still of a man with long auburn hair and red beard in a
> pitch-black room lit only by the flickering grey glow of an old TV showing
> static, sickly green tint, film grain, glitch artifacts, eerie and tense.

### beard-necessities — *Beard Necessities* (Comedy)
> Bright, playful comedy portrait of a man with long auburn hair and a red beard
> in a stylish barbershop, holding clippers with a confident goofy grin, bold
> saturated pop colors, cheerful even lighting, sitcom poster energy.

### ironwood — *Ironwood* (Drama)
> Moody prestige-drama portrait of a man with long auburn hair and red beard in
> a dim woodworking workshop, sawdust in warm light, rolled sleeves, thoughtful
> and weathered expression, soft warm monochrome, intimate and serious.

### dust-and-ash — *Dust & Ash* (Western)
> Western film still of a lone drifter with long auburn hair and red beard on a
> dusty frontier main street at golden hour, worn duster coat and hat, sepia /
> amber tones, blowing dust, sun-baked and stoic. Portrait framing.

### closer — *Closer* (Romance)
> Warm romantic portrait of a man with long auburn hair and red beard on a city
> street at night, soft glowing bokeh of streetlights behind him, gentle smile,
> dreamy pink-and-amber lighting, tender and cinematic, shallow depth of field.

### the-ember-crown — *The Ember Crown* (Fantasy)
> Epic fantasy still of a blacksmith hero with long auburn hair and red beard at
> a blazing forge, glowing embers and sparks swirling around him, leather armor,
> dramatic purple-and-orange firelight, heroic and mythic. Portrait framing.

### the-last-commit — *The Last Commit* (Thriller)
> Tech-thriller still of a developer with long auburn hair and red beard in a
> dark room lit by multiple monitors full of glowing green-and-teal code, hoodie,
> intense focused stare, cool cyan lighting, paranoid late-night mood.
