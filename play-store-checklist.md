# Google Play Store — Release Checklist (Urdu Calculator)

## Current release target

- App: **Urdu Calculator — اردو کیلکولیٹر**
- Developer: **WARAQ Enterprises, Gilgit**
- Package ID: **com.waraq.urducalculator**
- Distribution: Google Play, Android App Bundle (`.aab`)
- Target SDK: **Android 16 / API 36** (required for new Google Play apps from August 31, 2026)
- Orientation: Portrait-first, responsive UI
- Pricing: Free
- Ads: None
- Accounts: None
- Data collection: None

Google Play currently requires new apps and updates to target Android 16 (API 36) or higher. See the official Android requirement before each release.

## 1. Web/PWA release

- [x] Public HTTPS hosting on GitHub Pages
- [x] `manifest.json`
- [x] Service worker and offline cache
- [x] 192px / 512px PWA icons
- [x] Privacy policy page
- [ ] Remove all external runtime assets and bundle them locally so the installed app remains genuinely self-contained after the first load.
- [ ] Verify the deployed GitHub Pages build in Chrome Android, including offline mode after installation.

## 2. Android packaging

**Recommended route: Trusted Web Activity (TWA).**

The Android package should open the existing PWA in a TWA rather than embedding the site in a generic WebView. Use Bubblewrap/PWABuilder or an equivalent TWA toolchain.

Required Android configuration:

- Package/application ID: `com.waraq.urducalculator`
- `compileSdk`: 36 or higher
- `targetSdk`: 36 or higher
- Min SDK: choose the supported Android baseline during TWA generation
- Orientation: portrait-primary
- App label: `Urdu Calculator`
- App icon: existing 192/512 PWA artwork, plus Android adaptive/maskable icon assets as required by the packaging tool
- Release output: signed `.aab`

## 3. Digital Asset Links

TWA verification requires a Digital Asset Links file containing the SHA-256 fingerprint of the release signing certificate.

Because the current app is hosted at `https://xl8saif.github.io/urdu-calculator/`, the final asset-links file must be served from the origin's `/.well-known/assetlinks.json` location. This may require adding the file to the `xl8saif.github.io` GitHub Pages site, or moving the app to a custom domain where the file can be controlled directly.

Do not publish a placeholder fingerprint. Generate the release keystore first, obtain its SHA-256 certificate fingerprint, then create the final `assetlinks.json`.

## 4. Privacy and Data Safety

- [x] Privacy policy is available at `/privacy.html`.
- [ ] Add the privacy-policy URL to Play Console.
- [ ] Complete Google Play Data Safety form.
- [ ] Declare no data collected/shared only after verifying the final Android package and all bundled libraries/SDKs.
- [ ] Declare ads: No.
- [ ] Declare government app: No, unless the Play Console questionnaire determines otherwise.
- [ ] Complete target audience/content rating declarations.

The privacy policy and Data Safety form must accurately match the final shipped package, including any third-party SDK behavior.

## 5. Store listing assets

Prepare:

- App icon: 512×512 source artwork
- Feature graphic: 1024×500
- At least 2 phone screenshots, preferably 1080×1920
- Optional tablet/large-screen screenshots if the final UI is optimized for them
- Short description: maximum 80 characters
- Full description: see `store-description.md`

Suggested short description:

`Calculator, age, Zakat and unit converter. Free, offline, no ads.`

## 6. Release signing

- [ ] Create a permanent release keystore.
- [ ] Back up the keystore securely.
- [ ] Record the package name and release certificate fingerprint.
- [ ] Configure Play App Signing in Google Play Console.
- [ ] Never commit the keystore, passwords, or signing secrets to GitHub.
- [ ] Build a release `.aab` with `targetSdk 36+`.
- [ ] Install/test the release build on a physical Android device before upload.

## 7. Final Play Console submission

- [ ] Create the app in Google Play Console.
- [ ] Upload the signed `.aab` to an internal testing track first.
- [ ] Test installation, navigation, offline behavior, links, orientation, and back navigation.
- [ ] Complete Store Listing.
- [ ] Complete App Content declarations.
- [ ] Complete Data Safety.
- [ ] Add privacy policy URL.
- [ ] Complete content rating questionnaire.
- [ ] Complete target audience and ads declarations.
- [ ] Review Play Console pre-launch/device testing results.
- [ ] Promote the tested build to production.

## 8. Important release rule

Do not claim that the Android release is fully offline until every runtime dependency—including branding images, fonts, JavaScript, CSS, icons, and service-worker cache entries—has been verified as local to the app/web origin. The current CSS contains external GitHub raw logo references; these must be replaced with local copies before the final offline release.