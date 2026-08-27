# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Dunkler Neo-Arcade-Look: fast schwarzer Hintergrund mit warmem Amber-Akzent, Cyan als Spielerfarbe und hohem HUD-Kontrast — fokussiert, retro-inspiriert, aber ruhig und mobiltauglich.

## Colors

- `--color-bg`: **#0F0F14**
- `--color-surface`: **#1A1A22**
- `--color-surface_raised`: **#23232E**
- `--color-fg`: **#F5F1E8**
- `--color-muted`: **#9A97A3**
- `--color-border`: **#2E2E3A**
- `--color-accent`: **#FFB454**
- `--color-accent_hover`: **#FFC97A**
- `--color-accent_active`: **#E09A3D**
- `--color-danger`: **#FF5C5C**
- `--color-success`: **#6BE585**
- `--color-info`: **#4DD0E1**
- `--color-player`: **#4DD0E1**
- `--color-player_dark`: **#2A9BA8**
- `--color-player_light`: **#A8F0F8**
- `--color-enemy`: **#FF5C8A**
- `--color-enemy_dark`: **#C43D66**
- `--color-enemy_light`: **#FFA6C0**
- `--color-item`: **#FFD166**
- `--color-item_dark`: **#D9A93A**
- `--color-item_light`: **#FFE9A8**
- `--color-tile`: **#22222E**
- `--color-tile_alt`: **#1A1A24**
- `--color-outline`: **#0B0B10**

## Typography

- `font_family`: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `font_mono`: 'JetBrains Mono', 'SFMono-Regular', 'Roboto Mono', Menlo, Consolas, monospace
- `heading_weight`: 700
- `body_weight`: 400
- `size_scale`: caption 12px, body 16px, title 20px, display 32px, score 40px

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 20px
- `--radius-pill`: 999px

## Components

### Button

padding 14px 24px, radius pill, min-height 48px (Touch-Target >=44px), bg=accent #FFB454, text=bg #0F0F14 fett 16px, hover=#FFC97A, active=#E09A3D + translateY(1px), disabled=opacity 0.45, focus-visible outline 2px #4DD0E1 offset 2px.

### SecondaryButton

padding 14px 24px, radius pill, min-height 48px, bg=surface_raised #23232E, border 1px #2E2E3A, text=fg #F5F1E8, hover=border #4DD0E1 + text #4DD0E1, active=bg #1A1A22, disabled=opacity 0.45.

### Card

bg=surface #1A1A22, radius lg 20px, border 1px #2E2E3A, padding 24px, Schatten 0 8px 24px rgba(0,0,0,0.35).

### ConfirmDialog

Overlay bg rgba(15,15,20,0.72), zentriert; Dialog max-width 400px, bg=surface #1A1A22, radius lg 20px, padding 24px, Titel title 20px bold, Text body 16px muted, Aktionen rechtsbuendig: Abbrechen=SecondaryButton, Bestaetigen=Button mit bg=danger #FF5C5C, min-height 48px.

### SettingsRow

padding 16px, min-height 48px, border-bottom 1px #2E2E3A, Label fg 16px links, Aktion/Steuerung rechts, aktiver Zustand bg=surface_raised, gedrueckt bg=#1A1A22.

### Badge

bg=accent #FFB454, text=bg #0F0F14, radius pill, padding 6px 12px, uppercase, letter-spacing 0.08em, bold 12px — z.B. 'Neuer Bestwert'.

### ScoreDisplay

Label muted 12px uppercase letter-spacing 0.1em, Wert font_mono score 40px fg #F5F1E8, Highscore-Wert font_mono 24px accent #FFB454, Zeilenhöhe 1.1.

### DailyChallengeEntry

Startbildschirm-Eintrag: Card-artig bg=surface #1A1A22, radius lg 20px, border 1px #2E2E3A, padding 16px, min-height 56px, gesamte Flaeche tap-faehig. Inhalt als Zeile: links Label 'Tages-Challenge' title 20px bold fg #F5F1E8, darunter heutiges Datum (lokal, Format YYYY-MM-DD) font_mono 16px accent #FFB454; rechts Chevron/Pfeil muted #9A97A3 20px. hover=border accent #FFB454, active=bg surface_raised #23232E + translateY(1px), focus-visible outline 2px #4DD0E1 offset 2px. Datum und Bestwert ausschliesslich als Klartext rendern.

### ChallengeBadge

bg=surface_raised #23232E, border 1px #4DD0E1, text=info #4DD0E1, radius pill, padding 6px 12px, uppercase, letter-spacing 0.08em, bold 12px — Text 'Tages-Challenge'. Bewusst von Badge (accent) unterschieden.

### DailyBestDisplay

Label 'HEUTE' muted #9A97A3 12px uppercase letter-spacing 0.1em, Wert font_mono 24px accent #FFB454, Zeilenhöhe 1.1. Wert ausschliesslich als Klartext rendern.

### DailyChallengeResult

Game-Over-Block innerhalb der Card, oberhalb der Buttons: border-top 1px #2E2E3A, padding-top 16px, margin-top 8px. Enthaelt ChallengeBadge 'Tages-Challenge' und darunter DailyBestDisplay mit heutigem Bestwert. Nur im Tages-Challenge-Modus rendern.

### SettingsValue

Rechtsbuendiger Wert innerhalb einer SettingsRow: font_mono 16px, Textfarbe fg #F5F1E8, numerische Bestwerte in accent #FFB454, min-height 48px, vertikal zentriert, max. 1 Zeile ohne Umbruch. Wert ausschliesslich als Klartext rendern.

### HighscoreResetRow

SettingsRow mit destruktivem Akzent: Label 'Bestwert zuruecksetzen' in danger #FF5C5C, 16px, links; rechts Chevron/Pfeil muted #9A97A3 20px; min-height 48px, padding 16px, border-bottom 1px #2E2E3A; hover=bg surface_raised #23232E, active=bg #1A1A22. Oeffnet ConfirmDialog mit Bestaetigen-Button bg=danger #FF5C5C.

### Sprite/Art Direction

Player: 48x48px, klare Kapsel/Figur, 3 Toene player #4DD0E1 / player_dark #2A9BA8 / player_light #A8F0F8, 2px outline #0B0B10, weisses Auge 2x2px. Enemy: 48x48px, kantige Dornenform, 3 Toene enemy #FF5C8A / enemy_dark #C43D66 / enemy_light #FFA6C0, 2px outline #0B0B10, dunkler Schlitz als Auge. Item: 32x32px, Raute/Stern, 3 Toene item #FFD166 / item_dark #D9A93A / item_light #FFE9A8, 2px outline #0B0B10, heller Glanzpunkt. Tiles: 48x48px, flach mit subtiler 1px-Innenkante, tile #22222E und tile_alt #1A1A24 abwechselnd. Alle Entities als echte einfache Pixel-Arts mit mindestens 3 Toenen + Outline, keine einfarbigen Rechtecke als Platzhalter.

### HUD Spec

Oben fixiert, padding 16px; links 'SCORE' mit ScoreDisplay, rechts 'BEST' mit ScoreDisplay; halbtransparenter Balken bg rgba(26,26,34,0.78), border 1px #2E2E3A, radius md 12px, backdrop-blur 8px; Ziffern font_mono, Mindesthoehe der Trefferflaeche 44px; Kontrast immer ueber dunklem Balken, nie direkt auf Spielflaeche.

### Screen Layouts

Startbildschirm: zentrierte Spalte, max-width 420px, Titel display 32px bold, Highscore als Badge/ScoreDisplay mittig, DailyChallengeEntry unter dem Highscore, Charakterwahl als horizontale Reihe von 48px-Karten, Primary-Button 'Spielen' unten, Seitenabstand 24px. Game-Over: zentrierte Card, Score gross, 'Neuer Bestwert'-Badge nur bei Rekord, DailyChallengeResult nur im Tages-Challenge-Modus, Buttons 'Nochmal' (primary) und 'Menue' (secondary) untereinander. Einstellungen: Liste mit SettingsRow-Eintraegen, 'Bestwert zuruecksetzen' mit danger-Akzent, ConfirmDialog mittig als Overlay. Alle Screens bg=#0F0F14, max-width 560px zentriert, Scrollbereich padding 16px.

### Readability Rules

Player/Cyan und Item/Gelb ausschliesslich auf dunklen Tiles #22222E/#1A1A24 verwenden, nie auf Cyan- oder Gelbflaechen. Feinde/Rot nie mit Item/Gelb kombinieren. Hintergrund gedaempft, Vordergrund-Entities hoch gesaettigt; Text nur in fg #F5F1E8 oder accent #FFB454 auf dunklen Flaechen, Mindestkontrast 4.5:1; HUD immer auf halbtransparentem dunklem Balken. Gespeicherte Bestwerte ausschliesslich als Klartext rendern.

## Layout Principles

- Container max-width 560px zentriert, Seitenabstand 16px (mobile) bzw. 24px ab Tablet.
- Breakpoints: <600px einspaltig mobil, 600–1024px Tablet (max 560px Spielfläche zentriert), >1024px Desktop mit gleicher zentrierter Spielfläche, kein gestrecktes Layout.
- Vertikaler Abstand zwischen Sektionen 24px, zwischen kompakten UI-Elementen 12–16px.
- Flex-Spalten für Screens, Zeilen für HUD und Settings; Buttons nie schmaler als 44px Höhe.
- Score-/Bestwerte immer monospace rendern, um springende Ziffernbreiten zu vermeiden.
