import axios from "axios"
import * as cheerio from "cheerio"
import { extractCurrency, extractDescription, extractPrice } from "../utils"
export async function scrapeAmazonProduct(url: string) {
  if (!url) return

  const username = String(process.env.BRIGHT_DATA_USERNAME)
  const password = String(process.env.BRIGHT_DATA_PASSWORD)
  const port = 22225
  const session_id = (1000000 * Math.random()) | 0
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  }
  try {
    const response = await axios.get(url, options)
    const $ = cheerio.load(response.data)

    //Extraction of product using cheerio
    const title = $("#productTitle").text().trim()
    const currentPrice = extractPrice(
      $(".reinventPricePriceToPayMargin span.a-price-whole"),
      $(".priceTopay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    )
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    )
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable"
    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      $("[data-main-image-click ] img").attr("src") ||
      "{}"
    const imageUrls = Object.keys(JSON.parse(images))
    const currency = extractCurrency($(".a-price-symbol"))
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "")
    const description = extractDescription($)
    const category = $("#nav-search-label-id").text()
    const reviewsCount = $("#acrCustomerReviewText")
      .eq(0)
      .text()
      .replace(/[^\d.]/g, "")
    const ratingsCount = $("#acrPopover span.a-size-base").eq(0).text().trim()
    const likes = $("#brandSnapshot_feature_div div.brand-snapshot-flex-row p")
      .eq(1)
      .text()
      .trim()
      .slice(0, 3)
      .replace(/[^\d.]/g, "")
    const recentOrders = $(
      "#brandSnapshot_feature_div div.brand-snapshot-flex-row p"
    )
      .eq(2)
      .text()
      .trim()
      .slice(0, 5)
    const brandSince = $(
      "#brandSnapshot_feature_div div.brand-snapshot-flex-row p"
    )
      .eq(3)
      .text()
      .trim()
      .slice(0, 3)

    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: category,
      reviewsCount: reviewsCount,
      ratingsCount: ratingsCount,
      isOutOfStock: outOfStock,
      description,
      likes: likes,
      recentOrders: recentOrders,
      brandtSince: brandSince,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    }
    return data
  } catch (error: any) {
    throw new Error(`Failed to scrape product:${error.message}`)
  }
}
