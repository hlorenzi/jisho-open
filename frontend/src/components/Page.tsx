import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { UserLabel } from "./User.tsx"
import { SearchboxBottomOverlay } from "./Searchbox.tsx"


export function Page(props: {
    title?: string,
    children?: Solid.JSX.Element,
    searchQuery?: string,
})
{
    return <>
        <Framework.Page
            siteTitle="Lorenzi's Jisho"
            title={ props.title }
            sideMenu={ () => <SideMenu/> }
        >
            { props.children }
            <Footer/>
        </Framework.Page>
        
        <Framework.PageOverlay
            childrenBottom={
                <>
                <Framework.NavigationButtons/>
                <SearchboxBottomOverlay searchQuery={ props.searchQuery }/>
                </>
            }
        />
    </>
}


function SideMenu()
{
    const authUser = Framework.createAsyncSignal(
        null,
        async () => {
            return await App.Api.authenticate()
        })

    const [isSettingsOpen, setSettingsOpen] = Solid.createSignal(false)

    const redirectUrl = window.location.href
        
    return <>
        <Solid.Show when={ !isSettingsOpen() }>
            <Framework.ButtonPopupPageWide
                label="Home"
                href={ "/" }
            />

            <Framework.ButtonPopupPageWide
                label="Community"
                href={ App.Pages.Community.url }
            />

            <Framework.ButtonPopupPageWide
                icon={ <Framework.IconDownload/> }
                label="Install App"
                onClick={ Framework.pwaInstall }
            />

            <Framework.HorizontalBar/>

            <Framework.ButtonPopupPageWide
                icon={ <Framework.IconWrench/> }
                label="Settings"
                onClick={ () => setSettingsOpen(true) }
            />

            <Framework.ButtonPopupPageWide
                icon={ <Framework.IconHelp/> }
                label="Help"
                href={ App.Pages.Help.url }
            />

            <Framework.HorizontalBar/>

            <Solid.Show when={ !authUser().loading } fallback={
                <Framework.LoadingBar/>
            }>
                <Solid.Show when={ !authUser().latest?.id }>
                    <Framework.ButtonPopupPageWide
                        label="Log in"
                        href={ App.Api.Login.urlForRedirect(redirectUrl) }
                        native
                    />
                </Solid.Show>

                <Solid.Show when={ authUser().latest?.id }>
                    <Framework.ButtonPopupPageWide
                        label={ <UserLabel user={ authUser().latest }/> }
                        href={ App.Pages.User.urlForUserId(authUser().latest!.id!) }
                    />
                    <Framework.ButtonPopupPageWide
                        label="Log out"
                        href={ App.Api.Logout.urlForRedirect(redirectUrl) }
                        native
                    />
                    <Solid.Show when={ App.Api.userIsAdmin(authUser().latest!) }>
                        <Framework.HorizontalBar/>

                        <Framework.ButtonPopupPageWide
                            label="Admin: Server Log"
                            href={ App.Pages.Log.url }
                        />

                        <Framework.ButtonPopupPageWide
                            label="Admin: Git Update"
                            onClick={ () => {
                                if (!window.confirm("Perform a git update on the server?"))
                                    return

                                window.location.href = App.Api.AdminGitUpdate.url
                            }}
                        />

                        <Framework.ButtonPopupPageWide
                            label="Admin: DB Refresh"
                            onClick={ () => {
                                if (!window.confirm("Perform a DB refresh on the server?"))
                                    return

                                window.location.href = App.Api.AdminDbRefresh.url
                            }}
                        />
                    </Solid.Show>
                </Solid.Show>
            </Solid.Show>
        </Solid.Show>
        
        <Solid.Show when={ isSettingsOpen() }>
            <SettingsPanel
                back={ () => setSettingsOpen(false) }
            />
        </Solid.Show>
    </>
}


function SettingsPanel(props: {
    back: () => void,
})
{
    return <>
        <Framework.ButtonPopupPageWide
            icon={ <Framework.IconArrowLeft/> }
            label="Back"
            onClick={ props.back }
        />
        
        <Framework.Select
            label="Theme"
            value={ () => App.usePrefs().theme }
            onChange={ (value) => App.mergePrefs({ theme: value }) }
            options={ [
                { label: "System Light/Dark", value: Framework.systemThemeId },
                ...Framework.themes.map(th => ({
                    label: th.name,
                    value: th.id,
                })),
            ]}
        />

        <Framework.HorizontalBar/>
        
        <Framework.Select
            label="Searchbox Position"
            value={ () => App.usePrefs().searchboxPosition }
            onChange={ (value) => App.mergePrefs({ searchboxPosition: value }) }
            options={ [
                { label: "Top of Page", value: "inline" },
                { label: "Bottom of Page", value: "bottom" },
            ]}
        />
        
        <Framework.Select
            label="Japanese Font Style"
            value={ () => App.usePrefs().japaneseFontStyle }
            onChange={ (value) => App.mergePrefs({ japaneseFontStyle: value }) }
            options={ [
                { label: "Regular", value: "regular" },
                { label: "Half-Bold", value: "half-bold" },
                { label: "Bold", value: "bold" },
            ]}
        />
        
        <Framework.Select
            label="Word Heading Size"
            value={ () => App.usePrefs().resultsWordHeadingSize }
            onChange={ (value) => App.mergePrefs({ resultsWordHeadingSize: value }) }
            options={ [
                { label: "Regular", value: "regular" },
                { label: "Large", value: "large" },
                { label: "Larger", value: "larger" },
                { label: "Largest", value: "largest" },
            ]}
        />
        
        <Framework.Select
            label="Word Spellings"
            value={ () => App.usePrefs().resultsShowWordSpellings ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ resultsShowWordSpellings: value === "on" }) }
            options={ [
                { label: "Toggleable", value: "off" },
                { label: "Show Always", value: "on" },
            ]}
        />
        
        <Framework.Select
            label="Word Ranking Tags"
            value={ () => App.usePrefs().resultsShowWordRankings ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ resultsShowWordRankings: value === "on" }) }
            options={ [
                { label: "Hide", value: "off" },
                { label: "Show", value: "on" },
            ]}
        />
        
        <Framework.Select
            label="Example Sentences"
            value={ () => App.usePrefs().resultsShowExampleSentences ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ resultsShowExampleSentences: value === "on" }) }
            options={ [
                { label: "Hide until expanded", value: "off" },
                { label: "Show always", value: "on" },
            ]}
        />

        <Framework.HorizontalBar/>
        
        <Framework.Select
            label="Debug Mode"
            value={ () => App.usePrefs().debugMode ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ debugMode: value === "on" }) }
            options={ [
                { label: "Off", value: "off" },
                { label: "On", value: "on" },
            ]}
        />
        
        <Framework.Select
            label="Search-Only Headings"
            value={ () => App.usePrefs().resultsShowSearchOnlyHeadings ? "on" : "off" }
            onChange={ (value) => App.mergePrefs({ resultsShowSearchOnlyHeadings: value === "on" }) }
            options={ [
                { label: "Hide", value: "off" },
                { label: "Show", value: "on" },
            ]}
        />

    </>
}


function Footer()
{
    return <>
        <StyledFooter>
            <Framework.HorizontalBar/>

            <FooterLinks>
                <Framework.Link href="https://hlorenzi.com">
                    <Framework.Image
                        alt="Lorenzi's Homepage"
                        src="https://accounts.hlorenzi.com/icon_round_75.png"
                        size="3em"
                    />
                </Framework.Link>
                { " " }
                <Framework.Link href="https://accounts.hlorenzi.com/redirect/discord">
                    <Framework.Image
                        alt="Lorenzi's Discord Server"
                        src="https://accounts.hlorenzi.com/discord.png"
                        size="3em"
                    />
                </Framework.Link>
                { " " }
                <Framework.Link href={ App.githubUrl }>
                    <Framework.Image
                        alt="Jisho's GitHub repository"
                        src="https://accounts.hlorenzi.com/github.png"
                        size="3em"
                    />
                </Framework.Link>
                <br/>
                <br/>
                <Framework.Link href="https://accounts.hlorenzi.com">Manage your Account</Framework.Link>
                <br/>
                <br/>
                <Framework.Link href="https://accounts.hlorenzi.com/contact">Contact</Framework.Link>
            </FooterLinks>

            <LegalInfo>
                © 2023 hlorenzi
                <br/>
                <br/>
                Using dictionary files from <Framework.Link href="http://www.edrdg.org/jmdict/j_jmdict.html">JMdict</Framework.Link>,
                name entries from <Framework.Link href="https://www.edrdg.org/enamdict/enamdict_doc.html">JMnedict</Framework.Link>,
                kanji definitions from <Framework.Link href="http://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC</Framework.Link>,
                and kanji component data from <Framework.Link href="https://www.edrdg.org/krad/kradinf.html">KRADFILE</Framework.Link>,
                all used according to the group's <Framework.Link href="http://www.edrdg.org/edrdg/licence.html">license</Framework.Link>.
                <br/>
                <br/>
                Using JLPT data from <Framework.Link href="http://www.tanos.co.uk/jlpt/">Jonathan Waller's JLPT Resources</Framework.Link>.
                <br/>
                <br/>
                Using stroke order diagrams from <Framework.Link href="http://kanjivg.tagaini.net/">KanjiVG</Framework.Link>,
                according to the <Framework.Link href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-Share Alike 3.0 license</Framework.Link>.
                <br/>
                <br/>
                Using ideographic description sequences from <Framework.Link href="https://github.com/cjkvi/cjkvi-ids">this repository</Framework.Link> and
                the <Framework.Link href="http://www.chise.org/">CHISE project</Framework.Link>,
                according to the <Framework.Link href="http://git.chise.org/gitweb/?p=chise/ids.git;a=blob;f=README.en;h=194f3cedaf714b23ed2cbfe9c37ce8412e9ec426;hb=HEAD#l92">GPLv2 license</Framework.Link>.
                <br/>
                <br/>
                Using kanji analysis data from <Framework.Link href="https://github.com/mwil/wanikani-userscripts">this repository</Framework.Link>,
                according to the <Framework.Link href="https://github.com/mwil/wanikani-userscripts/blob/master/LICENSE">GPLv3 license</Framework.Link>.
                <br/>
                <br/>
                Using <Framework.Link href="https://github.com/atilika/kuromoji">Kuromoji</Framework.Link>,
                according to the <Framework.Link href="https://github.com/atilika/kuromoji/blob/master/LICENSE.md">Apache License 2.0</Framework.Link>.
            </LegalInfo>
        </StyledFooter>
    </>
}


const StyledFooter = styled.footer`
    display: block;
    margin-top: 50vh;
    margin-bottom: 6em;
`

const FooterLinks = styled.div`
    margin-top: 1em;
`

const LegalInfo = styled.div`
    font-size: 0.8em;
    margin-top: 2em;
`