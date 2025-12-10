# 🌿 やすらぎタイマー (Yasuragi Timer)
**忙しい日々に、3分間の「深呼吸」を届けるリラクゼーションタイマー**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 👀 デモ画像
<img width="1916" height="911" alt="やすらぎタイマー" src="https://github.com/user-attachments/assets/c99a7ba8-10e1-4e4b-a954-bfad474b7408" />


## 🔗 サービス URL
https://kkkkyo-iii.github.io/iyashitimer.io/

## 💡 開発背景 
既存のタイマーやアラームアプリは、通知音が大きすぎたり刺激的すぎたりして、**「音が鳴る瞬間にビクッとしてしまう」「早く止めなきゃと焦ってしまう」** というストレスがありました。
本来リラックスするための休憩時間に、アラーム音で警戒心を持ってしまっては意味がありません。

そこで、**「止める時に警戒しなくていい」** ことを最優先に考え、優しい環境音とシンプルな操作性だけを詰め込んだ「やすらぎタイマー」を開発しました。

## ✨ 主な機能
* **癒やしの環境音:** 4つのカテゴリ（猫・鳥・自然音・生活音）から好きな音を選択できます。
* **没入感を高めるUI:** 選択した音に合わせて、背景画像が自動的に切り替わります。
* **試聴モード:** タイマーを作動させる前に、どんな音が流れるか確認できる「試聴ボタン」を搭載しました。
* **アラーム機能:** 時間が来ると、選択した環境音がループ再生され、優しく時間を知らせます。

## 🛠 技術スタック
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
* **Design:** Flexboxによるレスポンシブ配置, CSSグラデーション

## 🚀 工夫した点
* **オブジェクト指向的な設計:**
    * 音声ファイルや背景画像のパスをJavaScriptのオブジェクト（`soundData`）で一元管理し、コードの保守性を高めました。これにより、新しい音の追加や削除が容易になっています。
* **直感的な操作:**
    * 「10分」「1分」「10秒」のボタンを組み合わせることで、スマホのアラーム設定のような細かいドラムロール操作なしに、直感的に時間をセットできるようにしました。
* **視覚的なフィードバック:**
    * 選択中のサウンドボタンをハイライト表示したり、リセット時に背景を元に戻すなど、ユーザーが「今の状態」を迷わないようなUI設計を心がけました。
