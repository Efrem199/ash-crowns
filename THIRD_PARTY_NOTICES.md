# Third-party media / Авторы материалов

This repository contains third-party media under their own licenses. **The MIT license for the Ash Crowns code does not relicense the media.** Each entry in `assets/manifest.json` records its author, source, original file, processing and SHA-256 checksum. Selected unmodified originals are retained in `asset-sources/`; original archive downloads and unused libraries are not included.

## Painted portraits — Justin Nichol / FLARE

- Source: [FLARE Portrait Pack](https://opengameart.org/content/flare-portrait-pack-number-one), [FLARE game art](https://github.com/flareteam/flare-game/tree/master/mods/fantasycore/images/portraits).
- Author: **Justin Nichol**. FLARE per-file credit: [Credits](https://github.com/flareteam/flare-game/wiki/Credits), preserved in `licenses/FLARE-CREDITS.md`.
- License: **Creative Commons Attribution-ShareAlike 3.0 Unported**, `licenses/CC-BY-SA-3.0.txt`.
- Selected originals: `female03.png` (Avelin), `male03.png` (Rowan), `female11.png` (Mira), `male02.png` (Khar), `female04.png` (Seren), `female09.png` (Dara), `male20.png` (Orian).
- Processing: proportion-preserving resize / transparent padding and WebP encoding. These processed portrait files remain under **CC-BY-SA-3.0**. The displayed Ash Crowns character names and biographies are original game content, not the original artists' character identities.

## Dwarf portrait and painted item icons — Ravenmore

- Sources: [Fantasy Portrait Pack](https://opengameart.org/content/fantasy-portrait-pack-by-ravenmore), [Fantasy Icon Pack](https://opengameart.org/content/fantasy-icon-pack-by-ravenmore-0).
- Author: **Ravenmore** — [ravenmore.itch.io](https://ravenmore.itch.io/), [dycha.net](http://dycha.net).
- License: **Creative Commons Attribution 3.0 Unported**, `licenses/CC-BY-3.0.txt`.
- `dwarf_m_256.png` is used for Borin. Selected transparent item images illustrate research, relics, units and building specializations.
- Processing: resize and WebP conversion. Some item images are placed as separate specialization emblems on building illustrations; their attribution and license remain recorded in the manifest's `derivedFrom` entries.

## Medieval building illustrations — feudalwars

- Author: **feudalwars**, [Feudal Wars](http://www.feudalwars.net).
- License: **CC0 1.0 Universal**, `licenses/CC0-1.0.txt`.
- Individually verified sources:
  - [Archery range](https://opengameart.org/content/medieval-archery-range-isometric-25d)
  - [Barracks](https://opengameart.org/content/medieval-barracks-isometric-25d)
  - [Blacksmith](https://opengameart.org/content/medieval-blacksmith-isometric-25d)
  - [Stable](https://opengameart.org/content/medieval-stable-isometric-25d)
  - [Stone guard tower](https://opengameart.org/content/medieval-stone-guard-tower-isometric-25d)
  - [Wooden guard tower](https://opengameart.org/content/medieval-wooden-guard-tower-isometric-25d)
  - [Western-European castle](https://opengameart.org/content/western-european-castle-isometric-25d)
  - [Western-European houses](https://opengameart.org/content/western-european-medieval-houses-isometric-25d)
- Processing: proportion-preserving resize and transparent composition with a resource/tool emblem, then WebP conversion. Sixteen game buildings use these eight structural artworks with distinct specialization details. Composite images also contain CC-BY-3.0 emblems credited separately below; do not treat the entire composite as CC0-only.

## Vector illustrations — Game-icons.net

- Sources: [Game-icons.net](https://game-icons.net/about.html), [original SVG repository](https://github.com/game-icons/icons).
- Authors: **Delapouite** (gold mine, mine wagon, observatory, cavalry, trebuchet, archer, wizard face), **Lorc** (wheat, crown, compass, sundial, quill, anvil).
- License: **Creative Commons Attribution 3.0 Unported**, `licenses/CC-BY-3.0.txt`.
- Processing: removed the opaque square background and changed foreground color to the game's gold. Original SVG path geometry is retained. Exact source pages and original SVGs are listed per file in the manifest.

## Painted chapter environments — JAP

- Source: [Oil Painting Landscapes](https://opengameart.org/content/oil-painting-landscapes).
- Author: **JAP**.
- License: **CC0 1.0 Universal**, `licenses/CC0-1.0.txt`.
- Images: `sunsetintheswamp.png`, `coldmountain.png`, `cloudsinthedesert.png`, `wizardtower.png`.
- Processing: landscape crop for the game's fixed region panels and WebP encoding. Original images are preserved separately.

## Interface borders and sound effects — Kenney

- Author: **Kenney** — [kenney.nl](https://kenney.nl/).
- Sources: [Fantasy UI Borders](https://kenney.nl/assets/fantasy-ui-borders), [Interface Sounds](https://kenney.nl/assets/interface-sounds), [RPG Audio](https://kenney.nl/assets/rpg-audio).
- License: **CC0 1.0 Universal**. Package notices are retained as `licenses/Kenney-Fantasy-UI.txt`, `licenses/Kenney-Interface-Sounds.txt`, `licenses/Kenney-RPG-Audio.txt`.
- Processing: selected border/panel textures encoded as WebP; eighteen selected OGG effects encoded as mono MP3 at 96 kbps, normalized to -23 LUFS with a -3 dB true-peak target. Original OGG effects are preserved.

## Music

All four selected tracks are published by their authors under **CC0 1.0 Universal**:

| In-game use | Original work | Author | Source |
| --- | --- | --- | --- |
| Settlement | Homestead | troubadour | [Fantasy Song Pack Volume 1](https://opengameart.org/content/fantasy-song-pack-volume-1) |
| Campaign | Fantasy — Grasslands | Doge | [Fantasy Grasslands](https://opengameart.org/content/fantasy-grasslands) |
| Boss frontier | Fantasy — Battlegrounds | Doge | [Fantasy Battlegrounds](https://opengameart.org/content/fantasy-battlegrounds) |
| Legacy / archives | Fantasy Orchestral Theme | Joth | [Fantasy Orchestral Theme](https://opengameart.org/content/fantasy-orchestral-theme) |

Processing: stereo MP3 at 128 kbps / 44.1 kHz, normalized to -20 LUFS with a -2 dB true-peak target. Musical arrangements are unchanged. Original MP3s are retained in `asset-sources/audio/`. Music does not preload or start until the player explicitly enables it.

## License copies and attribution in the game

The game's settings include an authors and licenses screen. Please preserve this notice, per-file metadata and the license copies when redistributing the project or its media. The original source URLs are also collected in `asset-sources/SOURCES.json`.
