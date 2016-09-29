'use strict'

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const urlencode = require('urlencode');
const router = express.Router();

const fileCtrl = require('../utils/file');
const dbCtrl = require('../utils/dbCtrl');

var upload = multer({ dest: './UploadFiles/' });

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('index');
});

const errMsg = {101:'파일을 선택하세요', 201:'상품명을 입력하세요', 202:'상품 갯수를 입력하세요'};

/**
 * GET csv 입력창
 */
router.get('/csv', (req, res, next)=>{
  res.render('uploadcsv', {title:'csv', msg:(req.query.msg!==undefined)?errMsg[req.query.msg]:null});
});

/**
 * GET 상품 입력창
 */
router.get('/product', (req, res, next)=>{
  dbCtrl.AllProduct()
  .then((products)=>{
    res.render('addproduct', {
      title:'product',
      msg:(req.query.msg!==undefined)?errMsg[req.query.msg]:null,
      productName:(req.query.productName!==undefined)?req.query.productName:null,
      productQty:(req.query.productQty!==undefined)?req.query.productQty:null,
      products:(products.length>0)?products:null
    });
  })
})

/**
 * GET  상품 추첨 페이지
 */
router.get('/gift', (req, res, next)=>{
  let loadInfo = {products:null, winners:null};

  dbCtrl.AllProduct()
  .then((products)=>{
    loadInfo.products = products;
    return Promise.resolve();
  })
  .then(dbCtrl.AllWinner)
  .then((winners)=>{
    loadInfo.winners = winners;
  })
  //더이상 추첨할 상품이 남아있지않는지 체크.
  .then(()=>{
    let existProduct = false;
    for(let product of loadInfo.products) {
      if(existProduct === false && product['remain']>0) {
        existProduct = true;
        break;
      }
    }
    if(existProduct === false) {
      return Promise.reject('gachadone');
    }
    return Promise.resolve();
  })
  .then(()=>{
    res.render('giftgacha', {title:'gift',products:loadInfo.products, winners:loadInfo.winners.length>0?loadInfo.winners:null});
  })
  .catch((err)=>{
    if(err === 'gachadone')
      res.render('giftgacha', {title:'gift',products:null, winners:loadInfo.winners});
    else
      next(err);
  })
});


/**
 * POST csv 파일 업로드
 */
router.post('/csv', upload.single('myFile'), (req, res, next)=>{
  if(req.file === undefined) {
    res.redirect('/csv?msg=101');
    return;
  }

  let filePath = req.file.path;

  let fileName = req.file.originalname;
  let fileSplit =  fileName.split('.');
  let fileType = fileSplit[1];


  function CheckCSVfile(fileType) {
    if( !(fileType === 'csv' || fileType === 'CSV') )
      return Promise.reject('not csv');

    return Promise.resolve();
  }

  //파일 타입 체크
  CheckCSVfile(fileType)
  //파일 로딩
  .then(()=>{
    return fileCtrl.LoadFile(filePath);
  })
  //csv to array 변환
  .then((fileData)=>{
    return fileCtrl.CSVTextToArr(fileData);
  })
  //내용을 정제(email만 추출)한 뒤 db에 추가
  .then((fileObjArr)=>{
    let emailList = [];
    for(let row of fileObjArr) {
      if(row[0] !== 'email') {
        emailList.push(row[0]);
      }
    }
    return dbCtrl.AddUsers(emailList);
  })
  //파일 unlink
  .then(()=>{
    return fileCtrl.UnlinkFile(filePath);
  })
  .then(()=>{
    //redirect 상품등록페이지
    res.redirect('/product');
  })
  .catch((err)=>{
    next(err);
  })

});

/**
 * POST 상품 등록
 */
router.post('/product', (req, res, next)=>{

  function CheckBody() {
    if(req.body.productName === '')
      return Promise.reject(201);
    else if(req.body.productQty === '')
      return Promise.reject(202);
    return Promise.resolve();
  }

  CheckBody()
  .then(()=>{
    let qyt = req.body.productQty * 1;
    return dbCtrl.AddProduct(req.body.productName, qyt);
  })
  .then(()=>{
    res.redirect('/product');
  })
  .catch((err)=>{
    console.log(`err : ${err}`);
    if(err === 201 || err === 202) {
      let redirectURL = `/product?msg=${err}`;
      if(req.body.productName !== '') {
        redirectURL += `&productName=${urlencode(req.body.productName)}`
      }
      if(req.body.productQty !== '') {
        redirectURL += `&productQty=${req.body.productQty}`
      }
      res.redirect(redirectURL);
      return;
    }
    next(err);
  })
});

/**
 * POST 당첨자
 */
router.post('/gacha', (req, res, next)=>{

  let loadInfo = {email:null, product:null};

  //당첨자 이메일 획득
  return dbCtrl.GetRandomEmail()
  .then((email)=>{
    loadInfo.email = email;
    return Promise.resolve();
  })
  //상품정보 로딩
  .then(()=>{
    return dbCtrl.GetProduct(req.body.productKeyNo);
  })
  .then((product)=>{
    loadInfo.product = product;
    return Promise.resolve();
  })
  //상품 차감 처리.
  .then(()=>{
    return dbCtrl.DecrementProduct(req.body.productKeyNo);
  })
  // 당첨자 등록.
  .then(()=>{
    console.log(loadInfo.product['qyt'], loadInfo.product['remain']);
    let getNumber = loadInfo.product['qyt'] - loadInfo.product['remain'];
    return dbCtrl.AddWinner(loadInfo.email, loadInfo.product['name'], getNumber);
  })
  .then(()=>{
    res.redirect('/gift');
  })
  .catch((err)=>{
    next(err);
  })

});

module.exports = router;
