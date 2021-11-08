import Mustache from 'mustache'
import { writeFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { getAllComics } from './scrapeComics.js'

const MUSTACHE_DIR = './main.mustache'

async function generateReadMe() {
  try {
    const mustacheFile = await readFile(MUSTACHE_DIR)
    const comics = await getAllComics()

    const output = Mustache.render(mustacheFile.toString(), {
      data: comics,
    })
    return writeFileSync('README.md', output)
  } catch (error) {
    console.log(error)
  }
}

generateReadMe()
