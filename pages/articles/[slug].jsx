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

            <main>
                <div className="bg-gray-100 flex justify-center" >
                    <div className="mt-10 max-w-5xl bg-white p-10" >
                        <h1 className="text-4xl mb-10" > {pageData.fields.kb_article_name} </h1>

                        <div dangerouslySetInnerHTML={{ __html: pageData.fields.kb_article_body }} >
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const getStaticPaths = async () => {
    const req = await fetch(`https://api.buttercms.com/v2/pages/kb_article_type/?auth_token=${process.env.NEXT_PUBLIC_BUTTERCMS_API_KEY}`)
    const { data: articleData } = await req.json()

    return {
        fallback: false,
        paths: articleData.map(({ slug }) => ({
            params: {
                slug,
            }
        }))
    }
}

export const getStaticProps = async ({ params }) => {
    const req = await fetch(`https://api.buttercms.com/v2/pages/kb_article_type/${params?.slug}/?auth_token=${process.env.NEXT_PUBLIC_BUTTERCMS_API_KEY}`)
    const { data: pageData } = await req.json()

    return {
        props: {
            pageData
        }
    }
}

export default Index