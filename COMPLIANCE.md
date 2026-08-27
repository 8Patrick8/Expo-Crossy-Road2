VERDICT: CHANGES_REQUESTED

Der Sprint-Fix für den Tages-Seed ist im aktuellen Stand funktional noch nicht vollständig umgesetzt. Daneben bestehen vor allem Pflichttext-, Accessibility- und CRA/SBOM-Lücken, die vor einem Marktstart zu beheben sind. Ein fundamentaler DSGVO-Verstoß durch rechtsgrundlose Verarbeitung personenbezogener Daten oder durch offengelegte PII im Klartext ist derzeit nicht sichtbar.

---

## 1. DSGVO / Datenschutz

### 1.1 Fehlende bzw. erreichbare Datenschutzerklärung
- **Schwere:** mittel
- **Befund:** In `src/screens/GameOverScreen.tsx` wird im `banner`-Array ein `Alert` angezeigt, der auf `https://github.com/EvanBacon/Expo-Crossy-Road/privacy.md` verweist. Diese Datei ist im Repository nicht vorhanden. Die App hat keine sichtbare, erreichbare Datenschutzerklärung, die Art. 13 DSGVO genügen würde. Aktuell verarbeitet die App nach Code-Lage keine personenbezogenen Daten auf einem Server, aber der Verweis ist intransparent und unbrauchbar.
- **Remedium:** `privacy.md` im Repository bereitstellen oder besser eine Datenschutzseite direkt in der App implementieren, z. B. `src/screens/Legal/PrivacyPolicy.tsx`, erreichbar über `SettingsScreen.tsx`. Inhalt: Verantwortlicher, verarbeitete Daten (nur lokale Spielstände), Zweck, Rechtsgrundlage, Speicherdauer, Betroffenenrechte, Kontakt. Den Alert-Verweis in `GameOverScreen.tsx` auf die neue interne Seite oder eine gültige externe URL umstellen.

### 1.2 Fehlende Löschmöglichkeit für gespeicherte lokale Spielstände
- **Schwere:** niedrig
- **Befund:** `GameProvider.tsx` speichert `CHARACTER_STORAGE_KEY`, `HIGHSCORE_STORAGE_KEY` und `DAILY_BEST_STORAGE_KEY` dauerhaft in `AsyncStorage`. Es gibt nur `resetHighscore()`, aber keine Löschmöglichkeit für `character` und `dailyBest`.
- **Remedium:** In `src/context/GameProvider.tsx` eine Funktion `resetAllData()` ergänzen, die `AsyncStorage.multiRemove([CHARACTER_STORAGE_KEY, HIGHSCORE_STORAGE_KEY, DAILY_BEST_STORAGE_KEY])` aufruft, und in `SettingsScreen.tsx` einen sichtbaren Button „Alle gespeicherten Daten löschen“ einbauen.

### 1.3 Kein PII-Logging sichtbar
- **Schwere:** niedrig (Hinweis)
- **Befund:** `console.warn`, `console.log` und `console.time` in `AudioManager.ts`, `ModelLoader.ts` und `GameProvider.tsx` protokollieren keine offensichtlichen personenbezogenen Daten. Die Fehlerbehandlung zeigt jedoch in `src/app/_layout.tsx` den vollständigen Fehlerstack an (siehe CRA).
- **Remedium:** Logs in Produktion entfernen bzw. neutralisieren; Fehlertexte nicht mit PII anreichern.

---

## 2. EU Cyber Resilience Act / Security

### 2.1 Stacktrace-Offenlegung im Fehlerbildschirm
- **Schwere:** hoch
- **Befund:** `src/app/_layout.tsx` rendert in der `ErrorScreen`-Komponente `{stack && <Text …>{stack}</Text>}`. Damit werden interne Fehlerdetails und Pfade an Endnutzer ausgegeben – ein Verstoß gegen Security-by-Design/Default und ein Informationsleck.
- **Remedium:** Den Stack nur unter Entwicklungsbedingung anzeigen, z. B. `{__DEV__ && stack ? <Text …>{stack}</Text> : null}`. In Produktion eine generische Meldung wie „Es ist ein Fehler aufgetreten. Bitte starte die App neu.“ anzeigen.

### 2.2 Kein SBOM, unklare Lizenzmetadaten, alte GSAP-Version
- **Schwere:** mittel
- **Befund:** `package.json` enthält kein `license`-Feld („project license: unspecified“), obwohl eine `LICENSE`-Datei existiert. `gsap` wird in Version `^2.0.2` verwendet, deren Lizenz- und Kompatibilitätslage für kommerzielle Nutzung geprüft werden muss. Ein SBOM (CycloneDX/SPDX) ist nicht sichtbar.
- **Remedium:** In `package.json` `"license": "MIT"` (oder die tatsächliche Lizenz) ergänzen. GSAP-Lizenz prüfen und ggf. auf eine aktuelle, klar lizenzierte Version aktualisieren. SBOM generieren, z. B. mit `@cyclonedx/cyclonedx-npm`, als `sbom.json` in Repository und Release-Artefakt aufnehmen.

### 2.3 Update-Fähigkeit vorhanden, Prozess undokumentiert
- **Schwere:** mittel
- **Befund:** `expo-updates` ist als Dependency vorhanden; `.eas/workflows/deploy.yml`, `eas.json` und `app.json` sind vorhanden. Ein dokumentierter Patch-/Security-Update-Prozess ist im sichtbaren Code/Repomaterial nicht erkennbar.
- **Remedium:** In `README.md` oder `AGENTS.md` Abschnitt „Updates & Sicherheits-Patches“ ergänzen: Verteilung über `expo-updates`, Rollback-Verhalten, Prozess für kritische Sicherheitsupdates.

### 2.4 Produktionslogging nicht entfernt
- **Schwere:** niedrig
- **Befund:** `metro.config.js` enthält nur einen Kommentar „Remove all console logs in production…“, aber keine tatsächliche Entfernung. `console.log("Done Loading 3D Models!")` in `src/ModelLoader.ts`, `console.time/timeEnd` in `src/AudioManager.ts` landen im Produktions-Bundle.
- **Remedium:** Tatsächliches Stripping in der Metro-/Babel-Konfiguration aktivieren, z. B. `babel-plugin-transform-remove-console` für Production, oder die Logaufrufe entfernen bzw. durch einen neutralen Logger ersetzen.

---

## 3. EU AI Act

- **Befund:** Keine KI-Funktionen im Produkt sichtbar. Keine Pflichten nach AI Act.
- **Schwere:** entfällt

---

## 4. Pflichttexte & UI / ePrivacy

### 4.1 Impressum / Nutzungsbedingungen fehlen
- **Schwere:** mittel
- **Befund:** Es gibt keine sichtbare Impressum-/Anbieterkennzeichnung und keine Nutzungsbedingungen. Für eine öffentlich bereitgestellte Web-App mit gewerblichem Charakter sind Angaben nach DDG/Telemedien- bzw. Plattformanforderungen marktüblich und teils verpflichtend.
- **Remedium:** In `src/screens/SettingsScreen.tsx` Einträge „Datenschutz“, „Impressum“, „Nutzungsbedingungen“ ergänzen. Inhalte als statische Screens oder Modals bereitstellen, z. B. `src/screens/Legal/Imprint.tsx`, `src/screens/Legal/Terms.tsx`. Texte auf Deutsch, mit Anbieterangaben und Kontakt.

### 4.2 Cookie-/Consent-Banner derzeit nicht erforderlich
- **Schwere:** niedrig (Hinweis)
- **Befund:** Die App setzt keine sichtbaren Analyse-/Marketing-Cookies. `AsyncStorage` speichert nur lokal notwendige Spielstände. Ein Consent-Banner ist daher aktuell nicht erforderlich.
- **Remedium:** Falls künftig Werbung, Analysen oder externe Dienste eingebunden werden, muss vor dem Setzen entsprechender Cookies/Storage-Einträge ein Consent-Banner implementiert und mit einer Datenschutzerklärung verknüpft werden.

---

## 5. Barrierefreiheit (WCAG / BITV / EAA)

### 5.1 Bild-Buttons ohne Accessibility-Labels und Rollen
- **Schwere:** mittel
- **Befund:** `src/components/Button/index.tsx` rendert `TouchableBounce`/`TouchableOpacity` mit einem `Image`, ohne `accessibilityRole="button"` und ohne `accessibilityLabel`. Auch `HomeScreen.tsx`, `GameOver/Footer.tsx`, `CharacterSelectScreen.tsx` und `SettingsScreen.tsx` nutzen Bild-Buttons ohne Textalternative. Für Screenreader-Nutzer sind die Funktionen nicht erkennbar.
- **Remedium:** `Button`-Komponente um `accessibilityRole="button"` und eine verpflichtende `accessibilityLabel`-Prop erweitern. Alle Aufrufer mit deutschen Labels versehen, z. B. „Zurück“, „Einstellungen“, „Teilen“, „Charakter wählen“, „Tages-Challenge starten“. `CharacterPicker` in `src/components/CharacterPicker.tsx` mit `accessibilityLabel="Charakter auswählen"` versehen. Sicherstellen, dass der Tastaturfokus auf dem Spielfeld (`GestureView.tsx`) sichtbar ist.

---

## 6. Sprint-/Marktreife: funktionaler Fehler im Daily-Seed-Start

### 6.1 Tages-Challenge nutzt beim ersten Start noch den klassischen Seed
- **Schwere:** hoch
- **Befund:** In `src/app/index.tsx` in `updateWithGameState` führt der Pfad `lastState === none` beim Wechsel vom Menü in den Spielzustand nur `this.engine._hero.stopIdle(); this.onSwipe(swipeDirections.SWIPE_UP);` aus. `this.engine.setupGame(this.props.character, this.props.mode)` wird dort nicht erneut aufgerufen. Da `mode` erst nach dem initialen Mount auf `"daily"` gesetzt wird, bleibt der beim Start erzeugte klassische Zeit-Seed aktiv. AC-01 und AC-02 des Sprints sind damit nicht erfüllt.
- **Remedium:** In `updateWithGameState`, `case playing`, im `else`-Zweig vor dem ersten Swipe `this.engine.setupGame(this.props.character, this.props.mode); this.engine.init();` aufrufen, z. B.:
  ```ts
  } else {
    // Coming straight from the menu.
    this.engine.setupGame(this.props.character, this.props.mode);
    this.engine.init();
    this.engine._hero.stopIdle();
    this.onSwipe(swipeDirections.SWIPE_UP);
  }
  ```
  Alternativ: `this.transitionToGamePlayingState()` verwenden, damit derselbe Setup-Pfad wie beim Neustart greift. Danach mit einem Repro testen (gleicher Kalendertag, zwei Starts), bis AC-01 und AC-02 nachweislich erfüllt sind.

---

**Fazit:** Der Daily-Seed-Fix ist behebbar, ebenso die Pflichttext-, SBOM- und Accessibility-Lücken. Es sind keine fundamentalen rechtswidrigen Datenverarbeitungen erkennbar. Daher: `CHANGES_REQUESTED`.