# Design System Document: The Sacred Manuscript

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Manuscript."** 

This system is not merely a collection of components; it is an exercise in digital calligraphy and scholarly serenity. We are moving away from the "app-like" density of modern interfaces toward an editorial experience that feels hand-scribed, ancient, and profoundly intentional. 

The aesthetic breaks the standard "grid-block" template by utilizing **intentional asymmetry** and **expansive white space** (the "Breath of the Divine"). By leveraging sharp 0px corners and majestic typography, we evoke the precision of a reed pen on parchment. The layout is RTL-first, honoring the flow of the Arabic script and ensuring the digital canvas feels like an unfolding scroll rather than a rigid screen.

---

## 2. Colors: Light and Ink
The palette is rooted in the contrast between **Ivory (#FDFBF7)** and **Deep Charcoal (#1C1F26)**, bridged by the warmth of **Antique Gold (#C5A059)**.

### Surface Hierarchy & Nesting
We reject the use of traditional shadows. Depth is achieved through **Tonal Layering**:
*   **Base Layer:** `surface` (#FBF9F5) serves as our primary parchment.
*   **Secondary Context:** Use `surface-container-low` (#F5F3EF) for subtle content grouping.
*   **Emphasis Layers:** Use `surface-container-highest` (#E4E2DE) for floating elements that require the eye's immediate attention.

### The "No-Line" & "Ghost Border" Rule
*   **No-Line Rule:** Do not use 1px solid charcoal borders to section content. Boundaries are defined by the shift between `surface` and `surface-container` tiers.
*   **Ghost Borders:** When a container requires structural definition (e.g., a featured quote or card), use `outline-variant` at 20% opacity. This creates a "Ghost Gold" frame that feels etched rather than printed.

### Signature "Noor" Gradients
To simulate divine light, apply soft radial gradients. Use a transition from `primary-container` (#C5A059) at 10% opacity to a transparent center. This "glow" should be placed behind key headers or in the corners of empty states to give the UI a "soul" and a sense of depth that flat color cannot provide.

---

## 3. Typography: The Majestic Script
Typography is the cornerstone of this system. We treat text as art.

*   **Arabic (Primary):** **Amiri** is mandatory for all Arabic text. It must be rendered with generous line-height (1.8+) to allow the diacritics to breathe.
*   **Latin (Secondary):** **Newsreader** for displays/headlines and **Noto Serif** for body text.

### The Scale
*   **Display-LG (3.5rem):** Reserved for core spiritual themes or section starts. These should be centered and majestic.
*   **Headline-MD (1.75rem):** Used for scholarly sub-titles.
*   **Body-LG (1rem):** High-readability serif text for long-form reflection.
*   **Label-MD (0.75rem):** Used sparingly for metadata, set in `on-surface-variant` with increased letter-spacing.

---

## 4. Elevation & Depth: Atmospheric Weight
We achieve hierarchy without the "heavy" feeling of standard UI.

*   **The Layering Principle:** Stack `surface-container-lowest` (#FFFFFF) components on top of `surface-container` backgrounds to create a soft, natural lift.
*   **Ambient Shadows:** If a floating element (like a modal) is required, use a shadow with a 40px blur at 4% opacity, tinted with `primary` (#775A19) to mimic the way gold reflects light onto paper.
*   **Glassmorphism:** For top navigation bars, use `surface` at 80% opacity with a `backdrop-blur(12px)`. This keeps the "Manuscript" continuous as the user scrolls, maintaining a sense of transparency and light.

---

## 5. Components: Precision and Grace

### Buttons (Calligraphic Actions)
*   **Corner Radius:** Strict **0px**. Every button is a sharp, precise rectangle.
*   **Primary:** `primary` background with `on-primary` text. Use a 1px `border-gold/20` inner stroke.
*   **Tertiary:** No background. Use a `title-sm` font weight with an underline that only appears on hover, mimicking a scholar’s annotation.

### Cards & Lists
*   **The No-Divider Rule:** Explicitly forbid horizontal divider lines. 
*   **Separation:** Use the Spacing Scale (e.g., `8` / 2.75rem) to separate list items. The "white space" is the separator.
*   **Grouping:** If a group of items must be contained, use a `surface-container-low` background with a `Ghost Border`.

### Input Fields
*   **Styling:** Only a bottom border (1px) using `outline-variant`. Labels should be `label-md` and placed above the field in `on-surface-variant`.
*   **Focus State:** Transition the bottom border to `primary` (Gold) and introduce a subtle "Noor" radial glow beneath the input.

### Signature Component: The "Ayat" Block
A specialized container for sacred text. It uses a `surface-container-lowest` background, 0px radius, and a 2px `primary` border on the *right* side only (to accommodate RTL flow). 

---

## 6. Do's and Don'ts

### Do:
*   **Embrace RTL Asymmetry:** It is okay for the right margin to be slightly wider than the left to mimic historical manuscript binding.
*   **Use Large Leading:** Give every line of text room to be contemplated. 
*   **Respect the "Noor":** Use gradients sparingly; they should feel like a faint morning glow, not a vibrant neon light.

### Don't:
*   **No Rounded Corners:** Never use `border-radius`. This design system is built on the sharpness of the pen and the edge of the page.
*   **No High-Contrast Dividers:** Avoid black lines or heavy strokes. They break the serenity of the Ivory background.
*   **No Motion Overload:** Interactions should be slow and fading (300ms+), never "snappy" or "bouncy." We are designing for reflection, not speed.

### Accessibility Note:
While we use soft gold accents, ensure all text in `primary` or `on-surface` meets a 4.5:1 contrast ratio against the `surface` or `surface-container` tiers. Readability is an act of service to the user.