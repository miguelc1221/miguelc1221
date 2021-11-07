import axios from 'axios'
import * as cheerio from 'cheerio'
import { markdownTable } from 'markdown-table'

const formatDate = (date) => {
  let day = date.getDate()

  if (day < 10) {
    day = `0${day}`
  }

  let month = date.getMonth() + 1

  if (month < 10) {
    month = `0${month}`
  }

  let year = date.getFullYear()

  return month + '/' + day + '/' + year
}

const url = 'https://leagueofcomicgeeks.com/comics/new-comics'

const getComics = ($, cb) => {
  return $('#comic-list-issues')
    .children()
    .each(function () {
      const name = $(this).find('.title a').text().replace(/#.*/g, '').trim()
      const publisher = $(this).find('.publisher').text().trim()
      const date = $(this)
        .find('.date')
        .text()
        .trim()
        .replace(/st|nd|rd|th/g, '')
      const formattedDate = formatDate(new Date(date))

      let issue = $(this)
        .find('.title a')
        .text()
        .match(/(#\d.*?\s|#\d.*)/)

      // if comic has no issue number
      if (issue === null) {
        issue = 0
      } else {
        issue = issue[0].substr(1, issue.length).trim()
      }

      cb(name, publisher, issue, formattedDate)
    })
}

export const getAllComics = async () => {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const table = [['Name', 'Publisher', 'Issue #', 'Date']]

    getComics($, (...args) => table.push([...args]))

    // console.log(markdownTable(table))
    return markdownTable(table)
  } catch (error) {
    console.log(error)
    return
  }
}
