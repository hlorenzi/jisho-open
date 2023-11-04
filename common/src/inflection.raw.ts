export const raw =
`
# @ group-identifier
# source-category; source-pattern -> target-category; target-pattern

@ id: masu-stem
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
vs-s;    *為る -> n; *為
vk;      *くる -> n; *き
vk;      *来る -> n; *来

@ id: te-form-stem-unvoiced
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
vs-s;    *為る -> unc; *為
vk;      *くる -> unc; *き
vk;      *来る -> unc; *来
vmasu;   *ます -> unc; *まし

@ id: te-form-stem-voiced
@ hidden
v5g;     *ぐ -> unc; *い
v5n;     *ぬ -> unc; *ん
v5b;     *ぶ -> unc; *ん
v5m;     *む -> unc; *ん

@ id: te-form
%te-form-stem-unvoiced; * -> vte; *て
%te-form-stem-voiced;   * -> vte; *で

@ id: past
%te-form-stem-unvoiced; * -> unc; *た
%te-form-stem-voiced;   * -> unc; *だ

@ id: negative-stem
@ hidden
v1;      *る -> unc; *
v1-s;    *る -> unc; *
vz;      *ずる -> unc; *じ
v5aru;   *る -> unc; *ら
v5u;     *う -> unc; *わ
v5u-s;   *う -> unc; *わ
v5r;     *る -> unc; *ら
v5r-i;   *ある -> unc; *
v5t;     *つ -> unc; *た
v5k;     *く -> unc; *か
v5k-s;   *く -> unc; *か
v5g;     *ぐ -> unc; *が
v5s;     *す -> unc; *さ
v5n;     *ぬ -> unc; *な
v5b;     *ぶ -> unc; *ば
v5m;     *む -> unc; *ま
vs-i;    *する -> unc; *し
vs-i;    *為る -> unc; *為
vs-s;    *する -> unc; *し
vs-s;    *為る -> unc; *為
vk;      *くる -> unc; *こ
vk;      *来る -> unc; *来

@ id: negative-classical-stem
@ hidden
%negative-stem; * -> unc; *
vz;      *ずる -> unc; *ぜ
vs-i;    *する -> unc; *せ
vs-i;    *為る -> unc; *為

@ id: negative
%negative-stem; * -> adj-i; *ない
v1contr;        *る -> adj-i; *ない
vmasu;          *ます -> unc; *ません

@ id: negative-classical
%negative-classical-stem; * -> unc; *ぬ

@ id: negative-continuative
%negative-classical-stem; * -> unc; *ず

@ id: negative-dialectal
%negative-stem; * -> unc; *へん

@ id: polite
%masu-stem; * -> vmasu; *ます
v1contr; *る -> vmasu; *ます

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
v5n; *ぬ -> unc; *ぬる
`