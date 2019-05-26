const express = require('express')
const router = express.Router()
const UrlShortenModel = require('../models/urlShortener')
const dns = require('dns')
const moment = require('moment')

router.get('/', (req, res) => {
  res.render('index')
})

// 產出短網址
router.post('/getShortenUrl', async (req, res) => {
  // 宣告 baseUrl 變數，透過 req 取得本機傳輸協定方式與網域
  const baseUrl = `${req.protocol}://${req.headers.host}/`
  // 宣告 newOriginalUrl 變數為取得使用者輸入的原始網址
  const newOriginalUrl = req.body.originalUrl

  try {
    // Step 1：檢查所輸入的網址是否正常
    let validUrl = new URL(newOriginalUrl);
    await isSiteExit(validUrl);

    // Step 2：將原始網址轉為短網址，再存入 DB 紀錄
    // Step 2-1：檢查 DB 是否已有重複的原始網址，若重複則回傳既有的短網址
    const exitShortId = await findShortIdMatchedOriginalUrl(newOriginalUrl)
    if (exitShortId) {
      res.render('index', {
        baseUrl,
        exitShortId
      })
    } else {
      // Step 2-2：反之，則創建新的短網址回傳使用
      const newShortId = await generateUniqueShortId()
      const newUrlShorten = new UrlShortenModel({
        originalUrl: newOriginalUrl,
        shortId: newShortId,
        createdAt: moment().format('YYYY-MM-DD')
      })
      await newUrlShorten.save()
      res.render('index', {
        baseUrl,
        newShortId
      })
    }
  } catch (err) {
    const errorMessage = '無效的網址！請再次確定網址是否正確'
    res.render('index', {
      errorMessage,
      newOriginalUrl
    })
  }
})

// 透過短網址，前往原始網站
router.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId
  const originalUrl = await findOriginalUrlMatchedShortId(shortId);
  // 若有相對應的原始網站，則成功轉向
  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    // 反之，則轉向錯誤頁面，引導使用者返回首頁重新操作
    const baseUrl = `${req.protocol}://${req.headers.host}/`
    res.render('Url-not-found', {
      baseUrl
    })
  }
})

module.exports = router

// 檢查網址是否已存在
function isSiteExit(validUrl) {
  return new Promise((resolve, reject) => {
    // 透過 DNS 解析網域名稱
    dns.lookup(validUrl.hostname, err => {
      if (err) {
        return reject(false)
      }
      return resolve(true)
    })
  })
}

// 檢查原始網址是否已有相對應的短網址存在
async function findShortIdMatchedOriginalUrl(newOriginalUrl) {
  const exitOriginalUrl = await UrlShortenModel.findOne({
    originalUrl: newOriginalUrl
  }).exec()
  if (exitOriginalUrl) {
    return exitOriginalUrl.shortId
  } else {
    return null
  }
}

// 產出短網址
async function generateUniqueShortId() {
  return newShortId = Math.random().toString(36).slice(-5);
}

// 傳入短網址，回傳相對應的原始網址
async function findOriginalUrlMatchedShortId(shortId) {
  const urlShorten = await UrlShortenModel.findOne({
    shortId
  }).exec()
  if (urlShorten) {
    return urlShorten.originalUrl
  } else {
    return null
  }
}