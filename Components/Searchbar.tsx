"use client"

import { scrapeAndStoreProduct } from "@/lib/actions"
import { FormEvent, useState } from "react"

const isValidAmazonURL = (url: string) => {
  try {
    const parsedURL = new URL(url)
    const hostname = parsedURL.hostname
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.in") ||
      hostname.endsWith("amazon")
    ) {
      return true
    }
  } catch (error) {
    return false
  }
  return false
}

const Searchbar = () => {
  const [searchprompt, setSearchprompt] = useState("")
  const [isLoading, SetisLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidLink = isValidAmazonURL(searchprompt)

    if (!isValidLink) {
      alert("Please provide a valid Amazon link")
    }

    try {
      SetisLoading(true)
      //scraping product from website
      const product = await scrapeAndStoreProduct(searchprompt)
    } catch (error) {
      console.log(error)
    } finally {
      SetisLoading(false)
    }
  }
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchprompt}
        onChange={(e) => setSearchprompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button
        type="submit"
        disabled={searchprompt === ""}
        className="searchbar-btn"
      >
        {isLoading ? "Searching.." : "Search"}
      </button>
    </form>
  )
}

export default Searchbar
