import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie/node-fetch.js';
import { JSDOM } from 'jsdom';

const fetch = fetchCookie(nodeFetch);


/**
 * ScraperLinks class.
 */
class Scraper {

  /**
   * This method retrieves info from the  url.
   *
   * @param {string} url url.
   * @returns {string} content.
   */
  async fetchInfo(url) {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      return await res.text()
    } catch (error) {
      console.error("Failed to fetch content:", error.message)
      return null
    }
  }


  /**
   * Method that extract all links from passed passed url.
   *
   * @param {string} url URL of pg
   * @returns {Array} the links we get from content of url
   */
  async getLinks(url) {
    const htmlText = await this.fetchInfo(url)
    try {
      if (htmlText === null) {
        console.error('No content fetched from the URL: ' + url)
        return []
      }
      const dom = new JSDOM(htmlText)
      const links = Array.from(dom.window.document.querySelectorAll('a')).map((a) => a.href)
      return links
    } catch (error) {
      console.error("Failed to extract links:", error.message)
      return []
    }
  }

  /**
   * Method that extract data from table-header from passed url.
   *
   * @param {string} url URL of page to be scraped
   * @returns {Array} Array of days that person is available at
   */
  async getFriendsDays(url) {
    try {
      const pageContent = await this.fetchInfo(url)
      if (pageContent === null) {
        console.error('No content fetched from the URL: ' + url)
        return []
      }

      const document = new JSDOM(pageContent).window.document
      const headers = Array.from(document.querySelectorAll('th')).map(header => header.textContent)
      const dataCells = Array.from(document.querySelectorAll('td')).map(cell => cell.textContent)

      const availableDays = headers.map((day, index) => {
        if (dataCells[index]?.trim().toLowerCase() === 'ok') return day
        return undefined
      }).filter(day => day !== undefined)

      return availableDays
    } catch (error) {
      console.error("Failed to extract friends' days:", error.message)
      return []
    }
  }


  /**
   * Method that queries all options under passed selection.
   *
   * @param {string} text HTML-content of fetched page
   * @param {string} selection Tag, class or id of element to be targeted
   * @returns {Array} Array of object returned and created from method
   */
  getMovieSel(page, selection) {
    const dom = new JSDOM(page)

    const result = Array.from(dom.window.document.querySelector(selection).querySelectorAll('option:not([disabled=""])')).map((res) => {
      return {
        text: res.textContent,
        value: res.value
      }
    })

    return result
  }

  /**
   * Method that fetch times for each possible day and each movie.
   *
   * @param {string} url Super-path. Path that is the main path for the different requests
   * @param {Array} day Array of days possible to book movie on
   * @param {Array} movies Array of movies possible to watch
   * @returns {Array} Array of all reservationsPromises possible to do
   */
  async getMovieTimes(url, day, movies) {
    const reservationsPromises = movies.map(async (movie) => {
      const result = await this.fetchInfo(`${url}/check?day=${day.value}&movie=${movie.value}`)
      return JSON.parse(result)
    })

    const daysPromises = await Promise.all([...reservationsPromises])
    const Movies = daysPromises.flat()

    return Movies
  }

  /**
   * Method that gets the form's action .
   *
   * @param {string} text HTML of page
   * @returns {string} Relative path of form-action
   */
  getFormPath(content) {
    const dom = new JSDOM(content)

    const result = dom.window.document.querySelector('form').getAttribute('action')

    return result
  }

  /**
  * Method that make post-request to server.
  *
  * @param {string} url URL to be make a post-request to
  * @param {string} body Body-content to be sent with post request
  * @returns {object} Response from the server
  */
  async postReq(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    })

    return response
  }



  /**
   * Method that get all input val from passed text.
   *
   * @param {string} text Text to extract inputs from
   * @returns {Array} Array of inputs found in passed text
   */
  getInputs(text) {
    const dom = new JSDOM(text)
    const values = Array.from(dom.window.document.querySelectorAll('input')).map((input) => input.value)
    return values
  }
}

export default Scraper
