import Scraper from './Scraper.mjs'
/**
* this is main class will handle logic and interaction with scraper
*/
class Index {

  /**
   * setup properties
   */
  constructor() {
    this.scraper = new Scraper()
    this.daysArray = []
    this.moviesArray = []
    this.dinnerTable = []
    this.accountCredentials = {
      username: 'zeke',
      password: 'coys'

    }
    this.dinnerBookingUrl = undefined
  }

  /**
   * starts the logic
   * @param {String} url  the start url 
   */
  async start(url) {
    try {
      const printWithColor = (message, status) => {
        const statusMessage = status ? 'OK' : 'FAILED'
        console.log(`\u001b[38;5;30m${message}\u001b[0m ${statusMessage}`)
      }

      const paths = await this.scraper.getLinks(url)
      printWithColor('Scraping links', true)

      // Simplify promise handling and directly check the results
      const [daysSuccess, moviesSuccess] = await Promise.all([
        this.getFreeDays(paths),
        this.fetchAvailableMovies(paths)
      ])

      printWithColor('Scraping available days', daysSuccess)
      printWithColor('Scraping showtimes', moviesSuccess)

      // Scrape for available dinner reservations
      const dinnerSuccess = await this.fetchAvailableDinnerTimes(paths)
      printWithColor('Scraping possible reservations', dinnerSuccess)

      // Validate all scraping operations were successful
      if (!daysSuccess || !moviesSuccess || !dinnerSuccess) {
        printWithColor('Scraping failed, cannot calculate suggested gatherings for the friends...', false)
        return
      }

      const meetingDays = this.computeMeetingDays()
      this.getRecommandations(meetingDays)
    } catch (error) {
      console.error(`Error during scraping: ${error}`)
      return false
    }
  }

  /**
 * Asynchronously retrieves free days available for all provided calendar links.
 * It fetches the free days from individual calendars and filters out the days
 * where all parties are available.
 * 
 * @param {Array<string>} links - The array of URLs to individual calendars.
 * @returns {Promise<boolean>} A promise that resolves to true if free days were successfully fetched
 * and processed, false otherwise. Updates the `daysArray` property with the common free days.
 */
  async getFreeDays(links) {
    try {
      // Find the calendar link
      const calendarLink = links.find(link => link.includes('calendar'))
      // get individual calendar links
      const calendarLinks = await this.scraper.getLinks(calendarLink)
      const fullCalendarLinks = calendarLinks.map(link => `${calendarLink}${link.slice(2)}`)

      // Fetch free days from each calendar
      const freeDaysPromises = fullCalendarLinks.map(link => this.scraper.getFriendsDays(link))
      const listOfFreeDays = await Promise.all(freeDaysPromises)
      const allFreeDays = listOfFreeDays.flat()

      // Filter days where all are available
      const commonFreeDays = allFreeDays.filter(day => this.countOccurrences(allFreeDays, day) === 3)
      this.daysArray = Array.from(new Set(commonFreeDays)) // Remove duplicates

      return true
    } catch (error) {
      console.error("Failed to get free days:", error)
      return false
    }
  }


  /**
  * Count occurrences of a specific day in the array.
  * @param {Array} days Array of days
  * @param {string} day Specific day to count
  * @returns {number} Number of occurrences
  */
  countOccurrences(days, day) {
    return days.filter(d => d === day).length
  }


  /**
 * Fetches available movies for the provided URL path, which points to the cinema schedule.
 * It retrieves the schedule, filters available movies based on status.
 * @param {String} urlPath - The URL path that points to the cinema schedule.
 * @returns {Promise<boolean>} A promise that resolves to true if movies were successfully fetched and processed,
 * false otherwise. Updates the `moviesArray` property with the available movies.
 */
  async fetchAvailableMovies(urlPath) {
    try {
      const cinemaLink = urlPath.find((url) => url.includes('cinema'))
      const cinemaContent = await this.scraper.fetchInfo(cinemaLink)

      const cinemaDays = this.scraper.getMovieSel(cinemaContent, '#day')
      const foundMovies = this.scraper.getMovieSel(cinemaContent, '#movies')

      //  promise with async callback
      const moviePromises = cinemaDays.map(async (day) => this.scraper.getMovieTimes(cinemaLink, day, foundMovies))
      const moviesResults = await Promise.all(moviePromises)
      const flatMovies = moviesResults.flat()

      const availableMovies = flatMovies.filter((movie) => movie.status === 1)

      this.moviesArray = this.reformatMovieReservations(cinemaDays, foundMovies, availableMovies)

      return true
    } catch (error) {
      console.error("Failed to fetch available movies:", error)
      return false
    }
  }


  /**
 * Reformat movie reservations with human-readable text for days and movies.
 *
 * @param {Array} dayOptions Array of objects for days with `.value` and `.text` properties
 * @param {Array} movieOptions Array of objects for movies with `.value` and `.text` properties
 * @param {Array} reservations Array of movie reservations to reformat
 * @returns {Array} Reformatted array of movie reservations
 */
  reformatMovieReservations(dayOptions, movieOptions, reservations) {
    return reservations.map(reservation => {
      // Find the corresponding day and movie objects
      const dayText = dayOptions.find(d => d.value === reservation.day)?.text
      const movieText = movieOptions.find(m => m.value === reservation.movie)?.text

      // Return a new object with the human-readable day and movie
      const { status, ...rest } = reservation
      return { ...rest, day: dayText, movie: movieText }
    })
  }

  /**
 * Retrieves the login path for dinner reservations by finding the dinner URL and extracting the form action.
 * 
 * @param {Array} urls - Array of URLs to search for the dinner URL.
 * @returns {Promise<string|null>} - The full login URL if found, otherwise null.
 */
  async getDinnerLoginPath(urls) {
    const dinnerURL = urls.find(url => url.includes('dinner'))

    if (!dinnerURL) {
      console.error('Dinner URL not found.')
      return null
    }
    // Get path of form action
    const text = await this.scraper.fetchInfo(dinnerURL)
    const relativeFormPath = this.scraper.getFormPath(text)
    const loginPath = dinnerURL.concat(relativeFormPath.slice(2))

    return loginPath

  }



  /**
  * Attempts to fetch available dinner times by first logging in and then accessing the dinner reservation page.
  * @param {Array} urls Array of URLs to search for the dinner reservation system.
  * @returns {boolean} True if dinner times were successfully fetched, otherwise false.
  */
  async fetchAvailableDinnerTimes(urls) {
    try {
      const fullLoginUrl = await this.getDinnerLoginPath(urls)
      if (!fullLoginUrl) {
        console.error('Failed to obtain login URL for dinner reservations.')
        return false
      }
      const { username, password } = this.accountCredentials
      const body = `username=${username}&password=${password}&submit=login`
      const postLogin = await this.scraper.postReq(fullLoginUrl, body)
      this.dinnerBookingUrl = postLogin.url

      // Get restricted page
      const getRedirectText = await this.scraper.fetchInfo(postLogin.url)
      const inputs = await this.scraper.getInputs(getRedirectText)

      this.dinnerTable = inputs

      return true

    } catch (error) {
      console.error(`Error fetching available dinner times: ${error}`)
      return false
    }
  }

  /**
   * Method that caluclates all possible gatherings.
   *
   * @returns {Array} Array of object with possible gatherings.
   */
  computeMeetingDays() {
    const validGathering = []
    const validDinners = []

    const filterMovies = this.moviesArray.filter((movie) => this.daysArray.includes(movie.day))

    for (const rawDinner of this.dinnerTable) {
      for (const movie of filterMovies) {
        if (!movie.day.toLowerCase().startsWith(rawDinner.slice(0, 3))) continue

        const formatDinner = this.getDinnerObject(rawDinner)

        if (parseInt(movie.time.slice(0, 2)) + 2 <= formatDinner.start) {
          const formattedGathering = {
            day: movie.day,
            movie: movie.movie,
            movieStart: movie.time,
            dinnerStart: formatDinner.start,
            dinnerEnd: formatDinner.end
          }

          validGathering.push(formattedGathering)
          validDinners.push({ rawDinner, formatDinner })
        }
      }
    }

    this.dinnerTable = validDinners
    return validGathering
  }

  /**
 * Formats a raw dinner string into a structured object with day, start, and end times.
 * @param {string} dinner The raw dinner string to be formatted.
 * @returns {Object} A structured object containing the formatted dinner information.
 */
  getDinnerObject(dinner) {
    const weekdays = ['friday', 'saturday', 'sunday']
    const weekday = weekdays.find(day => dinner.toLowerCase().startsWith(day.slice(0, 3)))
    return {
      day: weekday,
      start: dinner.substring(3, 5),
      end: dinner.substring(5, 7)
    }
  }

  /**
   * Displays meeting day recommendations based on computed meetings.
   * @param {Array} meetings An array of meeting objects containing the day, movie, start time, and dinner time information.
   */
  getRecommandations(meetings) {
    console.log('\n\u001b[38;5;30mMeeting Day Recommendations\u001b[0m\n======================')

    meetings.forEach(meeting => {
      const { day, movie, movieStart, dinnerStart, dinnerEnd } = meeting
      console.log(`* On ${day}, "${movie}" starts at ${movieStart}, and there is a free table between ${dinnerStart}:00 to ${dinnerEnd}:00.`)
    })
  }


}

export default Index