VERDICT: CHANGES_REQUESTED

## Zusammenfassung
Es wurden keine hartcodierten Secrets, keine direkte Injection/RCE, kein Auth-Bypass und keine offensichtliche PII-Leakage gefunden. Der Hauptbefund ist die veraltete Expo-/Metro-/expo-three-Abhängigkeitskette mit mehreren `npm audit`-Highs. Zusätzlich existieren zwei produktionsrelevante Informations-/Manipulationsschwachstellen mit niedriger bis mittlerer Schwere. Der semgrep-Lauf wurde übersprungen; daraus leite ich keinen eigenständigen Befund ab.

## Scannerbefund

### npm audit
Der Audit läuft mit Exit 1 und meldet High-/Moderate-Schwachstellen in transitiven Abhängigkeiten, unter anderem:
- `@expo/config-plugins` via `@expo/plist`, `xcode`, `xml2js`, `@xmldom/xmldom`
- `@expo/cli`, `@expo/metro`, `@expo/metro-config`
- `@expo/browser-polyfill` via `expo-file-system`, `fbemitter`, `uuid`, wirksam über `expo-three`

Ein Großteil betrifft Build-/CLI-Werkzeuge, ist aber nicht automatisch harmlos. Der Laufzeitpfad über `expo-three` und `@expo/browser-polyfill` ist relevanter, da er potenziell im Web-Bundle enthalten ist. Ein konkreter, aktiv ausgenutzter CVE-Exploit ist im sichtbaren Audit-Ausschnitt nicht benannt; die Roh-Highs allein blockieren daher nicht, erfordern aber eine Abhängigkeitsbereinigung.

### semgrep
`[skipped] semgrep not installed` — der SAST-Lauf wurde nicht ausgeführt. Das ist eine Nachweislücke, aber kein eigenständiger Befund.

## Befunde

### 1. Veraltete Expo-/Metro-/expo-three-Abhängigkeitskette
- **Schweregrad:** hoch (Roh-Scannerbefund), real im Web-Bundle potenziell mittel bis hoch
- **Betroffen:** `package.json`, `package-lock.json`, transitiv `@expo/config-plugins`, `@expo/cli`, `@expo/metro-config`, `@expo/plist`, `xcode`, `xml2js`, `@xmldom/xmldom`, `@expo/browser-polyfill`, `expo-file-system`, `fbemitter`, `uuid`
- **Beschreibung:** `npm audit` meldet High-/Moderate-Advisories. Die Fixes erfordern laut Audit einen Major-Upgrade auf `expo@57.0.17` bzw. `expo-three@5.6.0`. Besonders `@expo/browser-polyfill` reicht über `expo-three` in die Laufzeit. Auch wenn viele Befunde das Build-Tooling betreffen, ist die derzeitige Expo-SDK-54-Linie hier deutlich angestaubt.
- **Fix:**  
  1. Geplant auf Expo SDK 57 und `expo-three@5.6.0` aktualisieren.  
  2. Die drei-/`expo-gl`-bezogenen Breaking Changes in `src/CrossyGame.ts`, `src/components/CharacterSelect/CharacterCard.tsx` und `src/app/index.tsx` anpassen.  
  3. Danach `npm audit` erneut ausführen; verbleibende transitive Schwachstellen gezielt per `overrides` fixen/pinnen, wenn sie auf ungepatchte Teilbäume verweisen.

### 2. Globale Test-API wird auch in Produktion exponiert
- **Schweregrad:** mittel
- **Betroffen:** `src/app/index.tsx`, `registerTestApi()` / `componentDidMount()`
- **Beschreibung:** `registerTestApi()` wird in `componentDidMount()` ohne `__DEV__`-Guard aufgerufen. Auf Web-Builds entsteht damit global `window.__TEST_API__` mit Zugriff auf `scene`, `player` und `score`. Über die zurückgegebenen Objekte kann ein Nutzer in der Browser-Konsole den laufenden Spielzustand manipulieren. Es werden keine Servergeheimnisse offengelegt, aber eine Debug-/Test-Schnittstelle gehört nicht in Produktions-Bundles.
- **Fix:** Aufruf nur im Entwicklungsmodus:
  ```ts
  if (__DEV__) {
    this.registerTestApi();
  }
  ```
  Alternativ die Registrierung vollständig aus Produktions-Builds entfernen, sofern die Test-Harness nicht zwingend im Prod-Bundle benötigt wird.

### 3. Fehler-Stack wird dem Endnutzer angezeigt
- **Schweregrad:** niedrig
- **Betroffen:** `src/app/_layout.tsx`, `ErrorScreen` / `AssetLoading`
- **Beschreibung:** Bei einem Asset-Lade-/Modell-Ladefehler wird `error.stack` ungefiltert als `<Text>` gerendert. In Produktion leakt das interne Pfad-/Architekturdetails an den Nutzer. Sensible Daten sind darin nicht zu erwarten, es ist aber unnötige Information Disclosure.
- **Fix:** Stack nur im Entwicklungsmodus anzeigen, in Produktion eine generische Fehlermeldung rendern:
  ```tsx
  {__DEV__ && stack ? (
    <Text style={[styles.errorText, { fontSize: 12, opacity: 0.8, marginTop: 4 }]}>
      {stack}
    </Text>
  ) : null}
  ```

## Nicht als Schwachstelle gewertet
- **Keine hartcodierten Secrets:** In den sichtbaren Dateien wurden keine Passwörter, Token, API-Schlüssel oder secret URLs gefunden.
- **Keine klassische Injection/XSS:** Nutzerwerte wie der Tages-Schlüssel (`getTodayKey()`) oder Bestwerte werden als React-Native-Text gerendert, nicht als HTML/innerHTML.
- **Keine relevante AuthN/AuthZ-Lücke:** Es gibt keine Serverkommunikation und keine Benutzerkonten; die Client-Manipulation über die Test-API ist lokal begrenzt.
- **`AsyncStorage`-JSON-Parse:** Das Parsen des Daily-Best-Maps ist durch die umgebenden `try/catch`-Blöcke abgefangen; daraus ergibt sich kein eigenständiger Sicherheitsbefund.