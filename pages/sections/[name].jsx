import { useRouter } from 'next/router'
import React from 'react'

const Index = ({ pageData }) => {
    const router = useRouter()

    return (
        <div>
             <header>
                <nav>
                    <div className="h-24 flex items-center justify-center" >
                        <p onClick={() => router.push('/')} className="text-2xl text-center cursor-pointer" > ButterCMS Knowledge Base </p>
                    </div>
                </nav>
            </header>

            <main className="bg-gray-100 w-full h-screen flex justify-center py-16 px-16"  >
                <div className="bg-white w-full p-10" >
                    <h1 className="text-5xl font-bold" > {pageData.fields.kb_section_name} </h1>

                    <div className="my-10" >
                        <p className="text-2xl" > {pageData.fields.kb_section_description} </p>
                    </div>
                    <hr />

                    <div className="mt-14" >
                        <p className="text-2xl mb-6 font-semibold" > Available Articles For {pageData.fields.kb_section_name} section : </p>

                        {
                            pageData?.fields?.kb_articles.length < 1 ? (
                                <div>
                                    <p> There are currently no articles within {pageData.fields.kb_section_name} section </p>
                                </div>
                            ) : (       
                                <div>
                                    <ul>
                                        {pageData?.fields?.kb_articles.map(({ slug, name, fields }, index) => (
                                            <li
                                                key={index}
                                                className="border-solid border-2 p-5 border-gray-300
                                                 rounded-lg cursor-pointer"
                                                onClick={() => router.push(`/articles/${slug}`)}
                                            >
                                                <p className="text-3xl" > {name} </p>
                                                <p className="text-gray-500 mt-4" > {fields.kb_article_description} </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getStaticPaths = async () => {
    const req = await fetch(`https://api.buttercms.com/v2/pages/kb_section_type/?auth_token=${process.env.NEXT_PUBLIC_BUTTERCMS_API_KEY}`)
    const { data: sectionData } = await req.json()

    return {
        fallback: false,
        paths: sectionData.map(({ slug }) => ({
            params: {
                name: slug,
            }
        }))
    }
}

export const getStaticProps = async ({ params }) => {
    const req = await fetch(`https://api.buttercms.com/v2/pages/kb_section_type/${params?.name}/?auth_token=${process.env.NEXT_PUBLIC_BUTTERCMS_API_KEY}`)
    const { data: pageData } = await req.json()

    return {
        props: {
            pageData
        }
    }
}

export default Index