import * as JmdictRaw from "./jmdict_raw.ts"
import * as Api from "common/api/index.ts"


export type Entry = {
    ent_seq: [string]
    k_ele?: JmdictRaw.EntryKEle[]
    r_ele: JmdictRaw.EntryREle[]
    trans: Trans[]
}


export type Trans = {
    name_type: Api.Word.PartOfSpeechTag[]
    trans_det: string[]
    xref?: string[]
}