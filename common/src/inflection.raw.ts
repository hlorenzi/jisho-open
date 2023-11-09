export const raw =
`
# @ group-identifier
# source-category; source-pattern -> target-category; target-pattern

@ id: identity
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
vs-i;  *為る -> unc; *為る
vs-s;  *する -> unc; *する
vk;    *くる -> unc; *くる
vk;    *来る -> unc; *来る

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
vs-i;    *為る -> n; *為
vs-s;    *する -> n; *し
vk;      *くる -> n; *き
vk;      *来る -> n; *来

@ id: verb-form
@ display: verb form
vs; * -> vs-i; *する
vs; * -> vs-i; *為る

@ id: conjunctive-stem-unvoiced
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
vs-i;    *為る -> unc; *為
vs-s;    *する -> unc; *し
vk;      *くる -> unc; *き
vk;      *来る -> unc; *来
vmasu;   *ます -> unc; *まし

@ id: conjunctive-stem-voiced
@ hidden
v5g; *ぐ -> unc; *い
v5n; *ぬ -> unc; *ん
v5b; *ぶ -> unc; *ん
v5m; *む -> unc; *ん

@ id: conjunctive
%conjunctive-stem-unvoiced; * -> vte; *て
%conjunctive-stem-voiced;   * -> vte; *で

@ id: past
%conjunctive-stem-unvoiced; * -> unc; *た
%conjunctive-stem-voiced;   * -> unc; *だ

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
vs-i;  *為る -> unc; *為
vs-s;  *する -> unc; *し
vk;    *くる -> unc; *こ
vk;    *来る -> unc; *来

@ id: negative-classical-stem
@ hidden
%negative-stem; * -> unc; *
vz;   ! -> unc; *
vz;   *ずる -> unc; *ぜ
vs-i; ! -> unc; *
vs-i; *する -> unc; *せ
vs-i; *為る -> unc; *為

@ id: negative
%negative-stem; * -> adj-i; *ない
v1contr;        *る -> adj-i; *ない
vmasu;          *ます -> unc; *ません

@ id: negative-past
@ display: negative past
vmasu; *ます -> unc; *ませんでした

@ id: negative-contracted
@ display: negative (contracted)
%negative-classical-stem; * -> unc; *ん
# ある -> あらん (?)

@ id: negative-dialectal
%negative-stem; * -> unc; *へん

@ id: negative-classical
%negative-classical-stem; * -> unc; *ぬ

@ id: negative-continuative
%negative-classical-stem; * -> unc; *ず

@ id: negative-archaic-literary
@ display: negative (archaic literary)
%negative-classical-stem; * -> unc; *ざる
%negative-classical-stem; * -> unc; *ざり

@ id: conjunctive-negative
@ display: conjunctive negative
%negative; * -> vte; *で

@ id: polite
%continuative; * -> vmasu; *ます
v1contr; *る -> vmasu; *ます

@ id: imperative
v1;    *る -> unc; *ろ
v1-s;  *る -> unc; *
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
vs-i;  *為る -> unc; *為ろ
vs-s;  *する -> unc; *しろ
vk;    *くる -> unc; *こい
vk;    *来る -> unc; *来い

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
vs-i;  *為る -> v5aru; *為なさる
vs-s;  *する -> v5aru; *しなさる
vk;    *くる -> v5aru; *こなさる
vk;    *来る -> v5aru; *来なさる

@ id: negative-imperative
@ display: negative imperative
%identity; * -> unc; *な

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
vs-i;  *為る -> unc; *為よう
vs-s;  *する -> unc; *しよう
vk;    *くる -> unc; *こよう
vk;    *来る -> unc; *来よう
vmasu; *ます -> unc; *ましょう

@ id: potential
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
vs-i;    *為る -> v1; *できる
vs-s;    *する -> v1; *しえる
vs-s;    *する -> v-unspec; *しうる
vk;      *くる -> v1; *こられる
vk;      *来る -> v1; *来られる

@ id: potential-irregular
@ display: potential (irregular)
v1;   *る -> v1; *れる
v1-s; *る -> v1; *れる

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
vs-i;  *為る -> v1; *為せる
vs-s;  *する -> v1; *すせる
vk;    *くる -> v1; *こさせる
vk;    *来る -> v1; *来させる

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
vs-i;  *為る -> v5s; *為す
vs-s;  *する -> v5s; *すす
vk;    *くる -> v5s; *こさす
vk;    *来る -> v5s; *来さす

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
vs-i;  *為る -> v1; *為れる
vs-s;  *する -> v1; *すれる
vk;    *くる -> v1; *こられる
vk;    *来る -> v1; *来られる

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
v1;    *る -> unc; *れば
v1-s;  *る -> unc; *れば
vz;    *ずる -> unc; *れば
v5aru; *る -> unc; *れば
v5u;   *う -> unc; *えば
v5u-s; *う -> unc; *えば
v5r;   *る -> unc; *れば
v5r-i; *ある -> unc; *あれば
v5t;   *つ -> unc; *てば
v5k;   *く -> unc; *けば
v5k-s; *く -> unc; *けば
v5g;   *ぐ -> unc; *げば
v5s;   *す -> unc; *せば
v5n;   *ぬ -> unc; *ねば
v5b;   *ぶ -> unc; *べば
v5m;   *む -> unc; *めば
vs-i;  *する -> unc; *すれば
vs-i;  *為る -> unc; *為れば
vs-s;  *する -> unc; *すれば
vk;    *くる -> unc; *くれば
vk;    *来る -> unc; *来れば

@ id: want-to-do
%continuative; * -> adj-i; *たい

@ id: aux-iru
@ display: aux. いる
vte; *て -> v1; *ている
vte; *で -> v1; *でいる

@ id: aux-iru-contracted
@ display: aux. いる (contracted)
vte; *て -> v1contr; *てる
vte; *で -> v1contr; *でる

@ id: classical-attributive
@ display: classical attributive
@ ref: https://japanese.stackexchange.com/a/5004
vn; *ぬ -> unc; *ぬる
`