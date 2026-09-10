# My Travel PWA v37

v32をベースに、GitHub Pages + HTTPSでの公開運用とオフライン利用を前提に整理した版です。

## v37の主な変更
1. GitHub Pagesのプロジェクトサイトでそのまま公開できるよう `My Travel.html` を追加。
2. `manifest.webmanifest` の起動先をサイトのルート `./` に変更し、GitHub PagesでもPWA起動しやすくしました。
3. Service Workerをv37へ更新。旧My Travelキャッシュを整理します。
4. HTTPS上で一度読み込んだ後は、旅行データの閲覧・追加・編集・削除などをオフラインでも継続利用できるよう、アプリ本体のキャッシュを強化。
5. Leaflet / PDF.js / Tesseract.js などの外部ライブラリは、対応CDNから一度オンラインで読み込んだものをキャッシュし、オフライン継続性を高めました。
6. Google Identity Servicesは認証の安全性・更新性のためキャッシュ対象外です。Google Driveへの接続・保存・取得はオンライン時に行います。
7. 設定画面のバージョン表示をv37へ統一し、オフライン利用について明記。
8. 既存の旅行データ（localStorage）とPDF・画像等（IndexedDB）は更新処理で削除しません。

## 公開運用
GitHub PagesでHTTPS公開し、Google Cloud OAuthの「承認済みのJavaScript生成元」には、GitHub Pagesのorigin（例：`https://USERNAME.github.io`）を登録します。パスは付けません。

## オフラインについて
- オフラインで利用可能：旅行一覧、旅行情報の閲覧・追加・編集・削除、端末内に保存済みの資料の閲覧など、端末内データを使う機能。
- オンラインが必要：Google OAuth認証、Google Driveへの保存・取得、初回の外部ライブラリ読み込み、地図のオンライン地図タイル取得など。
- OCR/PDFのライブラリは一度オンラインで利用してキャッシュしておくと、オフライン継続性が高まります。ただしブラウザやキャッシュ状態により完全な保証はできないため、重要な資料は事前に機内モードでテストしてください。

## ファイル構成
- `My Travel.html` : GitHub Pagesの入口
- `My Travel.html` : 本体
- `sw.js` : オフライン・更新制御
- `manifest.webmanifest` : PWA設定
- `icon.svg` : アプリアイコン


## v37
Google Drive保存処理を診断しやすく改善。認証・バックアップ生成・保存先確認・アップロードの各段階を表示し、通信失敗時に原因候補を含むエラーを表示します。既存機能とデータ形式は維持します。


v37: HTML本体を「My Travel.html」に一本化。編集保存後は最新の詳細情報を再表示します。
