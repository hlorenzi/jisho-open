export const raw =
`
# @ group-identifier
# source-category; source-pattern -> target-category; target-pattern

@ id: verb-identity
@ hidden
v1;    *る -> unc; *る
v1-s;  *る -> unc; *る
vz;    *ずる -> unc; *ずる
v5aru; *る -> unc; *る
v5u;   *う -> unc; *う
v5u-s; *う -> unc; *う
v5r;   *る -> unc; *る
v5r-i; *ある -> unc; *ある
v5t;   *つ -> unc; *つ
v5k;   *く -> unc; *く
v5k-s; *く -> unc; *く
v5g;   *ぐ -> unc; *ぐ
v5s;   *す -> unc; *す
v5n;   *ぬ -> unc; *ぬ
v5b;   *ぶ -> unc; *ぶ
v5m;   *む -> unc; *む
vs-i;  *する -> unc; *する
vs-s;  *する -> unc; *する
vk;    *くる -> unc; *くる

@ id: continuative
v1;      *る -> n; *
v1-s;    *る -> n; *
vz;      *ずる -> n; *じ
v5aru;   *る -> n; *い
v5u;     *う -> n; *い
v5u-s;   *う -> n; *い
v5r;     *る -> n; *り
v5r-i;   *る -> n; *り
v5t;     *つ -> n; *ち
v5k;     *く -> n; *き
v5k-s;   *く -> n; *き
v5g;     *ぐ -> n; *ぎ
v5s;     *す -> n; *し
v5n;     *ぬ -> n; *に
v5b;     *ぶ -> n; *び
v5m;     *む -> n; *み
vs-i;    *する -> n; *し
vs-s;    *する -> n; *し
vk;      *くる -> n; *き

@ id: verb-form
@ display: verb form
vs; * -> vs-i; *する

@ id: v-conjunctive-stem-unvoiced
@ hidden
v1;      *る -> unc; *
v1-s;    *る -> unc; *
vz;      *ずる -> unc; *じ
v1contr; *る -> unc; *
v5aru;   *る -> unc; *っ
v5u;     *う -> unc; *っ
v5u-s;   *う -> unc; *う
v5r;     *る -> unc; *っ
v5r-i;   *る -> unc; *っ
v5t;     *つ -> unc; *っ
v5k;     *く -> unc; *い
v5k-s;   *く -> unc; *っ
v5s;     *す -> unc; *し
vs-i;    *する -> unc; *し
vs-s;    *する -> unc; *し
vk;      *くる -> unc; *き
vmasu;   *ます -> unc; *まし

@ id: v-conjunctive-stem-voiced
@ hidden
v5g; *ぐ -> unc; *い
v5n; *ぬ -> unc; *ん
v5b; *ぶ -> unc; *ん
v5m; *む -> unc; *ん

@ id: conjunctive
%v-conjunctive-stem-unvoiced; * -> vte; *て
%v-conjunctive-stem-voiced;   * -> vte; *で
adj-na;                       * -> unc; *で
adj-i;                        *い -> unc; *くて
adj-ix;                       *いい -> unc; *よくて

@ id: past
%v-conjunctive-stem-unvoiced; * -> unc; *た
%v-conjunctive-stem-voiced;   * -> unc; *だ
vmasuneg;                     *ません -> unc; *ませんでした
n;                            * -> unc; *だった
adj-na;                       * -> unc; *だった
adj-i;                        *い -> unc; *かった
adj-ix;                       *いい -> unc; *よかった

@ id: negative-stem
@ hidden
v1;    *る -> unc; *
v1-s;  *る -> unc; *
vz;    *ずる -> unc; *じ
v5aru; *る -> unc; *ら
v5u;   *う -> unc; *わ
v5u-s; *う -> unc; *わ
v5r;   *る -> unc; *ら
v5r-i; *ある -> unc; *
v5t;   *つ -> unc; *た
v5k;   *く -> unc; *か
v5k-s; *く -> unc; *か
v5g;   *ぐ -> unc; *が
v5s;   *す -> unc; *さ
v5n;   *ぬ -> unc; *な
v5b;   *ぶ -> unc; *ば
v5m;   *む -> unc; *ま
vs-i;  *する -> unc; *し
vs-s;  *する -> unc; *し
vk;    *くる -> unc; *こ

@ id: negative-classical-stem
@ hidden
%negative-stem; * -> unc; *
vz;   *する -> !
vz;   *ずる -> unc; *ぜ
vs-i; *する -> !
vs-i; *する -> unc; *せ
vs-s; *する -> !
vs-s; *する -> unc; *せ

@ id: negative
@ ref: https://www.edrdg.org/wwwjdic/wwwverbinf.html#suru_tag
%negative-stem; * -> adj-i; *ない
v1contr;        *る -> adj-i; *ない
vmasu;          *ます -> vmasuneg; *ません
vs-s;           *する -> adj-i; *さない
n;              * -> adj-i; *じゃない
adj-na;         * -> adj-i; *じゃない
adj-i;          *い -> adj-i; *くない
adj-ix;         *いい -> adj-i; *よくない

@ id: negative-contracted
@ display: negative (contracted)
%negative-classical-stem; * -> unc; *ん
v5r-i; *ある -> !
# ある -> あらん (?)

@ id: negative-dialectal
%negative-stem; * -> unc; *へん

@ id: negative-classical
%negative-classical-stem; * -> unc; *ぬ
# ある -> ぬ (?)

@ id: negative-continuative
%negative-classical-stem; * -> unc; *ず
# ある -> ず (?)

@ id: negative-archaic-literary
@ display: negative (archaic literary)
%negative-classical-stem; * -> unc; *ざる
%negative-classical-stem; * -> unc; *ざり

@ id: conjunctive-negative
@ display: conjunctive negative
%negative; * -> vte; *で

@ id: polite
%continuative; * -> vmasu; *ます
v1contr;       *る -> vmasu; *ます

@ id: imperative
v1;    *る -> unc; *ろ
v1-s;  *る -> unc; *
v1contr;    *る -> unc; *ろ
vz;    *ずる -> unc; *じろ
vz;    *ずる -> unc; *ぜよ
v5aru; *る -> unc; *い
v5u;   *う -> unc; *え
v5u-s; *う -> unc; *え
v5r;   *る -> unc; *れ
v5r-i; *ある -> unc; *あれ
v5t;   *つ -> unc; *て
v5k;   *く -> unc; *け
v5k-s; *く -> unc; *け
v5g;   *ぐ -> unc; *げ
v5s;   *す -> unc; *せ
v5n;   *ぬ -> unc; *ね
v5b;   *ぶ -> unc; *べ
v5m;   *む -> unc; *め
vs-i;  *する -> unc; *しろ
vs-i;  *する -> unc; *せよ
vs-s;  *する -> unc; *しろ
vs-s;  *する -> unc; *せよ
vk;    *くる -> unc; *こい

@ id: imperative-formal
@ display: imperative (formal)
v1;    *る -> v5aru; *なさる
v1-s;  *る -> v5aru; *なさる
vz;    *ずる -> v5aru; *じなさる
v5aru; *る -> v5aru; *いなさる
v5u;   *う -> v5aru; *いなさる
v5u-s; *う -> v5aru; *いなさる
v5r;   *る -> v5aru; *りなさる
v5r-i; *ある -> v5aru; *ありなさる
v5t;   *つ -> v5aru; *ちなさる
v5k;   *く -> v5aru; *きなさる
v5k-s; *く -> v5aru; *きなさる
v5g;   *ぐ -> v5aru; *ぎなさる
v5s;   *す -> v5aru; *しなさる
v5n;   *ぬ -> v5aru; *になさる
v5b;   *ぶ -> v5aru; *びなさる
v5m;   *む -> v5aru; *みなさる
vs-i;  *する -> v5aru; *しなさる
vs-s;  *する -> v5aru; *しなさる
vk;    *くる -> v5aru; *こなさる

@ id: imperative-formal-contracted
@ display: imperative (formal, contracted)
v1;    *る -> unc; *な
v1-s;  *る -> unc; *な
vz;    *ずる -> unc; *じな
v5aru; *る -> unc; *いな
v5u;   *う -> unc; *いな
v5u-s; *う -> unc; *いな
v5r;   *る -> unc; *りな
v5r-i; *ある -> unc; *ありな
v5t;   *つ -> unc; *ちな
v5k;   *く -> unc; *きな
v5k-s; *く -> unc; *きな
v5g;   *ぐ -> unc; *ぎな
v5s;   *す -> unc; *しな
v5n;   *ぬ -> unc; *にな
v5b;   *ぶ -> unc; *びな
v5m;   *む -> unc; *みな
vs-i;  *する -> unc; *しな
vs-s;  *する -> unc; *しな
vk;    *くる -> unc; *こな

@ id: negative-imperative
@ display: negative imperative
%verb-identity; * -> unc; *な

@ id: request
vmasu; *ます -> unc; *ませ

@ id: volitional
v1;    *る -> unc; *よう
v1-s;  *る -> unc; *よう
vz;    *ずる -> unc; *じよう
v5aru; *る -> unc; *ろう
v5u;   *う -> unc; *おう
v5u-s; *う -> unc; *おう
v5r;   *る -> unc; *ろう
v5r-i; *ある -> unc; *あろう
v5t;   *つ -> unc; *とう
v5k;   *く -> unc; *こう
v5k-s; *く -> unc; *こう
v5g;   *ぐ -> unc; *ごう
v5s;   *す -> unc; *そう
v5n;   *ぬ -> unc; *のう
v5b;   *ぶ -> unc; *ぼう
v5m;   *む -> unc; *もう
vs-i;  *する -> unc; *しよう
vs-s;  *する -> unc; *しよう
vk;    *くる -> unc; *こよう
vmasu; *ます -> unc; *ましょう

@ id: negative-volitional
@ display: negative volitional (literary)
%verb-identity; * -> unc; *まい
vmasuneg; *ません -> unc; *ませんまい

@ id: potential
@ ref: https://www.edrdg.org/wwwjdic/wwwverbinf.html#suru_tag
v1;      *る -> v1; *られる
v1-s;    *る -> v1; *られる
vz;      *ずる -> v1; *じられる
vz;      *ずる -> v1; *ぜられる
v5aru;   *る -> v1; *れる
v5u;     *う -> v1; *える
v5u-s;   *う -> v1; *える
v5r;     *る -> v1; *れる
v5r-i;   *ある -> v1; *あれる
v5t;     *つ -> v1; *てる
v5k;     *く -> v1; *ける
v5k-s;   *く -> v1; *ける
v5g;     *ぐ -> v1; *げる
v5s;     *す -> v1; *せる
v5n;     *ぬ -> v1; *ねる
v5b;     *ぶ -> v1; *べる
v5m;     *む -> v1; *める
vs-i;    *する -> v1; *できる
vs-s;    *する -> v1; *できる
vk;      *くる -> v1; *こられる

@ id: potential-irregular
@ display: potential (irregular)
v1;   *る -> v1; *れる
v1-s; *る -> v1; *れる
vk;   *くる -> v1; *これる

@ id: potential-eru
@ display: potential (aux. 得る)
%continuative; * -> v1; *える
%continuative; * -> v-unspec; *うる

@ id: causative
v1;    *る -> v1; *させる
v1-s;  *る -> v1; *させる
vz;    *ずる -> v1; *じさせる
v5aru; *る -> v1; *らせる
v5u;   *う -> v1; *わせる
v5u-s; *う -> v1; *わせる
v5r;   *る -> v1; *らせる
v5r-i; *ある -> v1; *あらせる
v5t;   *つ -> v1; *たせる
v5k;   *く -> v1; *かせる
v5k-s; *く -> v1; *かせる
v5g;   *ぐ -> v1; *がせる
v5s;   *す -> v1; *させる
v5n;   *ぬ -> v1; *なせる
v5b;   *ぶ -> v1; *ばせる
v5m;   *む -> v1; *ませる
vs-i;  *する -> v1; *させる
vs-s;  *する -> v1; *させる
vk;    *くる -> v1; *こさせる

@ id: causative-contracted
@ display: causative (contracted)
v1;    *る -> v5s; *さす
v1-s;  *る -> v5s; *さす
vz;    *ずる -> v5s; *じさす
v5aru; *る -> v5s; *らす
v5u;   *う -> v5s; *わす
v5u-s; *う -> v5s; *わす
v5r;   *る -> v5s; *らす
v5r-i; *ある -> v5s; *あらす
v5t;   *つ -> v5s; *たす
v5k;   *く -> v5s; *かす
v5k-s; *く -> v5s; *かす
v5g;   *ぐ -> v5s; *がす
v5s;   *す -> v5s; *さす
v5n;   *ぬ -> v5s; *なす
v5b;   *ぶ -> v5s; *ばす
v5m;   *む -> v5s; *ます
vs-i;  *する -> v5s; *さす
vs-s;  *する -> v5s; *さす
vk;    *くる -> v5s; *こさす

@ id: passive
v1;    *る -> v1; *られる
v1-s;  *る -> v1; *られる
vz;    *ずる -> v1; *じられる
vz;    *ずる -> v1; *ぜられる
v5aru; *る -> v1; *られる
v5u;   *う -> v1; *われる
v5u-s; *う -> v1; *われる
v5r;   *る -> v1; *られる
v5r-i; *ある -> v1; *あられる
v5t;   *つ -> v1; *たれる
v5k;   *く -> v1; *かれる
v5k-s; *く -> v1; *かれる
v5g;   *ぐ -> v1; *がれる
v5s;   *す -> v1; *される
v5n;   *ぬ -> v1; *なれる
v5b;   *ぶ -> v1; *ばれる
v5m;   *む -> v1; *まれる
vs-i;  *する -> v1; *される
vs-s;  *する -> v1; *される
vk;    *くる -> v1; *こられる

@ id: causative-passive-contracted
@ display: causative-passive (contracted)
v5aru; *る -> v1; *らされる
v5u;   *う -> v1; *わされる
v5u-s; *う -> v1; *わされる
v5r;   *る -> v1; *らされる
v5r-i; *ある -> v1; *あらされる
v5t;   *つ -> v1; *たされる
v5k;   *く -> v1; *かされる
v5k-s; *く -> v1; *かされる
v5g;   *ぐ -> v1; *がされる
v5n;   *ぬ -> v1; *なされる
v5b;   *ぶ -> v1; *ばされる
v5m;   *む -> v1; *まされる

@ id: conditional
%past; * -> unc; *ら

@ id: alternative
%past; * -> unc; *り

@ id: provisional
v1;     *る -> unc; *れば
v1-s;   *る -> unc; *れば
vz;     *ずる -> unc; *れば
v5aru;  *る -> unc; *れば
v5u;    *う -> unc; *えば
v5u-s;  *う -> unc; *えば
v5r;    *る -> unc; *れば
v5r-i;  *ある -> unc; *あれば
v5t;    *つ -> unc; *てば
v5k;    *く -> unc; *けば
v5k-s;  *く -> unc; *けば
v5g;    *ぐ -> unc; *げば
v5s;    *す -> unc; *せば
v5n;    *ぬ -> unc; *ねば
v5b;    *ぶ -> unc; *べば
v5m;    *む -> unc; *めば
vs-i;   *する -> unc; *すれば
vs-s;   *する -> unc; *すれば
vk;     *くる -> unc; *くれば
adj-na; * -> unc; *であれば
adj-i;  *い -> unc; *ければ
adj-ix; *いい -> unc; *よければ

@ id: provisional-contracted
@ display: provisional (contracted)
adj-i; *い -> unc; *きゃ

@ id: want-to-do
%continuative; * -> adj-i; *たい

@ id: attributive-archaic-ru
@ display: attributive form (archaic)
@ ref: https://japanese.stackexchange.com/a/2480
@ ref: https://japanese.stackexchange.com/a/5004
v4k; *く -> unc; *くる
v4g; *ぐ -> unc; *ぐる
v4s; *す -> unc; *する
v4t; *つ -> unc; *つる
v4n; *ぬ -> unc; *ぬる
v4b; *ぶ -> unc; *ぶる
v4m; *む -> unc; *むる
v4h; *ふ -> unc; *ふる
v4r; *る -> unc; *るる
vn; *ぬ -> unc; *ぬる

@ id: past-archaic-ki
@ display: past (archaic)
@ ref: https://en.wiktionary.org/wiki/き#Suffix
%continuative; * -> unc; *き
vs-i; *する -> !
vs-i; *する -> unc; *しき
vs-s; *する -> !
vs-s; *する -> unc; *しき
vk;   *くる -> !

@ id: past-archaic-ki-attributive
@ display: past attributive form (archaic)
@ ref: https://en.wiktionary.org/wiki/き#Suffix
%continuative; * -> unc; *し
adj-i; *い -> unc; *し
vs-i; *する -> !
vs-i; *する -> unc; *せし
vs-s; *する -> !
vs-s; *する -> unc; *せし
vk;   *くる -> !
vk;   *くる -> unc; *こし

@ id: past-archaic-keri
@ display: past (archaic)
@ ref: https://en.wiktionary.org/wiki/けり#Japanese
%continuative; * -> unc; *けり

@ id: aux-iru
@ display: aux. いる
~conjunctive; * -> v1; *いる

@ id: aux-iru-contracted
@ display: aux. いる (contracted)
~conjunctive; * -> v1contr; *る

@ id: aux-iru-contracted-n
@ display: aux. いる (contracted)
~conjunctive; * -> unc; *ん

@ id: tewa-contracted
@ display: は particle (contracted)
unc; *て -> unc; *ちゃ

@ id: aux-aru
@ display: aux. ある
~conjunctive; * -> v5r; *ある

@ id: aux-iku
@ display: aux. いく
~conjunctive; * -> v5k-s; *いく

@ id: aux-kuru
@ display: aux. くる
~conjunctive; * -> vk; *くる

@ id: aux-oku
@ display: aux. おく
~conjunctive; * -> v5k; *おく

@ id: aux-oru
@ display: aux. おる
~conjunctive; * -> v5r; *おる

@ id: aux-miru
@ display: aux. みる
~conjunctive; * -> v1; *みる

@ id: aux-kureru
@ display: aux. くれる
~conjunctive; * -> v1-s; *くれる

@ id: aux-ageru
@ display: aux. あげる
~conjunctive; * -> v1; *あげる

@ id: aux-morau
@ display: aux. もらう
~conjunctive; * -> v5u; *もらう

@ id: aux-itadaku
@ display: aux. いただく
~conjunctive; * -> v5k; *いただく

@ id: aux-yaru
@ display: aux. やる
~conjunctive; * -> v5r; *やる

@ id: aux-kudasaru
@ display: aux. くださる
~conjunctive; * -> v5aru; *くださる
~conjunctive; * -> v5aru; *下さる

@ id: aux-hoshii
@ display: aux. ほしい
~conjunctive; * -> adj-i; *ほしい
~conjunctive; * -> adj-i; *欲しい

@ id: aux-oku-contracted
@ display: aux. おく (contracted)
~conjunctive; *て -> v5k; *とく
~conjunctive; *で -> v5k; *どく

@ id: aux-oru-contracted
@ display: aux. おる (contracted)
~conjunctive; *て -> v5r; *とる
~conjunctive; *で -> v5r; *どる

@ id: aux-shimau
@ display: aux. しまう
~conjunctive; * -> v5u; *しまう

@ id: aux-shimau-contracted
@ display: aux. しまう (contracted)
~conjunctive; *て -> v5u; *ちゃう
~conjunctive; *で -> v5u; *じゃう
~conjunctive; *て -> v5u; *ちまう
~conjunctive; *で -> v5u; *じまう

@ id: aux-wa-particle
@ display: は particle (contracted)
~conjunctive; *て -> unc; *ちゃ
~conjunctive; *で -> unc; *じゃ

@ id: aux-nagara
@ display: aux. ながら
%continuative; * -> unc; *ながら


@ id: adverbial
@ display: adverbial form
adj-i;  *い -> adv; *く
adj-ix; *いい -> adv; *よく
adj-na; * -> adv; *に

@ id: nominal
@ display: nominal form
adj-i;  *い -> n; *さ
adj-ix; *いい -> n; *よさ
adj-na; * -> n; *さ

@ id: aux-sou
@ display: aux. そう
adj-i;  *い -> adj-na; *そう
adj-i;  *よい -> adj-na; *よさそう
adj-ix; *いい -> adj-na; *よさそう
adj-na; * -> adj-na; *そう

@ id: aux-negative-sou
@ display: negative aux. そう
adj-i; *い -> adj-na; *くなさそう

@ id: aux-sugiru
@ display: aux. すぎる
adj-i;  *い -> v1; *すぎる
adj-ix; *いい -> v1; *よすぎる
adj-na; * -> v1; *すぎる

@ id: aux-garu
@ display: aux. がる
adj-i;  *い -> v5r; *がる
adj-ix; *いい -> v5r; *よがる
adj-na; * -> v5r; *がる

@ id: attributive-archaic
@ display: attributive form (archaic)
adj-i;  *い -> adj-f; *き
adj-ix; *いい -> adj-f; *よき


@ id: attributive
@ display: attributive form
adj-na; * -> unc; *な
adj-t; * -> v5r; *たる


@ id: aux-naru
@ display: to become
adv; * -> v5r; *なる


@ id: adverb-to
@ display: と particle
adv-to; * -> unc; *と
`