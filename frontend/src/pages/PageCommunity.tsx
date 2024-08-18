import * as Solid from "solid-js"
import { styled } from "solid-styled-components"
import * as Framework from "../framework/index.ts"
import * as App from "../app.tsx"
import { Page } from "../components/Page.tsx"
import { Searchbox } from "../components/Searchbox.tsx"
import { UserIdLink } from "../components/User.tsx"
import { AnalyticsBox } from "../components/AnalyticsBox.tsx"


export function PageCommunity(props: Framework.RouteProps)
{
    const [data] = Solid.createResource(
        props.routeMatch, // FIXME: Why is this needed?
        async () => {
            const authUser = await App.Api.authenticate()
            const standard = await App.Api.studylistStandardGetAll({})
            const recent = await App.Api.studylistCommunityGetRecent({ limit: 50 })

            return {
                authUser,
                standardLists: standard.studylists,
                recentLists: recent.studylists,
            }
        })

        
    return <Page title="Community">

        <Searchbox position="inline"/>
        <br/>

        <AnalyticsBox/>
        <br/>

        <Solid.Show when={ data() }>
            <h1>
                <Framework.IconBook color={ Framework.themeVar("iconYellowColor") }/>
                { " " }
                Standard Study Lists
            </h1>
            <Framework.HorizontalBar/>

            <CardList>
                <Solid.For each={ data()!.standardLists }>
                { (list) =>
                    <StudylistCard studylist={ list }/>
                }
                </Solid.For>
            </CardList>

            <br/>
            <br/>

            <h1>
                <Framework.IconBook color={ Framework.themeVar("iconGreenColor") }/>
                { " " }
                Recent Community Study Lists
            </h1>
            <Framework.HorizontalBar/>

            <CardList>
                <Solid.For each={ data()!.recentLists }>
                { (list) =>
                    <StudylistCard studylist={ list }/>
                }
                </Solid.For>
            </CardList>

        </Solid.Show>
    </Page>
}


function StudylistCard(props: {
    studylist: App.Api.StudyList.Entry,
})
{
    return <CardSlot>
        <Framework.Card
            href={ App.Pages.Studylist.urlWith(props.studylist.id) }
        >
            <CardLayoutInner>
                <div>
                    <Framework.IconBook/>
                    { " " }
                    { props.studylist.name }
                    <Solid.Show when={ !props.studylist.public }>
                        <Framework.IconLock
                            color={ Framework.themeVar("iconBlueColor") }
                        />
                    </Solid.Show>
                    <br/>
                    <SmallInfo>
                        { props.studylist.wordCount }
                        { " " }
                        { Framework.formPlural(props.studylist.wordCount, "word", "s") }
                    </SmallInfo>

                    <SmallInfo>
                        { Framework.dateElapsedToStr(props.studylist.modifyDate) } ago
                    </SmallInfo>
                </div>
                <UserInfo>
                    <Solid.Show when={ props.studylist.creatorId !== "000000" }>
                        <UserIdLink
                            userId={ props.studylist.creatorId }
                        />
                    </Solid.Show>
                </UserInfo>
            </CardLayoutInner>
        </Framework.Card>
    </CardSlot>
}


const CardList = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
`


const CardSlot = styled.div`
    display: inline-block;
    flex-grow: 0;
    flex-basis: 32%;
    margin: 0.25em;
    max-width: 32%;
    
	@media (max-width: ${ Framework.pageSmallWidthThreshold })
	{
        flex-grow: 1;
        flex-basis: 100%;
        max-width: none;
    }
`


const CardLayoutInner = styled.div`
    display: grid;
    grid-template: auto / auto 1fr;
    align-items: baseline;
    justify-items: start;
    overflow: hidden;
`


const SmallInfo = styled.span`
    display: inline-block;
    margin-left: 0.75em;
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8em;
`


const UserInfo = styled.div`
    justify-self: end;
    text-align: right;
    color: ${ Framework.themeVar("text3rdColor") };
    font-size: 0.8em;
`