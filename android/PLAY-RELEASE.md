# Android / Google Play release

This PWA should be packaged as a Trusted Web Activity (TWA) using Bubblewrap.

## Release identity

- Application ID: `com.waraq.urducalculator`
- App label: `Urdu Calculator`
- Web app: `https://xl8saif.github.io/urdu-calculator/`
- Manifest: `https://xl8saif.github.io/urdu-calculator/manifest.json`
- Target SDK: Android 16 / API 36 or higher
- Output: signed Android App Bundle (`.aab`)

## Build on Windows

Use Node.js 18+ and a JDK supported by the current Bubblewrap/Android toolchain. Bubblewrap 1.25.0 is the current release used for this project; it targets SDK 36.

Open PowerShell in a new working directory:

```powershell
npm install -g @bubblewrap/cli@1.25.0
bubblewrap --version
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

Let Bubblewrap create the signing key if you do not already have a permanent release key. Save the keystore and passwords securely. Never commit the keystore or passwords to GitHub.

Then run:

```powershell
bubblewrap update
bubblewrap build
```

Bubblewrap builds the Android project and produces a signed APK and signed App Bundle when signing is enabled. The Play Store upload artifact is the signed `.aab` file.

## Digital Asset Links

A TWA needs Digital Asset Links to establish that the Android application is authorized to open the web origin in a trusted full-screen experience.

After the permanent release keystore is created, obtain its SHA-256 certificate fingerprint:

```powershell
keytool -list -v -keystore android.keystore
```

Then create `/.well-known/assetlinks.json` on the web origin using the final package name and SHA-256 fingerprint. Do not use a placeholder fingerprint.

For the current GitHub Pages project URL, the origin is `xl8saif.github.io`. Because this is a project-site path (`/urdu-calculator/`), the asset-links file must be served from the origin root, not from `/urdu-calculator/.well-known/`. The final location is therefore expected to be:

`https://xl8saif.github.io/.well-known/assetlinks.json`

This will require a change to the `xl8saif.github.io` GitHub Pages repository after the permanent signing certificate fingerprint is known.

## Pre-upload testing

1. Install the signed APK on a physical Android phone.
2. Test all four tabs: Calculator, Age, Zakat, Converter.
3. Test Urdu/English switching.
4. Test Urdu/Western digit switching.
5. Test back navigation and external profile links.
6. Disable network after the first successful load and verify the app still functions.
7. Open the in-app privacy policy link and verify the policy loads correctly.
8. Verify the TWA does not display browser chrome when Digital Asset Links is correctly configured.
9. Upload the signed `.aab` to a Play Console internal testing track before production.

## Current offline asset status

The Waraq and CloudTrans logos are referenced as same-origin files in this repository and are included in the service-worker application shell. The Waraq logo file is `WaraqLogo.jpg`; the CloudTrans logo file is `CloudTrans-Logo.PNG`.

## Security

Never commit any of the following:

- `android.keystore`
- keystore passwords
- key passwords
- Play Console service-account credentials
- signing keys or certificates containing private key material

## Final release blocker

The source/PWA side is prepared. The remaining Android-specific blocker is the permanent release signing key and its SHA-256 certificate fingerprint. That fingerprint is required for the final Digital Asset Links configuration and cannot be safely invented or committed before the permanent release keystore exists.
