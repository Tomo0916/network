# Network Words（ネットワーク用語）

ネットワークの授業（レイヤー1・2）の用語を、11言語で学ぶアプリ。 https://tomo0916.github.io/network/

意味は自分の言語で理解し、用語は日本語で覚える。用語一覧・単語カード・4択クイズ・仕分けクイズ・動く図解（ハブとスイッチ、ユニキャスト等、CSMA/CD）がある。
構成と言語の仕組みは [SQL Practice](https://github.com/Tomo0916/sql-practice) の `next/` と同じ。

## 授業での使い方

| やりたいこと | アドレス |
|---|---|
| 今日の範囲だけを配る | `…/network/?range=lesson-2`（`L1` `L2` `g-signal` なども使える） |
| 言語を指定して開く | `…/network/?lang=vi` |
| スクリーンに映す（文字を大きく） | `…/network/?present=1`、または 設定 → 発表モード |
| 図解を直接開く | `…/network/#/demos/hubswitch`（`cast` `csmacd`） |

- 学習の記録（覚えた用語・間違えた用語・正答数）は、生徒の端末のブラウザの中だけに保存される。名前などは扱わない。
- クイズで間違えた用語は「復習」に入り、1日後・3日後・7日後にもう一度出る。
- 一度開けば、Wi-Fiがなくても動く。ホーム画面に追加できる。

## 用語を増やすには

| やりたいこと | 編集するファイル |
|---|---|
| 用語を足す | `js/words.js` に1行（idは英小文字、一度決めたら変えない） |
| 用語の説明・たとえ | `i18n/ja.js`・`easy.js`・`en.js` の `w.<id>.desc` と `w.<id>.tip` |
| グループ・授業回・図解 | `js/groups.js` |
| 画面の文言・翻訳を直す | `i18n/<言語>.js`（1言語1ファイル。やさしい日本語は `{漢字|かんじ}` でふりがな） |

`ja`・`easy`・`en` の3つは先生が書く（必須）。ほかの8言語は Claude の下書きで、訳がない文言は英語で表示する。

## 翻訳の確認（留学生に頼むとき）

1. 確認してほしい言語のページを送る：`…/network/#/check/vi`（`ne` `fr` `my` `bn` `si` `id` `vi` `zh`）。英語と訳が並んで表示される。
2. 直すところを教えてもらい、`i18n/<言語>.js` を直す。
3. 正しいと確認できた用語のidを `i18n/status.js` のその言語に足す（画面の文言がすべて正しければ `'ui'` も足す）。

`status.js` にない用語は、説明の横に「未確認」の小さな印が出る。ミャンマー語は Unicode で書く（Zawgyi は使わない）。

変更したら必ずチェックを実行する（npm install は不要）:

```
node tools/check.mjs
```

用語のid・グループ・紛らわしい用語の参照先、全言語の抜けと `{placeholder}` の一致、ほかの言語への日本語の混入、
やさしい日本語のふりがな漏れ、画面で使う文言の有無、4択の選択肢が必ず4つ作れることを調べる。
✗（エラー）は直す。!（警告）は、まだ翻訳していない言語などで、公開してよい。

公開後に大きく変えたときは `sw.js` の `VERSION` を1つ上げる（オフライン用キャッシュの更新）。

## ファイル構成

```
index.html                 生徒用アプリ
css/app.css                デザイン（SQL Practice と共通部分＋ネットワーク用）
js/student.js              画面（ホーム・一覧・カード・クイズ・仕分け・復習・図解）
js/words.js                用語の骨組み（増えていく）
js/groups.js               レイヤー・グループ・授業回・図解の一覧
js/quiz.js                 範囲と出題（画面のコードなし）
js/store.js                学習記録の保存（このブラウザの中だけ）
js/i18n.js, js/ui.js       言語の読み込み・共通部品（SQL Practice と同じ）
js/demos/                  図解アニメーション（1図解1ファイル）
i18n/                      ja / easy / en / ne / fr / my / bn / si / id / vi / zh
tools/check.mjs            自動チェック
sw.js, manifest.webmanifest, icons/   オフライン対応・ホーム画面に追加
```

## GitHub Pages の設定

Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `/ (root)` にする。
