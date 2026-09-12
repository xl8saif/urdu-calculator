# Android / Google Play release

This PWA should be packaged as a Trusted Web Activity (TWA) using Bubblewrap/PWABuilder.

## Release identity

- Application ID: `com.waraq.urducalculator`
- App label: `Urdu Calculator`
- Web app: `https://xl8saif.github.io/urdu-calculator/`
- Manifest: `https://xl8saif.github.io/urdu-calculator/manifest.json`
- Target SDK: Android 16 / API 36 or higher
- Output: signed Android App Bundle (`.aab`)

## Build on Windows

Install a current Node.js LTS release and a JDK supported by the current Bubblewrap/Android toolchain.

Then open PowerShell in a new working directory:

```powershell
npm install -g @bubblewrap/cli
mkdir urdu-calculator-twa
cd urdu-calculator-twa
bubblewrap init --manifest https://xl8saif.github.io/urdu-calculator/manifest.json
```

During initialization use:

- Application ID: `com.waraq.urducalculator`
- Application name: `Urdu Calculator`
- Start URL: `https://xl8saif.github.io/urdu-calculator/`
- Display mode: `standalone`
- Theme color: `#123524`
- Background color: `#0d1f17`
- Orientation: portrait-primary

Let Bubblewrap create the signing key, but save the keystore and passwords securely. Never commit the keystore or passwords to GitHub.

Before the final build:

```powershell
bubblewrap update
bubblewrap build
```

Bubblewrap's build process produces a signed APK and a signed App Bundle when signing is enabled. The Play Store upload artifact is the `.aab` file.

## Digital Asset Links

A TWA needs Digital Asset Links to establish that the Android application is authorized to open the web origin in a trusted full-screen experience.

After the permanent release keystore is created, obtain its SHA-256 certificate fingerprint:

```powershell
keytool -list -v -keystore android.keystore
```

Then create `/.well-known/assetlinks.json` on the web origin with the final package name and certificate fingerprint. Do not use a placeholder fingerprint.

For the current GitHub Pages project URL, the origin is `xl8saif.github.io`. Because this is a project-site path (`/urdu-calculator/`), the asset-links file may need to be served from the root GitHub Pages site rather than this repository. Verify the final HTTPS location before release.

## Pre-upload testing

1. Install the signed APK on a physical Android phone.
2. Test all four tabs: Calculator, Age, Zakat, Converter.
3. Test Urdu/English switching.
4. Test Urdu/Western digit switching.
5. Test back navigation and external profile links.
6. Disable network after the first successful load and verify the app still functions.
7. Verify privacy policy access.
8. Verify the TWA does not display browser chrome when Digital Asset Links is correctly configured.
9. Upload the signed `.aab` to a Play Console internal testing track before production.

## Security

Never commit any of the following:

- `android.keystore`
- keystore passwords
- key passwords
- Play Console service-account credentials
- signing keys or certificates containing private key material

## Important current blocker

The web app currently references the Waraq and CloudTrans logo images from external raw GitHub URLs in CSS. For a genuinely self-contained offline release, replace those references with local copies in this repository before final packaging.