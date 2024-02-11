import * as Api from "common/api/index.ts"


let cacheKeiseiPhonetic: Map<string, string[]> | null = null
let cacheKeiseiSemantic: Map<string, string[]> | null = null


export function get(
    kanji: string)
    : Api.Kanji.StructuralCategory | undefined
{
    const kanjiData = data[kanji]
    if (!kanjiData)
        return undefined

    return kanjiData
}


export function getKeiseiPhoneticUsage(
    kanji: string)
    : string[] | undefined
{
    if (cacheKeiseiPhonetic === null)
    {
        cacheKeiseiPhonetic = new Map()

        for (const [k, structCat] of Object.entries(data))
        {
            if (structCat.type !== "keisei")
                continue

            const usage = cacheKeiseiPhonetic.get(structCat.phonetic) ?? []
            usage.push(k)
            cacheKeiseiPhonetic.set(structCat.phonetic, usage)
        }
    }

    return cacheKeiseiPhonetic.get(kanji)
}


export function getKeiseiSemanticUsage(
    kanji: string)
    : string[] | undefined
{
    if (cacheKeiseiSemantic === null)
    {
        cacheKeiseiSemantic = new Map()

        for (const [k, structCat] of Object.entries(data))
        {
            if (structCat.type !== "keisei")
                continue

            const usage = cacheKeiseiSemantic.get(structCat.semantic) ?? []
            usage.push(k)
            cacheKeiseiSemantic.set(structCat.semantic, usage)
        }
    }

    return cacheKeiseiSemantic.get(kanji)
}


export function clearCache()
{
    cacheKeiseiPhonetic = null
    cacheKeiseiSemantic = null
}


const data: Record<string, Api.Kanji.StructuralCategory> = {
    "一": {
        "type": "shiji"
    },
    "九": {
        "type": "shiji"
    },
    "七": {
        "type": "shiji"
    },
    "二": {
        "type": "shiji"
    },
    "人": {
        "type": "shoukei"
    },
    "入": {
        "type": "shiji"
    },
    "八": {
        "type": "shiji"
    },
    "力": {
        "type": "shoukei"
    },
    "十": {
        "type": "shiji"
    },
    "下": {
        "type": "shiji"
    },
    "三": {
        "type": "shiji"
    },
    "千": {
        "type": "kaii"
    },
    "上": {
        "type": "shiji"
    },
    "口": {
        "type": "shoukei"
    },
    "土": {
        "type": "shoukei"
    },
    "夕": {
        "type": "shoukei"
    },
    "大": {
        "type": "shoukei"
    },
    "女": {
        "type": "shoukei"
    },
    "子": {
        "type": "shoukei"
    },
    "小": {
        "type": "shoukei"
    },
    "山": {
        "type": "shoukei"
    },
    "川": {
        "type": "shoukei"
    },
    "五": {
        "type": "shiji"
    },
    "天": {
        "type": "shoukei"
    },
    "中": {
        "type": "unknown"
    },
    "六": {
        "type": "shiji"
    },
    "円": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "員"
    },
    "手": {
        "type": "shoukei"
    },
    "文": {
        "type": "shoukei"
    },
    "日": {
        "type": "shoukei"
    },
    "月": {
        "type": "shoukei"
    },
    "木": {
        "type": "shoukei"
    },
    "水": {
        "type": "shoukei"
    },
    "火": {
        "type": "shoukei"
    },
    "犬": {
        "type": "shoukei"
    },
    "王": {
        "type": "shoukei"
    },
    "正": {
        "type": "kaii"
    },
    "出": {
        "type": "kaii"
    },
    "本": {
        "type": "shoukei"
    },
    "右": {
        "type": "kaii"
    },
    "四": {
        "type": "shiji"
    },
    "左": {
        "type": "kaii"
    },
    "玉": {
        "type": "shoukei"
    },
    "生": {
        "type": "shoukei"
    },
    "田": {
        "type": "shoukei"
    },
    "白": {
        "type": "unknown"
    },
    "目": {
        "type": "shoukei"
    },
    "石": {
        "type": "shoukei"
    },
    "立": {
        "type": "kaii"
    },
    "百": {
        "type": "kaii"
    },
    "年": {
        "type": "kaii"
    },
    "休": {
        "type": "kaii"
    },
    "先": {
        "type": "kaii"
    },
    "名": {
        "type": "kaii"
    },
    "字": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "子"
    },
    "早": {
        "type": "unknown"
    },
    "気": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "气"
    },
    "竹": {
        "type": "shoukei"
    },
    "糸": {
        "type": "shoukei"
    },
    "耳": {
        "type": "shoukei"
    },
    "虫": {
        "type": "shoukei"
    },
    "村": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "寸"
    },
    "男": {
        "type": "kaii"
    },
    "町": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "丁"
    },
    "花": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "化"
    },
    "見": {
        "type": "kaii"
    },
    "貝": {
        "type": "shoukei"
    },
    "赤": {
        "type": "kaii"
    },
    "足": {
        "type": "shoukei"
    },
    "車": {
        "type": "shoukei"
    },
    "学": {
        "type": "kaii"
    },
    "林": {
        "type": "kaii"
    },
    "空": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "工"
    },
    "金": {
        "type": "unknown"
    },
    "雨": {
        "type": "shoukei"
    },
    "青": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "生"
    },
    "草": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "早"
    },
    "音": {
        "type": "kaii"
    },
    "校": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "交"
    },
    "森": {
        "type": "kaii"
    },
    "刀": {
        "type": "shoukei"
    },
    "万": {
        "type": "derivative"
    },
    "丸": {
        "type": "shoukei"
    },
    "才": {
        "type": "unknown"
    },
    "工": {
        "type": "shoukei"
    },
    "弓": {
        "type": "shoukei"
    },
    "内": {
        "type": "shoukei"
    },
    "午": {
        "type": "shoukei"
    },
    "少": {
        "type": "unknown"
    },
    "元": {
        "type": "unknown"
    },
    "今": {
        "type": "kaii"
    },
    "公": {
        "type": "unknown"
    },
    "分": {
        "type": "kaii"
    },
    "切": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "七"
    },
    "友": {
        "type": "kaii"
    },
    "太": {
        "type": "unknown"
    },
    "引": {
        "type": "kaii"
    },
    "心": {
        "type": "shoukei"
    },
    "戸": {
        "type": "shoukei"
    },
    "方": {
        "type": "shoukei"
    },
    "止": {
        "type": "shoukei"
    },
    "毛": {
        "type": "shoukei"
    },
    "父": {
        "type": "kaii"
    },
    "牛": {
        "type": "shoukei"
    },
    "半": {
        "type": "kaii"
    },
    "市": {
        "type": "unknown"
    },
    "北": {
        "type": "unknown"
    },
    "古": {
        "type": "unknown"
    },
    "台": {
        "type": "kaii"
    },
    "兄": {
        "type": "kaii"
    },
    "冬": {
        "type": "shoukei"
    },
    "外": {
        "type": "kaii"
    },
    "広": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "黄"
    },
    "母": {
        "type": "shoukei"
    },
    "用": {
        "type": "shoukei"
    },
    "矢": {
        "type": "shoukei"
    },
    "交": {
        "type": "shoukei"
    },
    "会": {
        "type": "kaii"
    },
    "合": {
        "type": "kaii"
    },
    "同": {
        "type": "kaii"
    },
    "回": {
        "type": "shoukei"
    },
    "寺": {
        "type": "unknown"
    },
    "地": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "也"
    },
    "多": {
        "type": "kaii"
    },
    "光": {
        "type": "kaii"
    },
    "当": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "尚"
    },
    "毎": {
        "type": "shoukei"
    },
    "池": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "也"
    },
    "米": {
        "type": "shoukei"
    },
    "羽": {
        "type": "shoukei"
    },
    "考": {
        "type": "keisei",
        "semantic": "⺹",
        "phonetic": "丂"
    },
    "肉": {
        "type": "shoukei"
    },
    "自": {
        "type": "shoukei"
    },
    "色": {
        "type": "kaii"
    },
    "行": {
        "type": "shoukei"
    },
    "西": {
        "type": "shoukei"
    },
    "来": {
        "type": "shoukei"
    },
    "何": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "可"
    },
    "作": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "乍"
    },
    "体": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "豊"
    },
    "弟": {
        "type": "shoukei"
    },
    "図": {
        "type": "kaii"
    },
    "声": {
        "type": "unknown"
    },
    "売": {
        "type": "kaii"
    },
    "形": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "开"
    },
    "汽": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "气"
    },
    "社": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "土"
    },
    "角": {
        "type": "shoukei"
    },
    "言": {
        "type": "unknown"
    },
    "谷": {
        "type": "unknown"
    },
    "走": {
        "type": "unknown"
    },
    "近": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "斤"
    },
    "里": {
        "type": "kaii"
    },
    "麦": {
        "type": "kaii"
    },
    "画": {
        "type": "kaii"
    },
    "東": {
        "type": "rebus"
    },
    "京": {
        "type": "shoukei"
    },
    "夜": {
        "type": "unknown"
    },
    "直": {
        "type": "unknown"
    },
    "国": {
        "type": "kaii"
    },
    "姉": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "𠂔"
    },
    "妹": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "未"
    },
    "岩": {
        "type": "kaii"
    },
    "店": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "占"
    },
    "明": {
        "type": "kaii"
    },
    "歩": {
        "type": "unknown"
    },
    "知": {
        "type": "kaii"
    },
    "長": {
        "type": "shoukei"
    },
    "門": {
        "type": "shoukei"
    },
    "昼": {
        "type": "kaii"
    },
    "前": {
        "type": "kaii"
    },
    "南": {
        "type": "rebus"
    },
    "点": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "占"
    },
    "室": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "至"
    },
    "後": {
        "type": "unknown"
    },
    "春": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "屯"
    },
    "星": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "生"
    },
    "海": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "毎"
    },
    "活": {
        "type": "unknown"
    },
    "思": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "囟"
    },
    "科": {
        "type": "kaii"
    },
    "秋": {
        "type": "unknown"
    },
    "茶": {
        "type": "unknown"
    },
    "計": {
        "type": "kaii"
    },
    "風": {
        "type": "unknown"
    },
    "食": {
        "type": "unknown"
    },
    "首": {
        "type": "shoukei"
    },
    "夏": {
        "type": "shoukei"
    },
    "弱": {
        "type": "shoukei"
    },
    "原": {
        "type": "kaii"
    },
    "家": {
        "type": "derivative"
    },
    "帰": {
        "type": "kaii"
    },
    "時": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "寺"
    },
    "紙": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "氏"
    },
    "書": {
        "type": "keisei",
        "semantic": "聿",
        "phonetic": "者"
    },
    "記": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "己"
    },
    "通": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "甬"
    },
    "馬": {
        "type": "shoukei"
    },
    "高": {
        "type": "shoukei"
    },
    "強": {
        "type": "kaii"
    },
    "教": {
        "type": "kaii"
    },
    "理": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "里"
    },
    "細": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "囟"
    },
    "組": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "且"
    },
    "船": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "㕣"
    },
    "週": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "周"
    },
    "野": {
        "type": "keisei",
        "semantic": "里",
        "phonetic": "予"
    },
    "雪": {
        "type": "kaii"
    },
    "魚": {
        "type": "shoukei"
    },
    "鳥": {
        "type": "shoukei"
    },
    "黄": {
        "type": "shoukei"
    },
    "黒": {
        "type": "unknown"
    },
    "場": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "昜"
    },
    "晴": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "青"
    },
    "答": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "合"
    },
    "絵": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "会"
    },
    "買": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "貝"
    },
    "朝": {
        "type": "kaii"
    },
    "道": {
        "type": "unknown"
    },
    "番": {
        "type": "shoukei"
    },
    "間": {
        "type": "kaii"
    },
    "雲": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "云"
    },
    "園": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "袁"
    },
    "数": {
        "type": "unknown"
    },
    "新": {
        "type": "unknown"
    },
    "楽": {
        "type": "shoukei"
    },
    "話": {
        "type": "unknown"
    },
    "遠": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "袁"
    },
    "電": {
        "type": "kaii"
    },
    "鳴": {
        "type": "kaii"
    },
    "歌": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "哥"
    },
    "算": {
        "type": "unknown"
    },
    "語": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "吾"
    },
    "読": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "売"
    },
    "聞": {
        "type": "keisei",
        "semantic": "耳",
        "phonetic": "門"
    },
    "線": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "泉"
    },
    "親": {
        "type": "keisei",
        "semantic": "見",
        "phonetic": "亲"
    },
    "頭": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "豆"
    },
    "曜": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "翟"
    },
    "顔": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "彦"
    },
    "丁": {
        "type": "shoukei"
    },
    "予": {
        "type": "unknown"
    },
    "化": {
        "type": "kaii"
    },
    "区": {
        "type": "kaii"
    },
    "反": {
        "type": "kaii"
    },
    "央": {
        "type": "unknown"
    },
    "平": {
        "type": "unknown"
    },
    "申": {
        "type": "shoukei"
    },
    "世": {
        "type": "shoukei"
    },
    "由": {
        "type": "shoukei"
    },
    "氷": {
        "type": "kaii"
    },
    "主": {
        "type": "shoukei"
    },
    "仕": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "士"
    },
    "他": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "也"
    },
    "代": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "弋"
    },
    "写": {
        "type": "shinjitai"
    },
    "号": {
        "type": "unknown"
    },
    "去": {
        "type": "unknown"
    },
    "打": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "丁"
    },
    "皮": {
        "type": "shoukei"
    },
    "皿": {
        "type": "shoukei"
    },
    "礼": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "豊"
    },
    "両": {
        "type": "unknown"
    },
    "曲": {
        "type": "shoukei"
    },
    "向": {
        "type": "unknown"
    },
    "州": {
        "type": "shoukei"
    },
    "全": {
        "type": "shoukei"
    },
    "次": {
        "type": "unknown"
    },
    "安": {
        "type": "kaii"
    },
    "守": {
        "type": "kaii"
    },
    "式": {
        "type": "keisei",
        "semantic": "工",
        "phonetic": "弋"
    },
    "死": {
        "type": "kaii"
    },
    "列": {
        "type": "kaii"
    },
    "羊": {
        "type": "shoukei"
    },
    "有": {
        "type": "kaii"
    },
    "血": {
        "type": "shoukei"
    },
    "住": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "主"
    },
    "助": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "且"
    },
    "医": {
        "type": "kaii"
    },
    "君": {
        "type": "kaii"
    },
    "坂": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "反"
    },
    "局": {
        "type": "unknown"
    },
    "役": {
        "type": "kaii"
    },
    "投": {
        "type": "kaii"
    },
    "対": {
        "type": "kaii"
    },
    "決": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "夬"
    },
    "究": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "九"
    },
    "豆": {
        "type": "shoukei"
    },
    "身": {
        "type": "shiji"
    },
    "返": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "反"
    },
    "表": {
        "type": "kaii"
    },
    "事": {
        "type": "unknown"
    },
    "育": {
        "type": "kaii"
    },
    "使": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "史"
    },
    "命": {
        "type": "kaii"
    },
    "味": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "未"
    },
    "幸": {
        "type": "shoukei"
    },
    "始": {
        "type": "unknown"
    },
    "実": {
        "type": "kaii"
    },
    "定": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "正"
    },
    "岸": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "干"
    },
    "所": {
        "type": "keisei",
        "semantic": "斤",
        "phonetic": "戸"
    },
    "放": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "方"
    },
    "昔": {
        "type": "kaii"
    },
    "板": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "反"
    },
    "泳": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "永"
    },
    "注": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "主"
    },
    "波": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "皮"
    },
    "油": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "由"
    },
    "受": {
        "type": "kaii"
    },
    "物": {
        "type": "keisei",
        "semantic": "牛",
        "phonetic": "勿"
    },
    "具": {
        "type": "kaii"
    },
    "委": {
        "type": "unknown"
    },
    "和": {
        "type": "unknown"
    },
    "者": {
        "type": "unknown"
    },
    "取": {
        "type": "kaii"
    },
    "服": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "𠬝"
    },
    "苦": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "古"
    },
    "重": {
        "type": "unknown"
    },
    "乗": {
        "type": "unknown"
    },
    "係": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "系"
    },
    "品": {
        "type": "kaii"
    },
    "客": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "各"
    },
    "県": {
        "type": "kaii"
    },
    "屋": {
        "type": "kaii"
    },
    "炭": {
        "type": "unknown"
    },
    "度": {
        "type": "unknown"
    },
    "待": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "寺"
    },
    "急": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "及"
    },
    "指": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "旨"
    },
    "持": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "寺"
    },
    "拾": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "合"
    },
    "昭": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "召"
    },
    "相": {
        "type": "kaii"
    },
    "柱": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "主"
    },
    "洋": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "羊"
    },
    "畑": {
        "type": "kokuji"
    },
    "界": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "介"
    },
    "発": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "癶"
    },
    "研": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "开"
    },
    "神": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "申"
    },
    "秒": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "少"
    },
    "級": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "及"
    },
    "美": {
        "type": "kaii"
    },
    "負": {
        "type": "kaii"
    },
    "送": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "关"
    },
    "追": {
        "type": "unknown"
    },
    "面": {
        "type": "unknown"
    },
    "島": {
        "type": "kaii"
    },
    "勉": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "免"
    },
    "倍": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "咅"
    },
    "真": {
        "type": "unknown"
    },
    "員": {
        "type": "shiji"
    },
    "宮": {
        "type": "unknown"
    },
    "庫": {
        "type": "kaii"
    },
    "庭": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "廷"
    },
    "旅": {
        "type": "kaii"
    },
    "根": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "艮"
    },
    "酒": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "酉"
    },
    "消": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "肖"
    },
    "流": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "㐬"
    },
    "病": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "丙"
    },
    "息": {
        "type": "kaii"
    },
    "荷": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "何"
    },
    "起": {
        "type": "keisei",
        "semantic": "走",
        "phonetic": "己"
    },
    "速": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "束"
    },
    "配": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "己"
    },
    "院": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "奐"
    },
    "悪": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "亜"
    },
    "商": {
        "type": "keisei",
        "semantic": "丙",
        "phonetic": "章"
    },
    "動": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "重"
    },
    "宿": {
        "type": "unknown"
    },
    "帳": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "長"
    },
    "族": {
        "type": "kaii"
    },
    "深": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "罙"
    },
    "球": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "求"
    },
    "祭": {
        "type": "kaii"
    },
    "第": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "弟"
    },
    "笛": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "由"
    },
    "終": {
        "type": "unknown"
    },
    "習": {
        "type": "unknown"
    },
    "転": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "専"
    },
    "進": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "隼"
    },
    "都": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "者"
    },
    "部": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "咅"
    },
    "問": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "門"
    },
    "章": {
        "type": "unknown"
    },
    "寒": {
        "type": "kaii"
    },
    "暑": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "者"
    },
    "植": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "直"
    },
    "温": {
        "type": "unknown"
    },
    "湖": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "胡"
    },
    "港": {
        "type": "unknown"
    },
    "湯": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "昜"
    },
    "登": {
        "type": "keisei",
        "semantic": "癶",
        "phonetic": "豆"
    },
    "短": {
        "type": "keisei",
        "semantic": "矢",
        "phonetic": "豆"
    },
    "童": {
        "type": "unknown"
    },
    "等": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "寺"
    },
    "筆": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "聿"
    },
    "着": {
        "type": "keisei",
        "semantic": "羊",
        "phonetic": "者"
    },
    "期": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "其"
    },
    "勝": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "朕"
    },
    "葉": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "枼"
    },
    "落": {
        "type": "unknown"
    },
    "軽": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "圣"
    },
    "運": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "軍"
    },
    "遊": {
        "type": "unknown"
    },
    "開": {
        "type": "unknown"
    },
    "階": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "皆"
    },
    "陽": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "昜"
    },
    "集": {
        "type": "kaii"
    },
    "悲": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "非"
    },
    "飲": {
        "type": "kaii"
    },
    "歯": {
        "type": "keisei",
        "semantic": "齒",
        "phonetic": "止"
    },
    "業": {
        "type": "shoukei"
    },
    "感": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "咸"
    },
    "想": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "相"
    },
    "暗": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "音"
    },
    "漢": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "𦰩"
    },
    "福": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "畐"
    },
    "詩": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "寺"
    },
    "路": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "各"
    },
    "農": {
        "type": "kaii"
    },
    "鉄": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "失"
    },
    "意": {
        "type": "kaii"
    },
    "様": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "羕"
    },
    "緑": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "彔"
    },
    "練": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "柬"
    },
    "銀": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "艮"
    },
    "駅": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "睪"
    },
    "鼻": {
        "type": "unknown"
    },
    "横": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "黄"
    },
    "箱": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "相"
    },
    "談": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "炎"
    },
    "調": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "周"
    },
    "橋": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "喬"
    },
    "整": {
        "type": "keisei",
        "semantic": "敕",
        "phonetic": "正"
    },
    "薬": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "楽"
    },
    "館": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "官"
    },
    "題": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "是"
    },
    "士": {
        "type": "unknown"
    },
    "不": {
        "type": "shoukei"
    },
    "夫": {
        "type": "shoukei"
    },
    "欠": {
        "type": "unknown"
    },
    "氏": {
        "type": "unknown"
    },
    "民": {
        "type": "unknown"
    },
    "史": {
        "type": "kaii"
    },
    "必": {
        "type": "unknown"
    },
    "失": {
        "type": "unknown"
    },
    "包": {
        "type": "shoukei"
    },
    "末": {
        "type": "shiji"
    },
    "未": {
        "type": "shoukei"
    },
    "以": {
        "type": "unknown"
    },
    "付": {
        "type": "kaii"
    },
    "令": {
        "type": "kaii"
    },
    "加": {
        "type": "unknown"
    },
    "司": {
        "type": "kaii"
    },
    "功": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "工"
    },
    "札": {
        "type": "unknown"
    },
    "辺": {
        "type": "unknown"
    },
    "印": {
        "type": "kaii"
    },
    "争": {
        "type": "kaii"
    },
    "仲": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "中"
    },
    "伝": {
        "type": "unknown"
    },
    "共": {
        "type": "kaii"
    },
    "兆": {
        "type": "shoukei"
    },
    "各": {
        "type": "kaii"
    },
    "好": {
        "type": "kaii"
    },
    "成": {
        "type": "unknown"
    },
    "灯": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "登"
    },
    "老": {
        "type": "shoukei"
    },
    "衣": {
        "type": "shoukei"
    },
    "求": {
        "type": "shoukei"
    },
    "束": {
        "type": "kaii"
    },
    "兵": {
        "type": "kaii"
    },
    "位": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "立"
    },
    "低": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "氐"
    },
    "児": {
        "type": "shoukei"
    },
    "冷": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "令"
    },
    "別": {
        "type": "kaii"
    },
    "努": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "奴"
    },
    "労": {
        "type": "kaii"
    },
    "告": {
        "type": "unknown"
    },
    "囲": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "韋"
    },
    "完": {
        "type": "unknown"
    },
    "改": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "己"
    },
    "希": {
        "type": "shoukei"
    },
    "折": {
        "type": "kaii"
    },
    "材": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "才"
    },
    "利": {
        "type": "kaii"
    },
    "臣": {
        "type": "shoukei"
    },
    "良": {
        "type": "unknown"
    },
    "芸": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "埶"
    },
    "初": {
        "type": "kaii"
    },
    "果": {
        "type": "shoukei"
    },
    "刷": {
        "type": "unknown"
    },
    "卒": {
        "type": "unknown"
    },
    "念": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "今"
    },
    "例": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "列"
    },
    "典": {
        "type": "kaii"
    },
    "周": {
        "type": "unknown"
    },
    "協": {
        "type": "keisei",
        "semantic": "十",
        "phonetic": "劦"
    },
    "参": {
        "type": "unknown"
    },
    "固": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "古"
    },
    "官": {
        "type": "kaii"
    },
    "底": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "氐"
    },
    "府": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "付"
    },
    "径": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "圣"
    },
    "松": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "公"
    },
    "毒": {
        "type": "kaii"
    },
    "泣": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "立"
    },
    "治": {
        "type": "unknown"
    },
    "法": {
        "type": "kaii"
    },
    "牧": {
        "type": "kaii"
    },
    "的": {
        "type": "keisei",
        "semantic": "白",
        "phonetic": "勺"
    },
    "季": {
        "type": "kaii"
    },
    "英": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "央"
    },
    "芽": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "牙"
    },
    "単": {
        "type": "unknown"
    },
    "省": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "生"
    },
    "変": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "䜌"
    },
    "信": {
        "type": "unknown"
    },
    "便": {
        "type": "kaii"
    },
    "軍": {
        "type": "kaii"
    },
    "勇": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "甬"
    },
    "型": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "刑"
    },
    "建": {
        "type": "kaii"
    },
    "昨": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "乍"
    },
    "栄": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "𤇾"
    },
    "浅": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "戔"
    },
    "胃": {
        "type": "kaii"
    },
    "祝": {
        "type": "kaii"
    },
    "紀": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "己"
    },
    "約": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "勺"
    },
    "要": {
        "type": "kaii"
    },
    "飛": {
        "type": "shoukei"
    },
    "候": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "侯"
    },
    "借": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "昔"
    },
    "倉": {
        "type": "unknown"
    },
    "孫": {
        "type": "kaii"
    },
    "案": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "安"
    },
    "害": {
        "type": "kaii"
    },
    "帯": {
        "type": "shoukei"
    },
    "席": {
        "type": "unknown"
    },
    "徒": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "土"
    },
    "挙": {
        "type": "unknown"
    },
    "梅": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "毎"
    },
    "残": {
        "type": "keisei",
        "semantic": "歹",
        "phonetic": "戔"
    },
    "殺": {
        "type": "unknown"
    },
    "浴": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "谷"
    },
    "特": {
        "type": "keisei",
        "semantic": "牛",
        "phonetic": "寺"
    },
    "笑": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "关"
    },
    "粉": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "分"
    },
    "料": {
        "type": "kaii"
    },
    "差": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "左"
    },
    "脈": {
        "type": "unknown"
    },
    "航": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "亢"
    },
    "訓": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "川"
    },
    "連": {
        "type": "kaii"
    },
    "郡": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "君"
    },
    "巣": {
        "type": "shoukei"
    },
    "健": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "建"
    },
    "側": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "則"
    },
    "停": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "亭"
    },
    "副": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "畐"
    },
    "唱": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "昌"
    },
    "堂": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "尚"
    },
    "康": {
        "type": "unknown"
    },
    "得": {
        "type": "unknown"
    },
    "救": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "求"
    },
    "械": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "戒"
    },
    "清": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "青"
    },
    "望": {
        "type": "keisei",
        "semantic": "𡈼",
        "phonetic": "亡"
    },
    "産": {
        "type": "kaii"
    },
    "菜": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "采"
    },
    "票": {
        "type": "kaii"
    },
    "貨": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "化"
    },
    "敗": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "貝"
    },
    "陸": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "坴"
    },
    "博": {
        "type": "keisei",
        "semantic": "十",
        "phonetic": "尃"
    },
    "喜": {
        "type": "kaii"
    },
    "順": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "川"
    },
    "街": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "圭"
    },
    "散": {
        "type": "unknown"
    },
    "景": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "京"
    },
    "最": {
        "type": "unknown"
    },
    "量": {
        "type": "unknown"
    },
    "満": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "㒼"
    },
    "焼": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "尭"
    },
    "然": {
        "type": "kaii"
    },
    "無": {
        "type": "shoukei"
    },
    "給": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "合"
    },
    "結": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "吉"
    },
    "覚": {
        "type": "unknown"
    },
    "象": {
        "type": "shoukei"
    },
    "貯": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "宁"
    },
    "費": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "弗"
    },
    "達": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "羍"
    },
    "隊": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "㒸"
    },
    "飯": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "反"
    },
    "働": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "動"
    },
    "塩": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "監"
    },
    "戦": {
        "type": "keisei",
        "semantic": "戈",
        "phonetic": "単"
    },
    "極": {
        "type": "unknown"
    },
    "照": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "昭"
    },
    "愛": {
        "type": "unknown"
    },
    "節": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "即"
    },
    "続": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "売"
    },
    "置": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "直"
    },
    "腸": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "昜"
    },
    "辞": {
        "type": "unknown"
    },
    "試": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "式"
    },
    "歴": {
        "type": "keisei",
        "semantic": "止",
        "phonetic": "厤"
    },
    "察": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "祭"
    },
    "旗": {
        "type": "keisei",
        "semantic": "㫃",
        "phonetic": "其"
    },
    "漁": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "魚"
    },
    "種": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "重"
    },
    "管": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "官"
    },
    "説": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "兑"
    },
    "関": {
        "type": "shinjitai"
    },
    "静": {
        "type": "keisei",
        "semantic": "爭",
        "phonetic": "青"
    },
    "億": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "意"
    },
    "器": {
        "type": "kaii"
    },
    "賞": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "尚"
    },
    "標": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "票"
    },
    "熱": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "埶"
    },
    "養": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "羊"
    },
    "課": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "果"
    },
    "輪": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "侖"
    },
    "選": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "巽"
    },
    "機": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "幾"
    },
    "積": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "責"
    },
    "録": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "彔"
    },
    "観": {
        "type": "keisei",
        "semantic": "見",
        "phonetic": "雚"
    },
    "類": {
        "type": "unknown"
    },
    "験": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "㑒"
    },
    "願": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "原"
    },
    "鏡": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "竟"
    },
    "競": {
        "type": "kaii"
    },
    "議": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "義"
    },
    "久": {
        "type": "shoukei"
    },
    "仏": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "弗"
    },
    "支": {
        "type": "kaii"
    },
    "比": {
        "type": "kaii"
    },
    "可": {
        "type": "kaii"
    },
    "旧": {
        "type": "shinjitai"
    },
    "永": {
        "type": "unknown"
    },
    "句": {
        "type": "keisei",
        "semantic": "勹",
        "phonetic": "口"
    },
    "圧": {
        "type": "shinjitai"
    },
    "弁": {
        "type": "shoukei"
    },
    "布": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "父"
    },
    "刊": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "干"
    },
    "犯": {
        "type": "unknown"
    },
    "示": {
        "type": "unknown"
    },
    "再": {
        "type": "shiji"
    },
    "仮": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "叚"
    },
    "件": {
        "type": "kaii"
    },
    "任": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "壬"
    },
    "因": {
        "type": "kaii"
    },
    "団": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "専"
    },
    "在": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "才"
    },
    "舌": {
        "type": "shoukei"
    },
    "似": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "以"
    },
    "余": {
        "type": "unknown"
    },
    "判": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "半"
    },
    "均": {
        "type": "unknown"
    },
    "志": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "士"
    },
    "条": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "攸"
    },
    "災": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "𢦏"
    },
    "応": {
        "type": "shinjitai"
    },
    "序": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "予"
    },
    "快": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "夬"
    },
    "技": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "支"
    },
    "状": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "爿"
    },
    "防": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "方"
    },
    "武": {
        "type": "unknown"
    },
    "承": {
        "type": "kaii"
    },
    "価": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "賈"
    },
    "舎": {
        "type": "unknown"
    },
    "券": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "龹"
    },
    "制": {
        "type": "kaii"
    },
    "効": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "交"
    },
    "妻": {
        "type": "shoukei"
    },
    "居": {
        "type": "unknown"
    },
    "往": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "王"
    },
    "性": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "生"
    },
    "招": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "召"
    },
    "易": {
        "type": "unknown"
    },
    "枝": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "支"
    },
    "河": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "可"
    },
    "版": {
        "type": "keisei",
        "semantic": "片",
        "phonetic": "反"
    },
    "肥": {
        "type": "shiji"
    },
    "述": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "朮"
    },
    "非": {
        "type": "kaii"
    },
    "保": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "呆"
    },
    "厚": {
        "type": "unknown"
    },
    "故": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "古"
    },
    "政": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "正"
    },
    "査": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "且"
    },
    "独": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "蜀"
    },
    "祖": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "且"
    },
    "則": {
        "type": "kaii"
    },
    "逆": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "屰"
    },
    "退": {
        "type": "kaii"
    },
    "迷": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "米"
    },
    "限": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "艮"
    },
    "師": {
        "type": "kaii"
    },
    "個": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "固"
    },
    "修": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "攸"
    },
    "俵": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "表"
    },
    "益": {
        "type": "kaii"
    },
    "能": {
        "type": "unknown"
    },
    "容": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "谷"
    },
    "恩": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "因"
    },
    "格": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "各"
    },
    "桜": {
        "type": "shinjitai"
    },
    "留": {
        "type": "unknown"
    },
    "破": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "皮"
    },
    "素": {
        "type": "kaii"
    },
    "耕": {
        "type": "unknown"
    },
    "財": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "才"
    },
    "造": {
        "type": "kaii"
    },
    "率": {
        "type": "shoukei"
    },
    "貧": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "分"
    },
    "基": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "其"
    },
    "婦": {
        "type": "kaii"
    },
    "寄": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "奇"
    },
    "常": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "尚"
    },
    "張": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "長"
    },
    "術": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "朮"
    },
    "情": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "青"
    },
    "採": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "采"
    },
    "授": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "受"
    },
    "接": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "妾"
    },
    "断": {
        "type": "kaii"
    },
    "液": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "夜"
    },
    "混": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "昆"
    },
    "現": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "見"
    },
    "略": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "各"
    },
    "眼": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "艮"
    },
    "務": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "敄"
    },
    "移": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "多"
    },
    "経": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "圣"
    },
    "規": {
        "type": "kaii"
    },
    "許": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "午"
    },
    "設": {
        "type": "kaii"
    },
    "責": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "朿"
    },
    "険": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "㑒"
    },
    "備": {
        "type": "unknown"
    },
    "営": {
        "type": "keisei",
        "semantic": "呂",
        "phonetic": "𤇾"
    },
    "報": {
        "type": "kaii"
    },
    "富": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "畐"
    },
    "属": {
        "type": "keisei",
        "semantic": "尾",
        "phonetic": "蜀"
    },
    "復": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "复"
    },
    "提": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "是"
    },
    "検": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "㑒"
    },
    "減": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "咸"
    },
    "測": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "則"
    },
    "税": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "兑"
    },
    "程": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "呈"
    },
    "絶": {
        "type": "kaii"
    },
    "統": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "充"
    },
    "証": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "正"
    },
    "評": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "平"
    },
    "賀": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "加"
    },
    "貸": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "代"
    },
    "貿": {
        "type": "unknown"
    },
    "過": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "咼"
    },
    "勢": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "埶"
    },
    "幹": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "干"
    },
    "準": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "隼"
    },
    "損": {
        "type": "kaii"
    },
    "禁": {
        "type": "kaii"
    },
    "罪": {
        "type": "kaii"
    },
    "義": {
        "type": "kaii"
    },
    "群": {
        "type": "keisei",
        "semantic": "羊",
        "phonetic": "君"
    },
    "墓": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "莫"
    },
    "夢": {
        "type": "unknown"
    },
    "解": {
        "type": "kaii"
    },
    "豊": {
        "type": "shoukei"
    },
    "資": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "次"
    },
    "鉱": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "広"
    },
    "預": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "予"
    },
    "飼": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "司"
    },
    "像": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "象"
    },
    "境": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "竟"
    },
    "増": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "曽"
    },
    "徳": {
        "type": "unknown"
    },
    "慣": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "貫"
    },
    "態": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "能"
    },
    "構": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "冓"
    },
    "演": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "寅"
    },
    "精": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "青"
    },
    "総": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "悤"
    },
    "綿": {
        "type": "kaii"
    },
    "製": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "制"
    },
    "複": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "复"
    },
    "適": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "啇"
    },
    "酸": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "夋"
    },
    "銭": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "戔"
    },
    "銅": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "同"
    },
    "際": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "祭"
    },
    "雑": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "集"
    },
    "領": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "令"
    },
    "導": {
        "type": "keisei",
        "semantic": "寸",
        "phonetic": "道"
    },
    "敵": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "啇"
    },
    "暴": {
        "type": "kaii"
    },
    "潔": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "絜"
    },
    "確": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "隺"
    },
    "編": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "扁"
    },
    "賛": {
        "type": "kaii"
    },
    "質": {
        "type": "kaii"
    },
    "興": {
        "type": "kaii"
    },
    "衛": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "韋"
    },
    "燃": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "然"
    },
    "築": {
        "type": "unknown"
    },
    "輸": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "兪"
    },
    "績": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "責"
    },
    "講": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "冓"
    },
    "謝": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "射"
    },
    "織": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "戠"
    },
    "職": {
        "type": "keisei",
        "semantic": "耳",
        "phonetic": "戠"
    },
    "額": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "客"
    },
    "識": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "戠"
    },
    "護": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "蒦"
    },
    "亡": {
        "type": "shoukei"
    },
    "寸": {
        "type": "kaii"
    },
    "己": {
        "type": "shoukei"
    },
    "干": {
        "type": "shoukei"
    },
    "仁": {
        "type": "unknown"
    },
    "尺": {
        "type": "shoukei"
    },
    "片": {
        "type": "shoukei"
    },
    "冊": {
        "type": "shoukei"
    },
    "収": {
        "type": "kaii"
    },
    "処": {
        "type": "unknown"
    },
    "幼": {
        "type": "unknown"
    },
    "庁": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "丁"
    },
    "穴": {
        "type": "shoukei"
    },
    "危": {
        "type": "unknown"
    },
    "后": {
        "type": "kaii"
    },
    "灰": {
        "type": "kaii"
    },
    "吸": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "及"
    },
    "存": {
        "type": "unknown"
    },
    "宇": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "于"
    },
    "宅": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "乇"
    },
    "机": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "几"
    },
    "至": {
        "type": "unknown"
    },
    "否": {
        "type": "kaii"
    },
    "我": {
        "type": "unknown"
    },
    "系": {
        "type": "kaii"
    },
    "卵": {
        "type": "shoukei"
    },
    "忘": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "亡"
    },
    "孝": {
        "type": "kaii"
    },
    "困": {
        "type": "unknown"
    },
    "批": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "比"
    },
    "私": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "厶"
    },
    "乱": {
        "type": "kaii"
    },
    "垂": {
        "type": "unknown"
    },
    "乳": {
        "type": "kaii"
    },
    "供": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "共"
    },
    "並": {
        "type": "kaii"
    },
    "刻": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "亥"
    },
    "呼": {
        "type": "unknown"
    },
    "宗": {
        "type": "kaii"
    },
    "宙": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "由"
    },
    "宝": {
        "type": "shinjitai"
    },
    "届": {
        "type": "unknown"
    },
    "延": {
        "type": "unknown"
    },
    "忠": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "中"
    },
    "拡": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "広"
    },
    "担": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "旦"
    },
    "拝": {
        "type": "unknown"
    },
    "枚": {
        "type": "kaii"
    },
    "沿": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "㕣"
    },
    "若": {
        "type": "shoukei"
    },
    "看": {
        "type": "kaii"
    },
    "城": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "成"
    },
    "奏": {
        "type": "kaii"
    },
    "姿": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "次"
    },
    "宣": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "亘"
    },
    "専": {
        "type": "unknown"
    },
    "巻": {
        "type": "keisei",
        "semantic": "卩",
        "phonetic": "龹"
    },
    "律": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "聿"
    },
    "映": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "央"
    },
    "染": {
        "type": "unknown"
    },
    "段": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "耑"
    },
    "洗": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "先"
    },
    "派": {
        "type": "unknown"
    },
    "皇": {
        "type": "unknown"
    },
    "泉": {
        "type": "shoukei"
    },
    "砂": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "少"
    },
    "紅": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "工"
    },
    "背": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "北"
    },
    "肺": {
        "type": "unknown"
    },
    "革": {
        "type": "shoukei"
    },
    "蚕": {
        "type": "shinjitai"
    },
    "値": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "直"
    },
    "俳": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "非"
    },
    "党": {
        "type": "keisei",
        "semantic": "黑",
        "phonetic": "尚"
    },
    "展": {
        "type": "unknown"
    },
    "座": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "坐"
    },
    "従": {
        "type": "kaii"
    },
    "株": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "朱"
    },
    "将": {
        "type": "unknown"
    },
    "班": {
        "type": "kaii"
    },
    "秘": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "必"
    },
    "純": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "屯"
    },
    "納": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "内"
    },
    "胸": {
        "type": "unknown"
    },
    "朗": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "良"
    },
    "討": {
        "type": "unknown"
    },
    "射": {
        "type": "kaii"
    },
    "針": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "十"
    },
    "降": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "夅"
    },
    "除": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "余"
    },
    "陛": {
        "type": "unknown"
    },
    "骨": {
        "type": "kaii"
    },
    "域": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "或"
    },
    "密": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "宓"
    },
    "捨": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "舎"
    },
    "推": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "隹"
    },
    "探": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "罙"
    },
    "済": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "斉"
    },
    "異": {
        "type": "shoukei"
    },
    "盛": {
        "type": "keisei",
        "semantic": "皿",
        "phonetic": "成"
    },
    "視": {
        "type": "keisei",
        "semantic": "見",
        "phonetic": "示"
    },
    "窓": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "悤"
    },
    "翌": {
        "type": "keisei",
        "semantic": "羽",
        "phonetic": "立"
    },
    "脳": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "𡿺"
    },
    "著": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "者"
    },
    "訪": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "方"
    },
    "訳": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "睪"
    },
    "欲": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "谷"
    },
    "郷": {
        "type": "kaii"
    },
    "郵": {
        "type": "kaii"
    },
    "閉": {
        "type": "kaii"
    },
    "頂": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "丁"
    },
    "就": {
        "type": "kaii"
    },
    "善": {
        "type": "kaii"
    },
    "尊": {
        "type": "kaii"
    },
    "割": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "害"
    },
    "創": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "倉"
    },
    "勤": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "堇"
    },
    "裁": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "𢦏"
    },
    "揮": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "軍"
    },
    "敬": {
        "type": "kaii"
    },
    "晩": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "免"
    },
    "棒": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "奉"
    },
    "痛": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "甬"
    },
    "筋": {
        "type": "unknown"
    },
    "策": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "朿"
    },
    "衆": {
        "type": "kaii"
    },
    "装": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "壮"
    },
    "補": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "甫"
    },
    "詞": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "司"
    },
    "貴": {
        "type": "kaii"
    },
    "裏": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "里"
    },
    "傷": {
        "type": "unknown"
    },
    "暖": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "爰"
    },
    "源": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "原"
    },
    "聖": {
        "type": "kaii"
    },
    "盟": {
        "type": "keisei",
        "semantic": "皿",
        "phonetic": "明"
    },
    "絹": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "肙"
    },
    "署": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "者"
    },
    "腹": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "复"
    },
    "蒸": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "烝"
    },
    "幕": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "莫"
    },
    "誠": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "成"
    },
    "賃": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "任"
    },
    "疑": {
        "type": "kaii"
    },
    "層": {
        "type": "keisei",
        "semantic": "尸",
        "phonetic": "曽"
    },
    "模": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "莫"
    },
    "穀": {
        "type": "unknown"
    },
    "磁": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "茲"
    },
    "暮": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "莫"
    },
    "誤": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "呉"
    },
    "誌": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "志"
    },
    "認": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "忍"
    },
    "閣": {
        "type": "keisei",
        "semantic": "門",
        "phonetic": "各"
    },
    "障": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "章"
    },
    "劇": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "豦"
    },
    "権": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "雚"
    },
    "潮": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "朝"
    },
    "熟": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "孰"
    },
    "蔵": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "臧"
    },
    "諸": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "者"
    },
    "誕": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "延"
    },
    "論": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "侖"
    },
    "遺": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "貴"
    },
    "奮": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "奞"
    },
    "憲": {
        "type": "unknown"
    },
    "操": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "喿"
    },
    "樹": {
        "type": "unknown"
    },
    "激": {
        "type": "unknown"
    },
    "糖": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "唐"
    },
    "縦": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "従"
    },
    "鋼": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "岡"
    },
    "厳": {
        "type": "unknown"
    },
    "優": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "憂"
    },
    "縮": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "宿"
    },
    "覧": {
        "type": "unknown"
    },
    "簡": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "間"
    },
    "臨": {
        "type": "unknown"
    },
    "難": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "𦰩"
    },
    "臓": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "蔵"
    },
    "警": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "敬"
    },
    "乙": {
        "type": "unknown"
    },
    "了": {
        "type": "unknown"
    },
    "又": {
        "type": "shoukei"
    },
    "与": {
        "type": "shinjitai"
    },
    "及": {
        "type": "kaii"
    },
    "丈": {
        "type": "kaii"
    },
    "刃": {
        "type": "shoukei"
    },
    "凡": {
        "type": "shoukei"
    },
    "勺": {
        "type": "shoukei"
    },
    "互": {
        "type": "shoukei"
    },
    "弔": {
        "type": "shoukei"
    },
    "井": {
        "type": "shoukei"
    },
    "升": {
        "type": "unknown"
    },
    "丹": {
        "type": "unknown"
    },
    "乏": {
        "type": "unknown"
    },
    "匁": {
        "type": "kokuji"
    },
    "屯": {
        "type": "shoukei"
    },
    "介": {
        "type": "unknown"
    },
    "冗": {
        "type": "kaii"
    },
    "凶": {
        "type": "shiji"
    },
    "刈": {
        "type": "unknown"
    },
    "匹": {
        "type": "unknown"
    },
    "厄": {
        "type": "unknown"
    },
    "双": {
        "type": "shinjitai"
    },
    "孔": {
        "type": "unknown"
    },
    "幻": {
        "type": "unknown"
    },
    "斗": {
        "type": "shoukei"
    },
    "斤": {
        "type": "shoukei"
    },
    "且": {
        "type": "shoukei"
    },
    "丙": {
        "type": "shoukei"
    },
    "甲": {
        "type": "shoukei"
    },
    "凸": {
        "type": "shoukei"
    },
    "丘": {
        "type": "shoukei"
    },
    "斥": {
        "type": "unknown"
    },
    "仙": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "山"
    },
    "凹": {
        "type": "shoukei"
    },
    "召": {
        "type": "kaii"
    },
    "巨": {
        "type": "shoukei"
    },
    "占": {
        "type": "kaii"
    },
    "囚": {
        "type": "kaii"
    },
    "奴": {
        "type": "kaii"
    },
    "尼": {
        "type": "unknown"
    },
    "巧": {
        "type": "keisei",
        "semantic": "工",
        "phonetic": "丂"
    },
    "払": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "弗"
    },
    "汁": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "十"
    },
    "玄": {
        "type": "unknown"
    },
    "甘": {
        "type": "unknown"
    },
    "矛": {
        "type": "shoukei"
    },
    "込": {
        "type": "kokuji"
    },
    "弐": {
        "type": "unknown"
    },
    "朱": {
        "type": "unknown"
    },
    "吏": {
        "type": "kaii"
    },
    "劣": {
        "type": "kaii"
    },
    "充": {
        "type": "unknown"
    },
    "妄": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "亡"
    },
    "企": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "止"
    },
    "仰": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "卬"
    },
    "伐": {
        "type": "kaii"
    },
    "伏": {
        "type": "unknown"
    },
    "刑": {
        "type": "unknown"
    },
    "旬": {
        "type": "kaii"
    },
    "旨": {
        "type": "unknown"
    },
    "匠": {
        "type": "kaii"
    },
    "叫": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "丩"
    },
    "吐": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "土"
    },
    "吉": {
        "type": "kaii"
    },
    "如": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "女"
    },
    "妃": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "己"
    },
    "尽": {
        "type": "unknown"
    },
    "帆": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "凡"
    },
    "忙": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "亡"
    },
    "扱": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "及"
    },
    "朽": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "丂"
    },
    "朴": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "卜"
    },
    "汚": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "于"
    },
    "汗": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "干"
    },
    "江": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "工"
    },
    "壮": {
        "type": "keisei",
        "semantic": "士",
        "phonetic": "爿"
    },
    "缶": {
        "type": "keisei",
        "semantic": "缶",
        "phonetic": "雚"
    },
    "肌": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "几"
    },
    "舟": {
        "type": "shoukei"
    },
    "芋": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "于"
    },
    "芝": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "之"
    },
    "巡": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "川"
    },
    "迅": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "卂"
    },
    "亜": {
        "type": "shoukei"
    },
    "更": {
        "type": "kaii"
    },
    "寿": {
        "type": "shinjitai"
    },
    "励": {
        "type": "unknown"
    },
    "含": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "今"
    },
    "佐": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "左"
    },
    "伺": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "司"
    },
    "伸": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "申"
    },
    "但": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "旦"
    },
    "伯": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "白"
    },
    "伴": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "半"
    },
    "呉": {
        "type": "kaii"
    },
    "克": {
        "type": "shoukei"
    },
    "却": {
        "type": "unknown"
    },
    "吟": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "今"
    },
    "吹": {
        "type": "kaii"
    },
    "呈": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "𡈼"
    },
    "壱": {
        "type": "shinjitai"
    },
    "坑": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "亢"
    },
    "坊": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "方"
    },
    "妊": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "壬"
    },
    "妨": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "方"
    },
    "妙": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "少"
    },
    "肖": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "小"
    },
    "尿": {
        "type": "kaii"
    },
    "尾": {
        "type": "unknown"
    },
    "岐": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "支"
    },
    "攻": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "工"
    },
    "忌": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "己"
    },
    "床": {
        "type": "kaii"
    },
    "廷": {
        "type": "keisei",
        "semantic": "廴",
        "phonetic": "𡈼"
    },
    "忍": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "刃"
    },
    "戒": {
        "type": "kaii"
    },
    "戻": {
        "type": "keisei",
        "semantic": "戸",
        "phonetic": "大"
    },
    "抗": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "亢"
    },
    "抄": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "少"
    },
    "択": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "尺"
    },
    "把": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "巴"
    },
    "抜": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "犮"
    },
    "扶": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "夫"
    },
    "抑": {
        "type": "unknown"
    },
    "杉": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "彡"
    },
    "沖": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "中"
    },
    "沢": {
        "type": "shinjitai"
    },
    "沈": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "冘"
    },
    "没": {
        "type": "unknown"
    },
    "妥": {
        "type": "kaii"
    },
    "狂": {
        "type": "unknown"
    },
    "秀": {
        "type": "unknown"
    },
    "肝": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "干"
    },
    "即": {
        "type": "kaii"
    },
    "芳": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "方"
    },
    "辛": {
        "type": "shoukei"
    },
    "迎": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "卬"
    },
    "邦": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "丰"
    },
    "岳": {
        "type": "kaii"
    },
    "奉": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "丰"
    },
    "享": {
        "type": "unknown"
    },
    "盲": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "亡"
    },
    "依": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "衣"
    },
    "佳": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "圭"
    },
    "侍": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "寺"
    },
    "侮": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "毎"
    },
    "併": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "并"
    },
    "免": {
        "type": "shoukei"
    },
    "刺": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "朿"
    },
    "劾": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "亥"
    },
    "卓": {
        "type": "unknown"
    },
    "叔": {
        "type": "keisei",
        "semantic": "又",
        "phonetic": "尗"
    },
    "坪": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "平"
    },
    "奇": {
        "type": "unknown"
    },
    "奔": {
        "type": "unknown"
    },
    "姓": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "生"
    },
    "宜": {
        "type": "unknown"
    },
    "尚": {
        "type": "keisei",
        "semantic": "八",
        "phonetic": "向"
    },
    "屈": {
        "type": "kaii"
    },
    "岬": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "甲"
    },
    "弦": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "玄"
    },
    "征": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "正"
    },
    "彼": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "皮"
    },
    "怪": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "圣"
    },
    "怖": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "布"
    },
    "肩": {
        "type": "unknown"
    },
    "房": {
        "type": "keisei",
        "semantic": "戸",
        "phonetic": "方"
    },
    "押": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "甲"
    },
    "拐": {
        "type": "unknown"
    },
    "拒": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "巨"
    },
    "拠": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "豦"
    },
    "拘": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "句"
    },
    "拙": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "出"
    },
    "拓": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "石"
    },
    "抽": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "由"
    },
    "抵": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "氐"
    },
    "拍": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "白"
    },
    "披": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "皮"
    },
    "抱": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "包"
    },
    "抹": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "末"
    },
    "昆": {
        "type": "unknown"
    },
    "昇": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "升"
    },
    "枢": {
        "type": "kaii"
    },
    "析": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "斤"
    },
    "杯": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "不"
    },
    "枠": {
        "type": "kokuji"
    },
    "欧": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "区"
    },
    "肯": {
        "type": "kaii"
    },
    "殴": {
        "type": "keisei",
        "semantic": "殳",
        "phonetic": "区"
    },
    "況": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "兄"
    },
    "沼": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "召"
    },
    "泥": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "尼"
    },
    "泊": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "白"
    },
    "泌": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "必"
    },
    "沸": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "弗"
    },
    "泡": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "包"
    },
    "炎": {
        "type": "kaii"
    },
    "炊": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "吹"
    },
    "炉": {
        "type": "shinjitai"
    },
    "邪": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "牙"
    },
    "祈": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "斤"
    },
    "祉": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "止"
    },
    "突": {
        "type": "kaii"
    },
    "肢": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "支"
    },
    "肪": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "方"
    },
    "到": {
        "type": "unknown"
    },
    "茎": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "圣"
    },
    "苗": {
        "type": "kaii"
    },
    "茂": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "戊"
    },
    "迭": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "失"
    },
    "迫": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "白"
    },
    "邸": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "氐"
    },
    "阻": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "且"
    },
    "附": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "付"
    },
    "斉": {
        "type": "shoukei"
    },
    "甚": {
        "type": "kaii"
    },
    "帥": {
        "type": "unknown"
    },
    "衷": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "中"
    },
    "幽": {
        "type": "unknown"
    },
    "為": {
        "type": "kaii"
    },
    "盾": {
        "type": "unknown"
    },
    "卑": {
        "type": "kaii"
    },
    "哀": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "衣"
    },
    "亭": {
        "type": "keisei",
        "semantic": "高",
        "phonetic": "丁"
    },
    "帝": {
        "type": "unknown"
    },
    "侯": {
        "type": "unknown"
    },
    "俊": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "夋"
    },
    "侵": {
        "type": "unknown"
    },
    "促": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "足"
    },
    "俗": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "谷"
    },
    "盆": {
        "type": "keisei",
        "semantic": "皿",
        "phonetic": "分"
    },
    "冠": {
        "type": "keisei",
        "semantic": "寸",
        "phonetic": "元"
    },
    "削": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "肖"
    },
    "勅": {
        "type": "unknown"
    },
    "貞": {
        "type": "unknown"
    },
    "卸": {
        "type": "kaii"
    },
    "厘": {
        "type": "derivative"
    },
    "怠": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "台"
    },
    "叙": {
        "type": "keisei",
        "semantic": "又",
        "phonetic": "余"
    },
    "咲": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "关"
    },
    "垣": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "亘"
    },
    "契": {
        "type": "unknown"
    },
    "姻": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "因"
    },
    "孤": {
        "type": "keisei",
        "semantic": "子",
        "phonetic": "瓜"
    },
    "封": {
        "type": "keisei",
        "semantic": "寸",
        "phonetic": "丰"
    },
    "峡": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "夾"
    },
    "峠": {
        "type": "kokuji"
    },
    "弧": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "瓜"
    },
    "悔": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "毎"
    },
    "恒": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "亘"
    },
    "恨": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "艮"
    },
    "怒": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "奴"
    },
    "威": {
        "type": "kaii"
    },
    "括": {
        "type": "unknown"
    },
    "挟": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "夾"
    },
    "拷": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "考"
    },
    "挑": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "兆"
    },
    "施": {
        "type": "keisei",
        "semantic": "㫃",
        "phonetic": "也"
    },
    "是": {
        "type": "kaii"
    },
    "冒": {
        "type": "kaii"
    },
    "架": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "加"
    },
    "枯": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "古"
    },
    "柄": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "丙"
    },
    "柳": {
        "type": "unknown"
    },
    "皆": {
        "type": "kaii"
    },
    "洪": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "共"
    },
    "浄": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "争"
    },
    "津": {
        "type": "unknown"
    },
    "洞": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "同"
    },
    "牲": {
        "type": "keisei",
        "semantic": "牛",
        "phonetic": "生"
    },
    "狭": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "夾"
    },
    "狩": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "守"
    },
    "珍": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "㐱"
    },
    "某": {
        "type": "kaii"
    },
    "疫": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "役"
    },
    "柔": {
        "type": "kaii"
    },
    "砕": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "卒"
    },
    "窃": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "切"
    },
    "糾": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "丩"
    },
    "耐": {
        "type": "kaii"
    },
    "胎": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "台"
    },
    "胆": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "旦"
    },
    "胞": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "包"
    },
    "臭": {
        "type": "kaii"
    },
    "荒": {
        "type": "unknown"
    },
    "荘": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "壮"
    },
    "虐": {
        "type": "kaii"
    },
    "訂": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "丁"
    },
    "赴": {
        "type": "keisei",
        "semantic": "走",
        "phonetic": "卜"
    },
    "軌": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "九"
    },
    "逃": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "兆"
    },
    "郊": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "交"
    },
    "郎": {
        "type": "keisei",
        "semantic": "邑",
        "phonetic": "良"
    },
    "香": {
        "type": "unknown"
    },
    "剛": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "岡"
    },
    "衰": {
        "type": "shoukei"
    },
    "畝": {
        "type": "unknown"
    },
    "恋": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "䜌"
    },
    "倹": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "㑒"
    },
    "倒": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "到"
    },
    "倣": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "放"
    },
    "俸": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "奉"
    },
    "倫": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "侖"
    },
    "翁": {
        "type": "keisei",
        "semantic": "羽",
        "phonetic": "公"
    },
    "兼": {
        "type": "kaii"
    },
    "准": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "隼"
    },
    "凍": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "東"
    },
    "剣": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "㑒"
    },
    "剖": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "咅"
    },
    "脅": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "劦"
    },
    "匿": {
        "type": "keisei",
        "semantic": "匚",
        "phonetic": "若"
    },
    "栽": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "𢦏"
    },
    "索": {
        "type": "shoukei"
    },
    "桑": {
        "type": "kaii"
    },
    "唆": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "夋"
    },
    "哲": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "折"
    },
    "埋": {
        "type": "unknown"
    },
    "娯": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "呉"
    },
    "娠": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "辰"
    },
    "姫": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "臣"
    },
    "娘": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "良"
    },
    "宴": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "妟"
    },
    "宰": {
        "type": "unknown"
    },
    "宵": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "肖"
    },
    "峰": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "夆"
    },
    "貢": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "工"
    },
    "唐": {
        "type": "unknown"
    },
    "徐": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "余"
    },
    "悦": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "兑"
    },
    "恐": {
        "type": "unknown"
    },
    "恭": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "共"
    },
    "恵": {
        "type": "unknown"
    },
    "悟": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "吾"
    },
    "悩": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "𡿺"
    },
    "扇": {
        "type": "kaii"
    },
    "振": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "辰"
    },
    "捜": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "叟"
    },
    "挿": {
        "type": "unknown"
    },
    "捕": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "甫"
    },
    "敏": {
        "type": "kaii"
    },
    "核": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "亥"
    },
    "桟": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "戔"
    },
    "栓": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "全"
    },
    "桃": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "兆"
    },
    "殊": {
        "type": "keisei",
        "semantic": "歹",
        "phonetic": "朱"
    },
    "殉": {
        "type": "unknown"
    },
    "浦": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "甫"
    },
    "浸": {
        "type": "unknown"
    },
    "泰": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "大"
    },
    "浜": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "賓"
    },
    "浮": {
        "type": "unknown"
    },
    "涙": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "戻"
    },
    "浪": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "良"
    },
    "烈": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "列"
    },
    "畜": {
        "type": "unknown"
    },
    "珠": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "朱"
    },
    "畔": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "半"
    },
    "疾": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "矢"
    },
    "症": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "正"
    },
    "疲": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "皮"
    },
    "眠": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "民"
    },
    "砲": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "包"
    },
    "祥": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "羊"
    },
    "称": {
        "type": "unknown"
    },
    "租": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "且"
    },
    "秩": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "失"
    },
    "粋": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "卒"
    },
    "紛": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "分"
    },
    "紡": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "方"
    },
    "紋": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "文"
    },
    "耗": {
        "type": "keisei",
        "semantic": "耒",
        "phonetic": "毛"
    },
    "恥": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "耳"
    },
    "脂": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "旨"
    },
    "朕": {
        "type": "kaii"
    },
    "胴": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "同"
    },
    "致": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "至"
    },
    "般": {
        "type": "kaii"
    },
    "既": {
        "type": "unknown"
    },
    "華": {
        "type": "unknown"
    },
    "蚊": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "文"
    },
    "被": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "皮"
    },
    "託": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "乇"
    },
    "軒": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "干"
    },
    "辱": {
        "type": "kaii"
    },
    "唇": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "辰"
    },
    "逝": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "折"
    },
    "逐": {
        "type": "unknown"
    },
    "逓": {
        "type": "unknown"
    },
    "途": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "余"
    },
    "透": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "秀"
    },
    "酌": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "勺"
    },
    "陥": {
        "type": "unknown"
    },
    "陣": {
        "type": "unknown"
    },
    "隻": {
        "type": "kaii"
    },
    "飢": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "几"
    },
    "鬼": {
        "type": "shoukei"
    },
    "剤": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "斉"
    },
    "竜": {
        "type": "shoukei"
    },
    "粛": {
        "type": "kaii"
    },
    "尉": {
        "type": "kaii"
    },
    "彫": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "周"
    },
    "偽": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "為"
    },
    "偶": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "禺"
    },
    "偵": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "貞"
    },
    "偏": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "扁"
    },
    "剰": {
        "type": "unknown"
    },
    "勘": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "甚"
    },
    "乾": {
        "type": "keisei",
        "semantic": "乙",
        "phonetic": "倝"
    },
    "喝": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "曷"
    },
    "啓": {
        "type": "kaii"
    },
    "唯": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "隹"
    },
    "執": {
        "type": "kaii"
    },
    "培": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "咅"
    },
    "堀": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "屈"
    },
    "婚": {
        "type": "unknown"
    },
    "婆": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "波"
    },
    "寂": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "叔"
    },
    "崎": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "奇"
    },
    "崇": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "宗"
    },
    "崩": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "朋"
    },
    "庶": {
        "type": "kaii"
    },
    "庸": {
        "type": "keisei",
        "semantic": "庚",
        "phonetic": "用"
    },
    "彩": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "采"
    },
    "患": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "串"
    },
    "惨": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "参"
    },
    "惜": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "昔"
    },
    "悼": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "卓"
    },
    "悠": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "攸"
    },
    "掛": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "卦"
    },
    "掘": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "屈"
    },
    "掲": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "曷"
    },
    "控": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "空"
    },
    "据": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "居"
    },
    "措": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "昔"
    },
    "掃": {
        "type": "unknown"
    },
    "排": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "非"
    },
    "描": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "苗"
    },
    "斜": {
        "type": "keisei",
        "semantic": "斗",
        "phonetic": "余"
    },
    "旋": {
        "type": "kaii"
    },
    "曹": {
        "type": "kaii"
    },
    "殻": {
        "type": "unknown"
    },
    "貫": {
        "type": "unknown"
    },
    "涯": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "厓"
    },
    "渇": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "曷"
    },
    "渓": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "奚"
    },
    "渋": {
        "type": "unknown"
    },
    "淑": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "叔"
    },
    "渉": {
        "type": "kaii"
    },
    "淡": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "炎"
    },
    "添": {
        "type": "unknown"
    },
    "涼": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "京"
    },
    "猫": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "苗"
    },
    "猛": {
        "type": "unknown"
    },
    "猟": {
        "type": "unknown"
    },
    "瓶": {
        "type": "keisei",
        "semantic": "瓦",
        "phonetic": "并"
    },
    "累": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "畾"
    },
    "盗": {
        "type": "kaii"
    },
    "眺": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "兆"
    },
    "窒": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "至"
    },
    "符": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "付"
    },
    "粗": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "且"
    },
    "粘": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "占"
    },
    "粒": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "立"
    },
    "紺": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "甘"
    },
    "紹": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "召"
    },
    "紳": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "申"
    },
    "脚": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "却"
    },
    "脱": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "兑"
    },
    "豚": {
        "type": "kaii"
    },
    "舶": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "白"
    },
    "菓": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "果"
    },
    "菊": {
        "type": "unknown"
    },
    "菌": {
        "type": "unknown"
    },
    "虚": {
        "type": "unknown"
    },
    "蛍": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "𤇾"
    },
    "蛇": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "它"
    },
    "袋": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "代"
    },
    "訟": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "公"
    },
    "販": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "反"
    },
    "赦": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "赤"
    },
    "軟": {
        "type": "unknown"
    },
    "逸": {
        "type": "kaii"
    },
    "逮": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "隶"
    },
    "郭": {
        "type": "unknown"
    },
    "酔": {
        "type": "unknown"
    },
    "釈": {
        "type": "keisei",
        "semantic": "釆",
        "phonetic": "尺"
    },
    "釣": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "勺"
    },
    "陰": {
        "type": "unknown"
    },
    "陳": {
        "type": "kaii"
    },
    "陶": {
        "type": "unknown"
    },
    "陪": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "咅"
    },
    "隆": {
        "type": "unknown"
    },
    "陵": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "夌"
    },
    "麻": {
        "type": "kaii"
    },
    "斎": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "斉"
    },
    "喪": {
        "type": "kaii"
    },
    "奥": {
        "type": "kaii"
    },
    "蛮": {
        "type": "shinjitai"
    },
    "偉": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "韋"
    },
    "傘": {
        "type": "shoukei"
    },
    "傍": {
        "type": "unknown"
    },
    "普": {
        "type": "kaii"
    },
    "喚": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "奐"
    },
    "喫": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "契"
    },
    "圏": {
        "type": "keisei",
        "semantic": "囗",
        "phonetic": "巻"
    },
    "堪": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "甚"
    },
    "堅": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "臤"
    },
    "堕": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "陏"
    },
    "塚": {
        "type": "unknown"
    },
    "堤": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "是"
    },
    "塔": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "荅"
    },
    "塀": {
        "type": "unknown"
    },
    "媒": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "某"
    },
    "婿": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "胥"
    },
    "掌": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "尚"
    },
    "項": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "工"
    },
    "幅": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "畐"
    },
    "帽": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "冒"
    },
    "幾": {
        "type": "kaii"
    },
    "廃": {
        "type": "unknown"
    },
    "廊": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "郎"
    },
    "弾": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "単"
    },
    "尋": {
        "type": "kaii"
    },
    "御": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "卸"
    },
    "循": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "盾"
    },
    "慌": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "荒"
    },
    "惰": {
        "type": "unknown"
    },
    "愉": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "兪"
    },
    "惑": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "或"
    },
    "雇": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "戸"
    },
    "扉": {
        "type": "keisei",
        "semantic": "戸",
        "phonetic": "非"
    },
    "握": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "屋"
    },
    "援": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "爰"
    },
    "換": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "奐"
    },
    "搭": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "荅"
    },
    "揚": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "昜"
    },
    "揺": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "䍃"
    },
    "敢": {
        "type": "unknown"
    },
    "暁": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "尭"
    },
    "晶": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "昌"
    },
    "替": {
        "type": "unknown"
    },
    "棺": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "官"
    },
    "棋": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "其"
    },
    "棚": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "朋"
    },
    "棟": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "東"
    },
    "款": {
        "type": "unknown"
    },
    "欺": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "其"
    },
    "殖": {
        "type": "keisei",
        "semantic": "歹",
        "phonetic": "直"
    },
    "渦": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "咼"
    },
    "滋": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "茲"
    },
    "湿": {
        "type": "kaii"
    },
    "渡": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "度"
    },
    "湾": {
        "type": "shinjitai"
    },
    "煮": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "者"
    },
    "猶": {
        "type": "unknown"
    },
    "琴": {
        "type": "shoukei"
    },
    "畳": {
        "type": "kaii"
    },
    "塁": {
        "type": "unknown"
    },
    "疎": {
        "type": "keisei",
        "semantic": "束",
        "phonetic": "疋"
    },
    "痘": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "豆"
    },
    "痢": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "利"
    },
    "硬": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "更"
    },
    "硝": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "肖"
    },
    "硫": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "㐬"
    },
    "筒": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "同"
    },
    "粧": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "庄"
    },
    "絞": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "交"
    },
    "紫": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "此"
    },
    "絡": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "各"
    },
    "脹": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "長"
    },
    "腕": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "宛"
    },
    "葬": {
        "type": "kaii"
    },
    "募": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "莫"
    },
    "裕": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "谷"
    },
    "裂": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "列"
    },
    "詠": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "永"
    },
    "詐": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "乍"
    },
    "詔": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "召"
    },
    "診": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "㐱"
    },
    "訴": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "斥"
    },
    "越": {
        "type": "unknown"
    },
    "超": {
        "type": "keisei",
        "semantic": "走",
        "phonetic": "召"
    },
    "距": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "巨"
    },
    "軸": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "由"
    },
    "遇": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "禺"
    },
    "遂": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "㒸"
    },
    "遅": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "犀"
    },
    "遍": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "扁"
    },
    "酢": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "乍"
    },
    "鈍": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "屯"
    },
    "閑": {
        "type": "kaii"
    },
    "隅": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "禺"
    },
    "随": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "迶"
    },
    "焦": {
        "type": "unknown"
    },
    "雄": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "厷"
    },
    "雰": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "分"
    },
    "殿": {
        "type": "unknown"
    },
    "棄": {
        "type": "unknown"
    },
    "傾": {
        "type": "unknown"
    },
    "傑": {
        "type": "unknown"
    },
    "債": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "責"
    },
    "催": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "崔"
    },
    "僧": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "曽"
    },
    "慈": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "茲"
    },
    "勧": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "雚"
    },
    "載": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "𢦏"
    },
    "嗣": {
        "type": "keisei",
        "semantic": "冊",
        "phonetic": "司"
    },
    "嘆": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "𦰩"
    },
    "塊": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "鬼"
    },
    "塑": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "朔"
    },
    "塗": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "余"
    },
    "奨": {
        "type": "keisei",
        "semantic": "大",
        "phonetic": "将"
    },
    "嫁": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "家"
    },
    "嫌": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "兼"
    },
    "寛": {
        "type": "unknown"
    },
    "寝": {
        "type": "unknown"
    },
    "廉": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "兼"
    },
    "微": {
        "type": "unknown"
    },
    "慨": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "既"
    },
    "愚": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "禺"
    },
    "愁": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "秋"
    },
    "慎": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "真"
    },
    "携": {
        "type": "unknown"
    },
    "搾": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "窄"
    },
    "摂": {
        "type": "unknown"
    },
    "搬": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "般"
    },
    "暇": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "叚"
    },
    "楼": {
        "type": "unknown"
    },
    "歳": {
        "type": "unknown"
    },
    "滑": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "骨"
    },
    "溝": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "冓"
    },
    "滞": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "帯"
    },
    "滝": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "竜"
    },
    "漠": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "莫"
    },
    "滅": {
        "type": "unknown"
    },
    "溶": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "容"
    },
    "煙": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "垔"
    },
    "煩": {
        "type": "kaii"
    },
    "雅": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "牙"
    },
    "猿": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "袁"
    },
    "献": {
        "type": "unknown"
    },
    "痴": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "知"
    },
    "睡": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "垂"
    },
    "督": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "叔"
    },
    "碁": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "其"
    },
    "禍": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "咼"
    },
    "禅": {
        "type": "keisei",
        "semantic": "示",
        "phonetic": "単"
    },
    "稚": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "犀"
    },
    "継": {
        "type": "unknown"
    },
    "腰": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "要"
    },
    "艇": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "廷"
    },
    "蓄": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "畜"
    },
    "虞": {
        "type": "keisei",
        "semantic": "虍",
        "phonetic": "呉"
    },
    "虜": {
        "type": "unknown"
    },
    "褐": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "曷"
    },
    "裸": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "果"
    },
    "触": {
        "type": "keisei",
        "semantic": "角",
        "phonetic": "蜀"
    },
    "該": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "亥"
    },
    "詰": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "吉"
    },
    "誇": {
        "type": "unknown"
    },
    "詳": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "羊"
    },
    "誉": {
        "type": "unknown"
    },
    "賊": {
        "type": "keisei",
        "semantic": "戈",
        "phonetic": "則"
    },
    "賄": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "有"
    },
    "跡": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "朿"
    },
    "践": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "戔"
    },
    "跳": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "兆"
    },
    "較": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "交"
    },
    "違": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "韋"
    },
    "遣": {
        "type": "unknown"
    },
    "酬": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "州"
    },
    "酪": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "各"
    },
    "鉛": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "㕣"
    },
    "鉢": {
        "type": "unknown"
    },
    "鈴": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "令"
    },
    "隔": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "鬲"
    },
    "雷": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "畾"
    },
    "零": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "令"
    },
    "靴": {
        "type": "keisei",
        "semantic": "革",
        "phonetic": "化"
    },
    "頑": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "元"
    },
    "頒": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "分"
    },
    "飾": {
        "type": "kaii"
    },
    "飽": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "包"
    },
    "鼓": {
        "type": "kaii"
    },
    "豪": {
        "type": "keisei",
        "semantic": "豕",
        "phonetic": "高"
    },
    "僕": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "菐"
    },
    "僚": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "尞"
    },
    "暦": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "厤"
    },
    "塾": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "孰"
    },
    "奪": {
        "type": "keisei",
        "semantic": "寸",
        "phonetic": "奞"
    },
    "嫡": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "啇"
    },
    "寡": {
        "type": "kaii"
    },
    "寧": {
        "type": "unknown"
    },
    "腐": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "府"
    },
    "彰": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "章"
    },
    "徴": {
        "type": "unknown"
    },
    "憎": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "曽"
    },
    "慢": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "曼"
    },
    "摘": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "啇"
    },
    "概": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "既"
    },
    "雌": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "此"
    },
    "漆": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "桼"
    },
    "漸": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "斬"
    },
    "漬": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "責"
    },
    "滴": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "啇"
    },
    "漂": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "票"
    },
    "漫": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "曼"
    },
    "漏": {
        "type": "unknown"
    },
    "獄": {
        "type": "kaii"
    },
    "碑": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "卑"
    },
    "稲": {
        "type": "unknown"
    },
    "端": {
        "type": "keisei",
        "semantic": "立",
        "phonetic": "耑"
    },
    "箇": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "固"
    },
    "維": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "隹"
    },
    "綱": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "岡"
    },
    "緒": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "者"
    },
    "網": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "罔"
    },
    "罰": {
        "type": "kaii"
    },
    "膜": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "莫"
    },
    "慕": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "莫"
    },
    "誓": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "折"
    },
    "誘": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "秀"
    },
    "踊": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "甬"
    },
    "遮": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "庶"
    },
    "遭": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "曹"
    },
    "酵": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "孝"
    },
    "酷": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "告"
    },
    "銃": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "充"
    },
    "銑": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "先"
    },
    "銘": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "名"
    },
    "閥": {
        "type": "keisei",
        "semantic": "門",
        "phonetic": "伐"
    },
    "隠": {
        "type": "shinjitai"
    },
    "需": {
        "type": "kaii"
    },
    "駆": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "区"
    },
    "駄": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "太"
    },
    "髪": {
        "type": "keisei",
        "semantic": "髟",
        "phonetic": "犮"
    },
    "魂": {
        "type": "kaii"
    },
    "錬": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "柬"
    },
    "緯": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "韋"
    },
    "韻": {
        "type": "keisei",
        "semantic": "音",
        "phonetic": "員"
    },
    "影": {
        "type": "keisei",
        "semantic": "彡",
        "phonetic": "景"
    },
    "鋭": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "兑"
    },
    "謁": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "曷"
    },
    "閲": {
        "type": "keisei",
        "semantic": "門",
        "phonetic": "兑"
    },
    "縁": {
        "type": "shinjitai"
    },
    "憶": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "意"
    },
    "穏": {
        "type": "shinjitai"
    },
    "稼": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "家"
    },
    "餓": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "我"
    },
    "壊": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "褱"
    },
    "懐": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "褱"
    },
    "嚇": {
        "type": "unknown"
    },
    "獲": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "蒦"
    },
    "穫": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "蒦"
    },
    "潟": {
        "type": "unknown"
    },
    "轄": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "害"
    },
    "憾": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "感"
    },
    "歓": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "雚"
    },
    "環": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "睘"
    },
    "監": {
        "type": "kaii"
    },
    "緩": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "爰"
    },
    "艦": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "監"
    },
    "還": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "睘"
    },
    "鑑": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "監"
    },
    "輝": {
        "type": "keisei",
        "semantic": "光",
        "phonetic": "軍"
    },
    "騎": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "奇"
    },
    "儀": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "義"
    },
    "戯": {
        "type": "unknown"
    },
    "擬": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "疑"
    },
    "犠": {
        "type": "keisei",
        "semantic": "牛",
        "phonetic": "義"
    },
    "窮": {
        "type": "unknown"
    },
    "矯": {
        "type": "keisei",
        "semantic": "矢",
        "phonetic": "喬"
    },
    "響": {
        "type": "keisei",
        "semantic": "音",
        "phonetic": "郷"
    },
    "驚": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "敬"
    },
    "凝": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "疑"
    },
    "緊": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "臤"
    },
    "襟": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "禁"
    },
    "謹": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "堇"
    },
    "繰": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "喿"
    },
    "勲": {
        "type": "keisei",
        "semantic": "力",
        "phonetic": "熏"
    },
    "薫": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "熏"
    },
    "慶": {
        "type": "unknown"
    },
    "憩": {
        "type": "unknown"
    },
    "鶏": {
        "type": "keisei",
        "semantic": "鳥",
        "phonetic": "奚"
    },
    "鯨": {
        "type": "keisei",
        "semantic": "魚",
        "phonetic": "京"
    },
    "撃": {
        "type": "unknown"
    },
    "懸": {
        "type": "unknown"
    },
    "謙": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "兼"
    },
    "賢": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "臤"
    },
    "顕": {
        "type": "unknown"
    },
    "顧": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "雇"
    },
    "稿": {
        "type": "keisei",
        "semantic": "禾",
        "phonetic": "高"
    },
    "衡": {
        "type": "keisei",
        "semantic": "角",
        "phonetic": "行"
    },
    "購": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "冓"
    },
    "墾": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "豤"
    },
    "懇": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "豤"
    },
    "鎖": {
        "type": "unknown"
    },
    "錯": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "昔"
    },
    "撮": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "最"
    },
    "擦": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "察"
    },
    "暫": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "斬"
    },
    "諮": {
        "type": "unknown"
    },
    "賜": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "易"
    },
    "璽": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "爾"
    },
    "爵": {
        "type": "unknown"
    },
    "趣": {
        "type": "keisei",
        "semantic": "走",
        "phonetic": "取"
    },
    "儒": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "需"
    },
    "襲": {
        "type": "unknown"
    },
    "醜": {
        "type": "keisei",
        "semantic": "鬼",
        "phonetic": "酉"
    },
    "獣": {
        "type": "unknown"
    },
    "瞬": {
        "type": "unknown"
    },
    "潤": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "閏"
    },
    "遵": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "尊"
    },
    "償": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "賞"
    },
    "礁": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "焦"
    },
    "衝": {
        "type": "keisei",
        "semantic": "行",
        "phonetic": "重"
    },
    "鐘": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "童"
    },
    "壌": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "㐮"
    },
    "嬢": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "㐮"
    },
    "譲": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "㐮"
    },
    "醸": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "㐮"
    },
    "錠": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "定"
    },
    "嘱": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "属"
    },
    "審": {
        "type": "unknown"
    },
    "薪": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "新"
    },
    "震": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "辰"
    },
    "錘": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "垂"
    },
    "髄": {
        "type": "keisei",
        "semantic": "骨",
        "phonetic": "迶"
    },
    "澄": {
        "type": "unknown"
    },
    "瀬": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "頼"
    },
    "請": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "青"
    },
    "籍": {
        "type": "unknown"
    },
    "潜": {
        "type": "unknown"
    },
    "繊": {
        "type": "unknown"
    },
    "薦": {
        "type": "unknown"
    },
    "遷": {
        "type": "unknown"
    },
    "鮮": {
        "type": "unknown"
    },
    "繕": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "善"
    },
    "礎": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "楚"
    },
    "槽": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "曹"
    },
    "燥": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "喿"
    },
    "藻": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "喿"
    },
    "霜": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "相"
    },
    "騒": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "蚤"
    },
    "贈": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "曽"
    },
    "濯": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "翟"
    },
    "濁": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "蜀"
    },
    "諾": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "若"
    },
    "鍛": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "段"
    },
    "壇": {
        "type": "unknown"
    },
    "鋳": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "寿"
    },
    "駐": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "主"
    },
    "懲": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "徴"
    },
    "聴": {
        "type": "unknown"
    },
    "鎮": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "真"
    },
    "墜": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "隊"
    },
    "締": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "帝"
    },
    "徹": {
        "type": "unknown"
    },
    "撤": {
        "type": "unknown"
    },
    "謄": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "朕"
    },
    "踏": {
        "type": "unknown"
    },
    "騰": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "朕"
    },
    "闘": {
        "type": "unknown"
    },
    "篤": {
        "type": "unknown"
    },
    "曇": {
        "type": "kaii"
    },
    "縄": {
        "type": "unknown"
    },
    "濃": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "農"
    },
    "覇": {
        "type": "unknown"
    },
    "輩": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "非"
    },
    "賠": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "咅"
    },
    "薄": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "溥"
    },
    "爆": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "暴"
    },
    "縛": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "尃"
    },
    "繁": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "敏"
    },
    "藩": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "潘"
    },
    "範": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "氾"
    },
    "盤": {
        "type": "keisei",
        "semantic": "皿",
        "phonetic": "般"
    },
    "罷": {
        "type": "kaii"
    },
    "避": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "辟"
    },
    "賓": {
        "type": "unknown"
    },
    "頻": {
        "type": "kaii"
    },
    "敷": {
        "type": "keisei",
        "semantic": "攴",
        "phonetic": "尃"
    },
    "膚": {
        "type": "unknown"
    },
    "譜": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "普"
    },
    "賦": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "武"
    },
    "舞": {
        "type": "keisei",
        "semantic": "舛",
        "phonetic": "無"
    },
    "覆": {
        "type": "keisei",
        "semantic": "襾",
        "phonetic": "复"
    },
    "噴": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "賁"
    },
    "墳": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "賁"
    },
    "憤": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "賁"
    },
    "幣": {
        "type": "keisei",
        "semantic": "巾",
        "phonetic": "敝"
    },
    "弊": {
        "type": "keisei",
        "semantic": "廾",
        "phonetic": "敝"
    },
    "壁": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "辟"
    },
    "癖": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "辟"
    },
    "舗": {
        "type": "keisei",
        "semantic": "舎",
        "phonetic": "甫"
    },
    "穂": {
        "type": "unknown"
    },
    "簿": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "溥"
    },
    "縫": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "夆"
    },
    "褒": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "保"
    },
    "膨": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "彭"
    },
    "謀": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "某"
    },
    "墨": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "黒"
    },
    "撲": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "菐"
    },
    "翻": {
        "type": "keisei",
        "semantic": "羽",
        "phonetic": "番"
    },
    "摩": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "麻"
    },
    "磨": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "麻"
    },
    "魔": {
        "type": "keisei",
        "semantic": "鬼",
        "phonetic": "麻"
    },
    "繭": {
        "type": "kaii"
    },
    "魅": {
        "type": "keisei",
        "semantic": "鬼",
        "phonetic": "未"
    },
    "霧": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "務"
    },
    "黙": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "黒"
    },
    "躍": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "翟"
    },
    "癒": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "兪"
    },
    "諭": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "兪"
    },
    "憂": {
        "type": "kaii"
    },
    "融": {
        "type": "unknown"
    },
    "慰": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "尉"
    },
    "窯": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "羔"
    },
    "謡": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "䍃"
    },
    "翼": {
        "type": "keisei",
        "semantic": "羽",
        "phonetic": "異"
    },
    "羅": {
        "type": "kaii"
    },
    "頼": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "剌"
    },
    "欄": {
        "type": "unknown"
    },
    "濫": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "監"
    },
    "履": {
        "type": "kaii"
    },
    "離": {
        "type": "keisei",
        "semantic": "隹",
        "phonetic": "离"
    },
    "慮": {
        "type": "unknown"
    },
    "寮": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "尞"
    },
    "療": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "尞"
    },
    "糧": {
        "type": "keisei",
        "semantic": "米",
        "phonetic": "量"
    },
    "隣": {
        "type": "unknown"
    },
    "隷": {
        "type": "keisei",
        "semantic": "柰",
        "phonetic": "隶"
    },
    "霊": {
        "type": "unknown"
    },
    "麗": {
        "type": "kaii"
    },
    "齢": {
        "type": "keisei",
        "semantic": "歯",
        "phonetic": "令"
    },
    "擁": {
        "type": "unknown"
    },
    "露": {
        "type": "keisei",
        "semantic": "雨",
        "phonetic": "路"
    },
    "藤": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "滕"
    },
    "誰": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "隹"
    },
    "俺": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "奄"
    },
    "岡": {
        "type": "kaii"
    },
    "頃": {
        "type": "kaii"
    },
    "奈": {
        "type": "unknown"
    },
    "阪": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "反"
    },
    "韓": {
        "type": "unknown"
    },
    "弥": {
        "type": "keisei",
        "semantic": "弓",
        "phonetic": "爾"
    },
    "那": {
        "type": "unknown"
    },
    "鹿": {
        "type": "shoukei"
    },
    "斬": {
        "type": "kaii"
    },
    "虎": {
        "type": "shoukei"
    },
    "狙": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "且"
    },
    "脇": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "劦"
    },
    "熊": {
        "type": "unknown"
    },
    "尻": {
        "type": "keisei",
        "semantic": "尸",
        "phonetic": "九"
    },
    "旦": {
        "type": "kaii"
    },
    "闇": {
        "type": "keisei",
        "semantic": "門",
        "phonetic": "音"
    },
    "籠": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "竜"
    },
    "呂": {
        "type": "shoukei"
    },
    "亀": {
        "type": "shoukei"
    },
    "膝": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "桼"
    },
    "鶴": {
        "type": "keisei",
        "semantic": "鳥",
        "phonetic": "隺"
    },
    "匂": {
        "type": "kokuji"
    },
    "沙": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "少"
    },
    "須": {
        "type": "kaii"
    },
    "椅": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "奇"
    },
    "股": {
        "type": "unknown"
    },
    "眉": {
        "type": "shoukei"
    },
    "挨": {
        "type": "unknown"
    },
    "拶": {
        "type": "unknown"
    },
    "鎌": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "兼"
    },
    "凄": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "妻"
    },
    "謎": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "迷"
    },
    "稽": {
        "type": "kaii"
    },
    "曾": {
        "type": "shoukei"
    },
    "喉": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "侯"
    },
    "拭": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "式"
    },
    "貌": {
        "type": "unknown"
    },
    "塞": {
        "type": "unknown"
    },
    "蹴": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "就"
    },
    "鍵": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "建"
    },
    "膳": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "善"
    },
    "袖": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "由"
    },
    "潰": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "貴"
    },
    "駒": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "句"
    },
    "剥": {
        "type": "keisei",
        "semantic": "刀",
        "phonetic": "彔"
    },
    "鍋": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "咼"
    },
    "湧": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "勇"
    },
    "葛": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "曷"
    },
    "梨": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "利"
    },
    "貼": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "占"
    },
    "拉": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "立"
    },
    "枕": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "冘"
    },
    "顎": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "咢"
    },
    "苛": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "可"
    },
    "蓋": {
        "type": "unknown"
    },
    "裾": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "居"
    },
    "腫": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "重"
    },
    "爪": {
        "type": "shoukei"
    },
    "嵐": {
        "type": "unknown"
    },
    "鬱": {
        "type": "unknown"
    },
    "妖": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "夭"
    },
    "藍": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "監"
    },
    "捉": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "足"
    },
    "宛": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "夗"
    },
    "崖": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "厓"
    },
    "叱": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "七"
    },
    "瓦": {
        "type": "shoukei"
    },
    "拳": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "龹"
    },
    "乞": {
        "type": "shoukei"
    },
    "呪": {
        "type": "unknown"
    },
    "汰": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "太"
    },
    "勃": {
        "type": "unknown"
    },
    "昧": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "未"
    },
    "唾": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "垂"
    },
    "艶": {
        "type": "shinjitai"
    },
    "痕": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "艮"
    },
    "諦": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "帝"
    },
    "餅": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "并"
    },
    "瞳": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "童"
    },
    "唄": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "貝"
    },
    "隙": {
        "type": "unknown"
    },
    "淫": {
        "type": "unknown"
    },
    "錦": {
        "type": "keisei",
        "semantic": "帛",
        "phonetic": "金"
    },
    "箸": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "者"
    },
    "戚": {
        "type": "keisei",
        "semantic": "戊",
        "phonetic": "尗"
    },
    "蒙": {
        "type": "unknown"
    },
    "妬": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "石"
    },
    "蔑": {
        "type": "kaii"
    },
    "嗅": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "臭"
    },
    "蜜": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "宓"
    },
    "戴": {
        "type": "keisei",
        "semantic": "異",
        "phonetic": "𢦏"
    },
    "痩": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "叟"
    },
    "怨": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "夗"
    },
    "醒": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "星"
    },
    "詣": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "旨"
    },
    "窟": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "屈"
    },
    "巾": {
        "type": "shoukei"
    },
    "蜂": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "夆"
    },
    "骸": {
        "type": "keisei",
        "semantic": "骨",
        "phonetic": "亥"
    },
    "弄": {
        "type": "kaii"
    },
    "嫉": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "疾"
    },
    "罵": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "馬"
    },
    "璧": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "辟"
    },
    "阜": {
        "type": "unknown"
    },
    "埼": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "奇"
    },
    "伎": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "支"
    },
    "曖": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "愛"
    },
    "餌": {
        "type": "keisei",
        "semantic": "食",
        "phonetic": "耳"
    },
    "爽": {
        "type": "kaii"
    },
    "詮": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "全"
    },
    "芯": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "心"
    },
    "綻": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "定"
    },
    "肘": {
        "type": "kaii"
    },
    "麓": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "鹿"
    },
    "憧": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "童"
    },
    "頓": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "屯"
    },
    "牙": {
        "type": "shoukei"
    },
    "咽": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "因"
    },
    "嘲": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "朝"
    },
    "臆": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "意"
    },
    "挫": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "坐"
    },
    "溺": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "弱"
    },
    "侶": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "呂"
    },
    "丼": {
        "type": "kaii"
    },
    "瘍": {
        "type": "keisei",
        "semantic": "疒",
        "phonetic": "昜"
    },
    "僅": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "堇"
    },
    "諜": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "枼"
    },
    "柵": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "冊"
    },
    "腎": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "臤"
    },
    "梗": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "更"
    },
    "瑠": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "留"
    },
    "羨": {
        "type": "unknown"
    },
    "酎": {
        "type": "unknown"
    },
    "畿": {
        "type": "keisei",
        "semantic": "田",
        "phonetic": "幾"
    },
    "畏": {
        "type": "unknown"
    },
    "瞭": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "尞"
    },
    "踪": {
        "type": "keisei",
        "semantic": "足",
        "phonetic": "宗"
    },
    "栃": {
        "type": "kokuji"
    },
    "蔽": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "敝"
    },
    "茨": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "次"
    },
    "慄": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "栗"
    },
    "傲": {
        "type": "unknown"
    },
    "虹": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "工"
    },
    "捻": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "念"
    },
    "臼": {
        "type": "shoukei"
    },
    "喩": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "兪"
    },
    "萎": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "委"
    },
    "腺": {
        "type": "keisei",
        "semantic": "月",
        "phonetic": "泉"
    },
    "桁": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "行"
    },
    "玩": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "元"
    },
    "冶": {
        "type": "unknown"
    },
    "羞": {
        "type": "kaii"
    },
    "惧": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "具"
    },
    "舷": {
        "type": "keisei",
        "semantic": "舟",
        "phonetic": "玄"
    },
    "貪": {
        "type": "unknown"
    },
    "采": {
        "type": "kaii"
    },
    "堆": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "隹"
    },
    "煎": {
        "type": "keisei",
        "semantic": "火",
        "phonetic": "前"
    },
    "斑": {
        "type": "unknown"
    },
    "冥": {
        "type": "unknown"
    },
    "遜": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "孫"
    },
    "旺": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "王"
    },
    "麺": {
        "type": "keisei",
        "semantic": "麦",
        "phonetic": "面"
    },
    "璃": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "离"
    },
    "串": {
        "type": "shoukei"
    },
    "填": {
        "type": "unknown"
    },
    "箋": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "戔"
    },
    "脊": {
        "type": "shoukei"
    },
    "緻": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "致"
    },
    "辣": {
        "type": "keisei",
        "semantic": "辛",
        "phonetic": "剌"
    },
    "摯": {
        "type": "unknown"
    },
    "汎": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "凡"
    },
    "憚": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "単"
    },
    "哨": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "肖"
    },
    "氾": {
        "type": "shoukei"
    },
    "諧": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "皆"
    },
    "媛": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "爰"
    },
    "彙": {
        "type": "unknown"
    },
    "恣": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "次"
    },
    "聘": {
        "type": "unknown"
    },
    "沃": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "夭"
    },
    "憬": {
        "type": "keisei",
        "semantic": "心",
        "phonetic": "景"
    },
    "捗": {
        "type": "unknown"
    },
    "訃": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "卜"
    },
    "遥": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "䍃"
    },
    "椎": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "隹"
    },
    "茜": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "西"
    },
    "吾": {
        "type": "unknown"
    },
    "贅": {
        "type": "unknown"
    },
    "綺": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "奇"
    },
    "々": {
        "type": "unknown"
    },
    "噌": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "曽"
    },
    "醤": {
        "type": "keisei",
        "semantic": "酉",
        "phonetic": "将"
    },
    "賂": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "各"
    },
    "斐": {
        "type": "keisei",
        "semantic": "文",
        "phonetic": "非"
    },
    "墟": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "虚"
    },
    "笠": {
        "type": "keisei",
        "semantic": "竹",
        "phonetic": "立"
    },
    "也": {
        "type": "shoukei"
    },
    "翔": {
        "type": "keisei",
        "semantic": "羽",
        "phonetic": "羊"
    },
    "鳩": {
        "type": "keisei",
        "semantic": "鳥",
        "phonetic": "九"
    },
    "庄": {
        "type": "unknown"
    },
    "伊": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "尹"
    },
    "鰐": {
        "type": "keisei",
        "semantic": "魚",
        "phonetic": "咢"
    },
    "蟹": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "解"
    },
    "堰": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "匽"
    },
    "淀": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "定"
    },
    "蓮": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "連"
    },
    "亮": {
        "type": "unknown"
    },
    "聡": {
        "type": "keisei",
        "semantic": "耳",
        "phonetic": "悤"
    },
    "乃": {
        "type": "shoukei"
    },
    "綾": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "夌"
    },
    "颯": {
        "type": "kaii"
    },
    "隼": {
        "type": "unknown"
    },
    "輔": {
        "type": "keisei",
        "semantic": "車",
        "phonetic": "甫"
    },
    "瓜": {
        "type": "shoukei"
    },
    "鯉": {
        "type": "keisei",
        "semantic": "魚",
        "phonetic": "里"
    },
    "緋": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "非"
    },
    "曙": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "署"
    },
    "胡": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "古"
    },
    "葵": {
        "type": "unknown"
    },
    "駿": {
        "type": "keisei",
        "semantic": "馬",
        "phonetic": "夋"
    },
    "諒": {
        "type": "keisei",
        "semantic": "言",
        "phonetic": "京"
    },
    "莉": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "利"
    },
    "呆": {
        "type": "unknown"
    },
    "哺": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "甫"
    },
    "阿": {
        "type": "keisei",
        "semantic": "阜",
        "phonetic": "可"
    },
    "杏": {
        "type": "unknown"
    },
    "栞": {
        "type": "unknown"
    },
    "昌": {
        "type": "unknown"
    },
    "之": {
        "type": "shoukei"
    },
    "龍": {
        "type": "shoukei"
    },
    "遼": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "尞"
    },
    "瑛": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "英"
    },
    "靖": {
        "type": "keisei",
        "semantic": "立",
        "phonetic": "青"
    },
    "嘉": {
        "type": "keisei",
        "semantic": "壴",
        "phonetic": "加"
    },
    "蝶": {
        "type": "keisei",
        "semantic": "虫",
        "phonetic": "枼"
    },
    "凛": {
        "type": "unknown"
    },
    "智": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "知"
    },
    "柴": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "此"
    },
    "楓": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "風"
    },
    "萌": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "朋"
    },
    "烏": {
        "type": "shoukei"
    },
    "哉": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "𢦏"
    },
    "蒼": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "倉"
    },
    "凌": {
        "type": "keisei",
        "semantic": "冫",
        "phonetic": "夌"
    },
    "瑞": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "耑"
    },
    "菅": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "官"
    },
    "漣": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "連"
    },
    "梓": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "辛"
    },
    "睦": {
        "type": "keisei",
        "semantic": "目",
        "phonetic": "坴"
    },
    "狐": {
        "type": "keisei",
        "semantic": "犬",
        "phonetic": "瓜"
    },
    "賭": {
        "type": "keisei",
        "semantic": "貝",
        "phonetic": "者"
    },
    "錮": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "固"
    },
    "楷": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "皆"
    },
    "遡": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "朔"
    },
    "刹": {
        "type": "unknown"
    },
    "柿": {
        "type": "keisei",
        "semantic": "⽊",
        "phonetic": "𠂔"
    },
    "釜": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "父"
    },
    "勾": {
        "type": "keisei",
        "semantic": "勹",
        "phonetic": "口"
    },
    "毀": {
        "type": "unknown"
    },
    "塡": {
        "type": "unknown"
    },
    "頰": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "夾"
    },
    "宁": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "丁"
    },
    "几": {
        "type": "shoukei"
    },
    "亢": {
        "type": "shoukei"
    },
    "圭": {
        "type": "kaii"
    },
    "兪": {
        "type": "kaii"
    },
    "莫": {
        "type": "kaii"
    },
    "妟": {
        "type": "unknown"
    },
    "睪": {
        "type": "unknown"
    },
    "匽": {
        "type": "keisei",
        "semantic": "匸",
        "phonetic": "妟"
    },
    "柬": {
        "type": "kaii"
    },
    "袁": {
        "type": "unknown"
    },
    "甫": {
        "type": "unknown"
    },
    "辰": {
        "type": "shoukei"
    },
    "艮": {
        "type": "kaii"
    },
    "其": {
        "type": "unknown"
    },
    "圣": {
        "type": "kaii"
    },
    "囟": {
        "type": "shoukei"
    },
    "昜": {
        "type": "unknown"
    },
    "卜": {
        "type": "shoukei"
    },
    "弋": {
        "type": "shoukei"
    },
    "氐": {
        "type": "kaii"
    },
    "兑": {
        "type": "unknown"
    },
    "曽": {
        "type": "shoukei"
    },
    "菐": {
        "type": "kaii"
    },
    "𢦏": {
        "type": "kaii"
    },
    "甬": {
        "type": "shoukei"
    },
    "㕣": {
        "type": "kaii"
    },
    "云": {
        "type": "shoukei"
    },
    "尞": {
        "type": "unknown"
    },
    "亲": {
        "type": "unknown"
    },
    "彦": {
        "type": "kaii"
    },
    "畐": {
        "type": "unknown"
    },
    "寅": {
        "type": "kaii"
    },
    "賁": {
        "type": "unknown"
    },
    "冓": {
        "type": "shoukei"
    },
    "弗": {
        "type": "unknown"
    },
    "丩": {
        "type": "shoukei"
    },
    "尹": {
        "type": "kaii"
    },
    "乍": {
        "type": "shoukei"
    },
    "朿": {
        "type": "shoukei"
    },
    "㑒": {
        "type": "kaii"
    },
    "蜀": {
        "type": "shoukei"
    },
    "亥": {
        "type": "shoukei"
    },
    "臧": {
        "type": "keisei",
        "semantic": "臣",
        "phonetic": "戕"
    },
    "戕": {
        "type": "keisei",
        "semantic": "戈",
        "phonetic": "爿"
    },
    "䍃": {
        "type": "unknown"
    },
    "厓": {
        "type": "keisei",
        "semantic": "厂",
        "phonetic": "圭"
    },
    "扁": {
        "type": "kaii"
    },
    "韋": {
        "type": "unknown"
    },
    "戠": {
        "type": "unknown"
    },
    "爰": {
        "type": "kaii"
    },
    "睘": {
        "type": "unknown"
    },
    "瞏": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "袁"
    },
    "堇": {
        "type": "unknown"
    },
    "𦰩": {
        "type": "unknown"
    },
    "𡈼": {
        "type": "shiji"
    },
    "于": {
        "type": "shiji"
    },
    "厶": {
        "type": "shoukei"
    },
    "厷": {
        "type": "shoukei"
    },
    "勿": {
        "type": "shoukei"
    },
    "朮": {
        "type": "shoukei"
    },
    "妾": {
        "type": "kaii"
    },
    "敄": {
        "type": "unknown"
    },
    "熒": {
        "type": "unknown"
    },
    "复": {
        "type": "unknown"
    },
    "咸": {
        "type": "kaii"
    },
    "或": {
        "type": "kaii"
    },
    "侖": {
        "type": "kaii"
    },
    "巽": {
        "type": "unknown"
    },
    "彔": {
        "type": "shoukei"
    },
    "竟": {
        "type": "unknown"
    },
    "𠬝": {
        "type": "unknown"
    },
    "开": {
        "type": "unknown"
    },
    "喬": {
        "type": "unknown"
    },
    "㐬": {
        "type": "shoukei"
    },
    "㫃": {
        "type": "shoukei"
    },
    "栗": {
        "type": "shoukei"
    },
    "罔": {
        "type": "keisei",
        "semantic": "网",
        "phonetic": "亡"
    },
    "壬": {
        "type": "shoukei"
    },
    "肙": {
        "type": "kaii"
    },
    "夭": {
        "type": "shoukei"
    },
    "关": {
        "type": "unknown"
    },
    "尃": {
        "type": "keisei",
        "semantic": "寸",
        "phonetic": "甫"
    },
    "溥": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "尃"
    },
    "滕": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "朕"
    },
    "疋": {
        "type": "shoukei"
    },
    "楚": {
        "type": "keisei",
        "semantic": "林",
        "phonetic": "疋"
    },
    "胥": {
        "type": "keisei",
        "semantic": "肉",
        "phonetic": "疋"
    },
    "乇": {
        "type": "shoukei"
    },
    "禺": {
        "type": "shoukei"
    },
    "聿": {
        "type": "kaii"
    },
    "叚": {
        "type": "kaii"
    },
    "孰": {
        "type": "kaii"
    },
    "攸": {
        "type": "kaii"
    },
    "屰": {
        "type": "shoukei"
    },
    "隹": {
        "type": "shoukei"
    },
    "崔": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "隹"
    },
    "奞": {
        "type": "kaii"
    },
    "雚": {
        "type": "kaii"
    },
    "隺": {
        "type": "unknown"
    },
    "此": {
        "type": "kaii"
    },
    "翟": {
        "type": "kaii"
    },
    "蒦": {
        "type": "kaii"
    },
    "离": {
        "type": "shoukei"
    },
    "羕": {
        "type": "unknown"
    },
    "啇": {
        "type": "kaii"
    },
    "犮": {
        "type": "shoukei"
    },
    "㒼": {
        "type": "shoukei"
    },
    "爿": {
        "type": "shoukei"
    },
    "臤": {
        "type": "kaii"
    },
    "熏": {
        "type": "kaii"
    },
    "蚤": {
        "type": "unknown"
    },
    "卂": {
        "type": "shoukei"
    },
    "卬": {
        "type": "kaii"
    },
    "癶": {
        "type": "unknown"
    },
    "羍": {
        "type": "kaii"
    },
    "賈": {
        "type": "unknown"
    },
    "垔": {
        "type": "unknown"
    },
    "咅": {
        "type": "unknown"
    },
    "夆": {
        "type": "keisei",
        "semantic": "夂",
        "phonetic": "丰"
    },
    "亘": {
        "type": "unknown"
    },
    "夬": {
        "type": "shoukei"
    },
    "咼": {
        "type": "unknown"
    },
    "彭": {
        "type": "kaii"
    },
    "剌": {
        "type": "unknown"
    },
    "夾": {
        "type": "kaii"
    },
    "坐": {
        "type": "kaii"
    },
    "㒸": {
        "type": "unknown"
    },
    "厤": {
        "type": "unknown"
    },
    "悤": {
        "type": "unknown"
    },
    "戔": {
        "type": "kaii"
    },
    "戊": {
        "type": "shoukei"
    },
    "羔": {
        "type": "shoukei"
    },
    "丂": {
        "type": "shoukei"
    },
    "隶": {
        "type": "kaii"
    },
    "𡿺": {
        "type": "unknown"
    },
    "爾": {
        "type": "kaii"
    },
    "閏": {
        "type": "kaii"
    },
    "耑": {
        "type": "shoukei"
    },
    "夌": {
        "type": "kaii"
    },
    "朋": {
        "type": "shoukei"
    },
    "它": {
        "type": "shoukei"
    },
    "龹": {
        "type": "unknown"
    },
    "坴": {
        "type": "unknown"
    },
    "埶": {
        "type": "kaii"
    },
    "夅": {
        "type": "kaii"
    },
    "罙": {
        "type": "unknown"
    },
    "荅": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "合"
    },
    "喿": {
        "type": "kaii"
    },
    "豦": {
        "type": "kaii"
    },
    "辟": {
        "type": "kaii"
    },
    "巴": {
        "type": "shoukei"
    },
    "彡": {
        "type": "shiji"
    },
    "㐱": {
        "type": "shoukei"
    },
    "丰": {
        "type": "shoukei"
    },
    "并": {
        "type": "kaii"
    },
    "酉": {
        "type": "shoukei"
    },
    "劦": {
        "type": "kaii"
    },
    "敝": {
        "type": "unknown"
    },
    "夋": {
        "type": "unknown"
    },
    "尗": {
        "type": "shoukei"
    },
    "冘": {
        "type": "unknown"
    },
    "倝": {
        "type": "unknown"
    },
    "曷": {
        "type": "unknown"
    },
    "畾": {
        "type": "shoukei"
    },
    "曼": {
        "type": "kaii"
    },
    "褱": {
        "type": "unknown"
    },
    "㐮": {
        "type": "unknown"
    },
    "奐": {
        "type": "kaii"
    },
    "茲": {
        "type": "unknown"
    },
    "桼": {
        "type": "shoukei"
    },
    "咢": {
        "type": "kaii"
    },
    "宓": {
        "type": "keisei",
        "semantic": "宀",
        "phonetic": "必"
    },
    "夗": {
        "type": "kaii"
    },
    "枼": {
        "type": "kaii"
    },
    "鬲": {
        "type": "shoukei"
    },
    "烝": {
        "type": "unknown"
    },
    "絜": {
        "type": "unknown"
    },
    "豤": {
        "type": "kaii"
    },
    "叟": {
        "type": "unknown"
    },
    "朔": {
        "type": "unknown"
    },
    "迶": {
        "type": "unknown"
    },
    "奚": {
        "type": "kaii"
    },
    "𠂔": {
        "type": "unknown"
    },
    "气": {
        "type": "shoukei"
    },
    "𤇾": {
        "type": "unknown"
    },
    "陏": {
        "type": "unknown"
    },
    "尭": {
        "type": "unknown"
    },
    "潘": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "番"
    },
    "卦": {
        "type": "keisei",
        "semantic": "卜",
        "phonetic": "圭"
    },
    "哥": {
        "type": "keisei",
        "semantic": "可",
        "phonetic": "可"
    },
    "䜌": {
        "type": "unknown"
    },
    "彬": {
        "type": "unknown"
    },
    "皐": {
        "type": "unknown"
    },
    "笹": {
        "type": "kokuji"
    },
    "槍": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "倉"
    },
    "悉": {
        "type": "unknown"
    },
    "蕪": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "無"
    },
    "斯": {
        "type": "unknown"
    },
    "鷹": {
        "type": "unknown"
    },
    "厩": {
        "type": "unknown"
    },
    "亦": {
        "type": "shiji"
    },
    "儲": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "諸"
    },
    "灸": {
        "type": "unknown"
    },
    "皓": {
        "type": "keisei",
        "semantic": "白",
        "phonetic": "告"
    },
    "苺": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "毎"
    },
    "曳": {
        "type": "shoukei"
    },
    "槙": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "真"
    },
    "汐": {
        "type": "unknown"
    },
    "暉": {
        "type": "keisei",
        "semantic": "日",
        "phonetic": "軍"
    },
    "欽": {
        "type": "keisei",
        "semantic": "欠",
        "phonetic": "金"
    },
    "淵": {
        "type": "unknown"
    },
    "叡": {
        "type": "unknown"
    },
    "偲": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "思"
    },
    "焚": {
        "type": "unknown"
    },
    "牒": {
        "type": "keisei",
        "semantic": "片",
        "phonetic": "枼"
    },
    "椋": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "京"
    },
    "杜": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "土"
    },
    "桧": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "会"
    },
    "桂": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "圭"
    },
    "姪": {
        "type": "keisei",
        "semantic": "女",
        "phonetic": "至"
    },
    "哩": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "里"
    },
    "李": {
        "type": "unknown"
    },
    "碩": {
        "type": "keisei",
        "semantic": "頁",
        "phonetic": "石"
    },
    "紬": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "由"
    },
    "肴": {
        "type": "unknown"
    },
    "菩": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "咅"
    },
    "磯": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "幾"
    },
    "煌": {
        "type": "unknown"
    },
    "瑶": {
        "type": "keisei",
        "semantic": "玉",
        "phonetic": "䍃"
    },
    "芹": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "斤"
    },
    "廿": {
        "type": "keisei",
        "semantic": "十",
        "phonetic": "十"
    },
    "芥": {
        "type": "keisei",
        "semantic": "艸",
        "phonetic": "介"
    },
    "洲": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "州"
    },
    "迦": {
        "type": "keisei",
        "semantic": "辵",
        "phonetic": "加"
    },
    "播": {
        "type": "keisei",
        "semantic": "手",
        "phonetic": "番"
    },
    "紗": {
        "type": "keisei",
        "semantic": "糸",
        "phonetic": "少"
    },
    "叶": {
        "type": "unknown"
    },
    "庵": {
        "type": "keisei",
        "semantic": "广",
        "phonetic": "奄"
    },
    "鴨": {
        "type": "keisei",
        "semantic": "鳥",
        "phonetic": "甲"
    },
    "坦": {
        "type": "keisei",
        "semantic": "土",
        "phonetic": "旦"
    },
    "竺": {
        "type": "unknown"
    },
    "奄": {
        "type": "unknown"
    },
    "砦": {
        "type": "keisei",
        "semantic": "石",
        "phonetic": "此"
    },
    "巳": {
        "type": "shoukei"
    },
    "丞": {
        "type": "kaii"
    },
    "榊": {
        "type": "kokuji"
    },
    "佑": {
        "type": "keisei",
        "semantic": "人",
        "phonetic": "右"
    },
    "娃": {
        "type": "unknown"
    },
    "窪": {
        "type": "unknown"
    },
    "濡": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "需"
    },
    "窄": {
        "type": "keisei",
        "semantic": "穴",
        "phonetic": "乍"
    },
    "犀": {
        "type": "unknown"
    },
    "袈": {
        "type": "keisei",
        "semantic": "衣",
        "phonetic": "加"
    },
    "峨": {
        "type": "keisei",
        "semantic": "山",
        "phonetic": "我"
    },
    "楯": {
        "type": "keisei",
        "semantic": "木",
        "phonetic": "盾"
    },
    "佃": {
        "type": "unknown"
    },
    "渚": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "者"
    },
    "錆": {
        "type": "keisei",
        "semantic": "金",
        "phonetic": "青"
    },
    "噂": {
        "type": "keisei",
        "semantic": "口",
        "phonetic": "尊"
    },
    "楠": {
        "type": "unknown"
    },
    "渾": {
        "type": "keisei",
        "semantic": "水",
        "phonetic": "軍"
    },
    "瀕": {
        "type": "unknown"
    },
    "隈": {
        "type": "unknown"
    }
}