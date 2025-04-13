## サービス名
### 読書情報管理アプリ　BOOKS

## サービスのURL
https://books-app-kappa.vercel.app/
## 当サービスを作成した目的
当サービスは以下を目的に作成しました。
* Docker、Next、React、Tailwind、および開発の流れを理解すること
* 外部APIを利用したサービスを開発し、デプロイまで完了すること
## 当サービスを作成した経緯
近年読書をする機会が増え、読書履歴を整理したいと思ったことがきっかけです。  
読書履歴管理アプリは初めての開発としては丁度良い難易度だと考え、作成に至りました。
## 画面・機能一覧
### PC画面
| ログイン画面 | アカウント登録画面 |
| :---: | :---: |
| <img width="1500" alt="PC_login" src="https://github.com/user-attachments/assets/0647e445-c4d8-4aa0-bdea-26d6be883b10" /> | <img width="1500" alt="PC_register" src="https://github.com/user-attachments/assets/35d79684-1317-4d9f-84ab-af15691ffc3b" /> |
| ログイン機能、各項目およびアカウント認証のバリデーション機能を実装しました。| アカウント登録機能を実装しました。メールアドレス重複時にはエラーメッセージが表示されます。パスワードはマスクおよびマスク解除が可能です。 |

| マイ本棚画面 | マイ本棚画面 詳細確認モーダル |
| :---: | :---: |
| <img width="1500" alt="PC_bookshelf" src="https://github.com/user-attachments/assets/8f870627-d999-48b4-842c-6284681c27f9" /> | <img width="1500" alt="PC_bookshelf_detail" src="https://github.com/user-attachments/assets/6b80f2ef-37a4-4b32-bdbf-e9f9dd9ec058" /> |
| マイ書籍一覧表示機能を実装しました。ログインまたはアカウント登録直後に遷移する画面であり、詳細確認、編集、削除機能を有します。共通で表示されるヘッダーはログアウト機能を有します。 | 選択したマイ書籍に紐付く書籍情報、読書情報、評価情報の表示機能を実装しました。 |

| マイ本棚画面　編集モーダル | マイ本棚画面　削除モーダル |
| :---: | :---: |
| <img width="1500" alt="PC_bookshelf_edit" src="https://github.com/user-attachments/assets/6219a2c3-6980-425c-a34e-e004ee1e9227" /> | <img width="1500" alt="PC_bookshelf_delete" src="https://github.com/user-attachments/assets/f772d232-ce71-4159-a84b-92ceb8eeeb9d" /> |
| 選択したマイ書籍に紐付く書籍情報、読書情報、評価情報の編集機能を実装しました。 | 選択したマイ書籍に紐付く書籍情報、読書情報、評価情報の削除機能を実装しました。 |

| 書籍検索画面 | お気に入り画面 |
| :---: | :---: |
| <img width="1500" alt="PC_search" src="https://github.com/user-attachments/assets/ec97d8b3-ad47-4f65-804d-49ab0d6eb5b5" /> | <img width="1500" alt="PC_favorites" src="https://github.com/user-attachments/assets/80a6aa56-5a13-44f2-a30b-06c2a5781495" /> |
| 外部API「国立国会図書館サーチ（NDLサーチ）」を利用した書籍検索機能を実装しました。ISBN検索または詳細検索が可能です。さらに、検索結果カード右下のアイコンよりお気に入りの追加と削除、およびマイ本棚の追加ができます。| お気に入り一覧表示機能を実装しました。選択した書籍情報の詳細表示機能（モーダル表示）、お気に入り削除機能（モーダル表示）、マイ本棚追加機能を有します。 |
### スマホ画面（一部紹介）
| ログイン画面 | アカウント登録画面 | マイ本棚画面 |
| :---: | :---: | :---: |
| <img width="1500" alt="スマホ_login" src="https://github.com/user-attachments/assets/729e5979-9863-45e0-8b2b-17150f0aad22" /> | <img width="1500" alt="スマホ_register" src="https://github.com/user-attachments/assets/045324ca-e8f3-4a04-b048-09cdf04b319d" /> | <img width="1500" alt="スマホ_bookshelf" src="https://github.com/user-attachments/assets/a62b3318-71fd-42d7-a2e8-877ed68d5bbf" /> |
| 機能はPCと同様です。 | 機能はPCと同様です。 | 機能はPCと同様です。一覧の表示項目は画面サイズに応じて適用され、スマホ画面は「タイトル」「作者」のみ表示されます。 |

| マイ本棚画面　編集モーダル | 書籍検索画面 | ハンバーガメニュー |
| :---: | :---: | :---: |
| <img width="1500" alt="スマホ_bookshelf_edit" src="https://github.com/user-attachments/assets/6557483d-8c2d-425b-b91a-3724e69933a9" /> | <img width="1500" alt="スマホ_search" src="https://github.com/user-attachments/assets/7a9975de-9dda-425d-b5df-27e94bf582e3" /> | <img width="1500" alt="スマホ_menu" src="https://github.com/user-attachments/assets/c9164ab3-55a9-4657-a5e5-e3763af124d9" /> |
| 機能はPCと同様です。 | 機能はPCと同様です。検索結果のカード表示列数は画面サイズに応じて適用され、スマホ画面は１列で表示されます。 | PC画面でサイドバーとして実装したコンテンツを、スマホ画面ではハンバーガメニューとしてヘッダーに実装しました。 |
## 使用技術
* バックエンド、フロントエンド：Next.js
* DB：PostgreSQL
* ORM：Prisma
* CSSフレームワーク：tailwind
* UIライブラリ：React
* UIコンポーネント：Flowbite-react
* バリデーション：Zod
* フォーマッタ：Biome
* サーバーサービス：NeonTech
* インフラ：Vercel
* ソース管理：Github
* コンテナ：Docker
## ER図
<img width="700" alt="ER図" src="https://github.com/user-attachments/assets/6e0a6e3d-abc7-4d70-a8b3-a52e789325d3" />

## 今後の展望
当サービスは以下4つのフェーズに分けて開発を進めています。<br>
フェーズ１は完了しましたので、追加機能の実装に向けて引き続き開発を実施しています。
1. 国立国会図書館サーチ（[NDLサーチ](https://ndlsearch.ndl.go.jp/help/api)）を利用し、以下機能を有するアプリケーションを開発する。【完了】
* ログイン機能
* 書籍検索機能（ISBN検索、詳細検索）
* お気に入り保存、削除機能
* マイ本棚追加、編集、削除機能
* 評価追加、編集、削除機能
2. 以下機能を追加する。
* プロフィール編集機能
* アカウントの削除機能
* メールアドレス認証機能
* マイ書籍一覧およびお気に入り一覧の検索保持機能
3. 以下機能の追加および対応を実施する。
* 読書目標および進捗の管理機能
* UXの向上（ページング機能、一括削除機能等検討）
4. 以下機能を追加および検討する。
* 他ユーザーの評価情報表示機能を追加
* 書籍のおすすめ機能を追加
* 広告による収益化を検討
