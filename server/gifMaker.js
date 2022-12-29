const GIFEncoder = require('gif-encoder-2')
const { createCanvas, Image } = require('canvas')
const { createWriteStream, readFileSync } = require('fs')
const path = require('path')

async function makeGif(image_paths, output) {
    return new Promise(async resolve1 => {
     
        // find the width and height of the image
        // const [width, height] = await new Promise(resolve2 => {
        //   const image = new Image()
        //   image.onload = () => resolve2([image.width, image.height])
        //   image.src = image_paths[0]
        // })

        const [width, height] = [900, 1200]
     
        // base GIF filepath on which algorithm is being used
        // create a write stream for GIF data
        const writeStream = createWriteStream(output)
        // when stream closes GIF is created so resolve promise
        writeStream.on('close', () => {
          resolve1()
        })
     
        const encoder = new GIFEncoder(width, height, 'neuquant', true, 5)
        // pipe encoder's read stream to our write stream
        encoder.createReadStream().pipe(writeStream)
        encoder.start()
        encoder.setDelay(750)
     
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
     
        // draw an image for each file and add frame to encoder
        for (const path of image_paths) {
          await new Promise(resolve3 => {
            const image = new Image()
            image.onload = () => {
              ctx.drawImage(image, 0, 0)
              encoder.addFrame(ctx)
              resolve3()
            }
            image.src = path
            console.log(path)
          })
        }
    })
}

module.exports = { makeGif }

