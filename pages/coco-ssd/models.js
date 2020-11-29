import * as tf from '@tensorflow/tfjs-core'

import * as cocoSsd from '@tensorflow-models/coco-ssd'

import { getFrameSliceOptions } from '../../utils/util'

import { SSD_NET_URL } from '../../env'

const fontSize = 20
const color = 'aqua'
const lineWidth = 2

export class Classifier {
  // 图像显示尺寸结构体 { width: Number, height: Number }
  displaySize

  // 神经网络模型
  ssdNet

  // ready
  ready

  constructor(displaySize) {
    this.displaySize = {
      width: displaySize.width,
      height: displaySize.height
    }

    this.ready = false
  }

  load() {
    return new Promise((resolve, reject) => {
      cocoSsd.load({
        modelUrl: SSD_NET_URL
      }).then(model => {
        this.ssdNet = model
        this.ready = true
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

  isReady() {
    return this.ready
  }

  detect(frame) {
    return new Promise((resolve, reject) => {
      const tensor = tf.tidy(() => {
        const temp = tf.tensor(new Uint8Array(frame.data), [frame.height, frame.width, 4])
        const sliceOptions = getFrameSliceOptions(frame.width, frame.height, this.displaySize.width, this.displaySize.height)

        return temp.slice(sliceOptions.start, sliceOptions.size).resizeBilinear([this.displaySize.height, this.displaySize.width]).asType('int32')
      })

      this.ssdNet.detect(tensor).then(res => {
        tensor.dispose()
        resolve(res)
      }).catch(err => {
        console.log(err)
        tensor.dispose()
        reject()
      })
    })
  }

  drawBoxes(ctx, boxes) {
    if (!ctx && !boxes) {
      return
    }

    const minScore = 0.3

    ctx.setFontSize(fontSize)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    boxes.forEach(box => {
      if (box.score >= minScore) {
        ctx.rect(...(box.bbox))
        ctx.stroke()

        ctx.setFillStyle(color)
        ctx.fillText(box['class'], box.bbox[0], box.bbox[1] - 5)
      }
    })

    ctx.draw()
    return true
  }

  dispose() {
    this.ssdNet.dispose()
  }
}