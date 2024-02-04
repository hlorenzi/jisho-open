import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"


export function PageHelpAnki(props: Framework.RouteProps)
{
    return <Page title="Help / Anki">

        <Searchbox position="inline"/>
        <br/>

        <h1>
            Help &gt; 🎴 Anki
        </h1>
        <br/>
        Export your study lists and easily use them in the
        <Framework.Link
            label="Anki"
            href="https://apps.ankiweb.net/"
            addSpaces/>
        spaced-repetition memorization app.
        <br/>
        <br/>
        <br/>

        <h1>
            Import Settings
        </h1>
        <Framework.HorizontalBar/>
        <br/>

        <h2>Step 1</h2>
        On the desktop version of Anki,
        create a new Note Type by going into Add &gt; Type &gt; Manage &gt; Add, then
        select any template.
        <br/>
        <br/>
        <Framework.Image
            src="/ankiImport1.png"
            style={{
                margin: "0 auto",
                width: "26em",
                "height": "auto",
                "max-width": "100%",
                "border-radius": Framework.themeVar("borderRadius"),
            }}/>
        <br/>
        <br/>

        <h2>Step 2</h2>
        Back to the Add window, make sure your newly-created Note Type
        is shown on the Type button, then use the "Fields..." button to set up the
        required fields as shown.
        <br/>
        <br/>
        <Framework.Image
            src="/ankiImport2.png"
            style={{
                margin: "0 auto",
                width: "32em",
                "height": "auto",
                "max-width": "100%",
                "border-radius": Framework.themeVar("borderRadius"),
            }}/>
        <br/>
        <br/>

        <h2>Step 3</h2>
        Go to File &gt; Import..., then select the exported .tsv file.
        Make sure you select the "Note Type" you created in Step 1.
        Select a "Deck" of your preference.
        Set "Existing Notes" to "Update".
        Make sure the "Field Mapping" is as shown.
        Then click "Import" at the top of the window.
        <br/>
        <br/>
        <Framework.Image
            src="/ankiImport3.png"
            style={{
                margin: "0 auto",
                width: "36em",
                "height": "auto",
                "max-width": "100%",
                "border-radius": Framework.themeVar("borderRadius"),
            }}/>

        <br/>
        <br/>
        <br/>
        <h1>
            Card Styling
        </h1>
        <Framework.HorizontalBar/>
        <br/>

        <div style={{ "text-align": "center" }}>
            <Framework.Image
                src="/ankiCard.png"
                style={{
                    margin: "0 auto",
                    width: "26em",
                    "height": "auto",
                    "max-width": "100%",
                    "border-radius": Framework.themeVar("borderRadius"),
                }}/>
        </div>
        <br/>
        You can use the following code to format your cards as shown above.
        The data was exported from a study list with HTML/CSS enabled.
        It works well on the desktop Anki app and on AnkiWeb.
        The dark theme is handled automatically by the desktop Anki app.
        <br/>
        <br/>
        <h2>Front template:</h2>
        <Framework.TextArea
            initialValue={ frontTemplate }
            readOnly
            style={{
                width: "100%",
                height: "16em",
        }}/>

        <br/>
        <br/>
        <h2>Back template:</h2>
        <Framework.TextArea
            initialValue={ backTemplate }
            readOnly
            style={{
                width: "100%",
                height: "16em",
        }}/>

        <br/>
        <br/>
        <h2>Styling:</h2>
        <Framework.TextArea
            initialValue={ stylingTemplate }
            readOnly
            style={{
                width: "100%",
                height: "16em",
        }}/>

        <br/>
        <br/>
        <h2>AnkiWeb Dark Theme Hack / Alternative Styling</h2>
        <Framework.TextArea
            initialValue={ ankiWebDarkThemeStylingHack }
            readOnly
            style={{
                width: "100%",
                height: "16em",
        }}/>

    </Page>
}


const frontTemplate =
`<div lang="ja" class="word">
{{Word}}
</div>`


const backTemplate =
`<div lang="ja" class="reading">
{{Reading}}
</div>

<div class="meaning">{{Meaning}}</div>
<br/>
<br/>
<div lang="ja" class="pitch">
{{Pitch}}
</div>`


const stylingTemplate =
`.card {
	color: black;
	background-color: white;
	font-size: 0.6em;
}

.word, .reading {
	font-family: 'MS UI Gothic Regular', sans-serif;
	text-align: center;
	font-size: 8em;
}

.meaning {
	text-align: left;
	font-size: 2em;
	width: 30em;
	max-width: 100%;
	margin: auto;
}

.pitch {
	font-family: 'MS UI Gothic Regular', sans-serif;
	text-align: center;
	font-size: 4em;
}`


const ankiWebDarkThemeStylingHack =
`html {
	background: #161718 !important;
}

* {
	background-color: #161718 !important;
	border-color: #dcddde !important;
	color: #dcddde;
}

.card {
	color: #dcddde;
	background-color: #2c2e31;
	font-size: 0.6em;
}

.word, .reading {
	font-family: 'MS UI Gothic Regular', sans-serif;
	text-align: center;
	font-size: 8em;
}

.meaning {
	text-align: left;
	font-size: 2em;
	width: 30em;
	max-width: 100%;
	margin: auto;
}

.pitch {
	font-family: 'MS UI Gothic Regular', sans-serif;
	text-align: center;
	font-size: 4em;
}`