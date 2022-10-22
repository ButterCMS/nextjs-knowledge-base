import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

const BASE_API_ENDPOINT = "https://api.buttercms.com/v2/pages/"
const API_KEY = process.env.NEXT_PUBLIC_BUTTERCMS_API_KEY

const Card = ({ description, name, slug }) => {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/sections/${slug}`)}
      className="bg-white shadow-lg h-60 text-center flex justify-center items-center m-10 rounded-lg w-96 cursor-pointer hover:bg-gray-100"
    >
      <div className="p-10" >
        <h2 className="text-3xl font-semibold mb-5"  > {name} </h2>
        <p> {description} </p>
      </div>
    </div>
  )
}

const SearchResult = ({ result }) => {
  const router = useRouter()

  return (
    <div className="flex justify-center" >
      <div className="max-w-5xl w-3xl w-full">
        <p className="text-2xl mb-2" > All Search Results </p>
        <hr />

        <ul>
          {result.map(({ page_type, name, fields, slug }, idx) => (
            <li className="my-8 hover:bg-gray-100" key={idx} >
              {page_type === "kb_section_type" && (
                <div className="rounded cursor-pointer overflow-hidden shadow-lg bg-white w-full">
                  <div className="px-6 py-4">
                    <div className=" pt-4 pb-2">
                      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">SECTION</span>
                    </div>

                    <div className="font-bold text-xl mb-2 hover:text-underline" onClick={() => router.push(`/sections/${slug}`)} >{name}</div>
                    <p className="text-gray-700 text-base"> {fields.kb_section_description} </p>
                  </div>
                </div>
              )}

              {page_type === "kb_article_type" && (
                <div className="rounded cursor-pointer shadow-lg overflow-hidden bg-white w-full">
                  <div className="px-6 py-4">
                    <div className=" pt-4 pb-2">
                      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">ARTICLE</span>
                    </div>

                    <div className="font-bold text-xl mb-2 hover:text-underline" onClick={() => router.push(`/articles/${slug}`)} >{name}</div>
                    <p className="text-gray-700 text-base"> {fields.kb_article_description} </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const handleImageLoad = ({ src, width }) => {
  const splits = src.split('/')
  const img_hash = splits[splits.length - 1]

  return `https://cdn.buttercms.com/resize=width:${width}/${img_hash}`
}

export async function getStaticProps() {
  const req = await fetch(`${BASE_API_ENDPOINT}\*/buttercms_demo_kb_home/\?auth_token\=${API_KEY}`)

  const { data: pageData } = await req.json()

  return {
    props: {
      pageData,
    }
  }
}

const Home = ({ pageData }) => {
  const [searchText, setSearchText] = React.useState('')
  const [searchResult, setSearchResult] = React.useState(null)

  const handleSearch = async () => {
    try {
      const req = await fetch(`${BASE_API_ENDPOINT}search?query=${searchText}&auth_token=${API_KEY}`)

      const { data } = await req.json()
      setSearchResult(data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <Head>
        <title>ButterCMS Knowledge Base</title>
      </Head>

      <main>
        <div
          style={{
            backgroundColor: "#121A3E",
            color: "white"
          }}
          className="py-10 flex text-center align-center justify-center items-center"
        >
          <div>
            <Image
              layout="fixed"
              width={200}
              loader={handleImageLoad}
              height={150}
              className="rounded-3xl"
              src={pageData.fields.kb_home_image}
            />
            <h1 className="mb-3 text-4xl font-bold" > {pageData.fields.kb_home_hero_title} </h1>
            <h1 className="mb-3 text-2xl font-bold" > {pageData.fields.kb_home_hero_subtitle} </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault()

                handleSearch
              }}
              className="flex my-8" >
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="knowledge-base-query"
                type="text"
                placeholder="Search through our knowledge base"
              />

              <button
                disabled={searchText.length < 2}
                onClick={() => handleSearch()}
                className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Search
              </button>

              {
                searchResult && (
                  <button
                    onClick={() => {
                      setSearchResult(null)
                      setSearchText('')
                    }}
                    className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Cancel
                  </button>
                )
              }

            </form>
          </div>
        </div>

        <div className="bg-gray-100 h-full" >
          <br />
          <br />

          {
            searchResult ? <SearchResult result={searchResult} /> : (
              <div>
                <div className="flex justify-center mb-10" >
                  <p className="max-w-3xl text-xl text-center hover:text-underline" > {pageData.fields.kb_home_hero_text} </p>
                </div>
                <ul
                  className="mt-6 flex flex-wrap items-center justify-around sm:w-full"
                >
                  {
                    pageData.fields.kb_home_sections.map(({ fields, slug }, index) => (
                      <li key={index}>
                        <Card
                          name={fields.kb_section_name}
                          slug={slug}
                          description={fields.kb_section_description}
                        />
                      </li>
                    ))
                  }
                </ul>
              </div>
            )
          }

        </div>
      </main>
    </div>
  )
}

export default Home
