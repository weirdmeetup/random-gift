'use strict'
const async = require('async');

// 유저
var emailMap = new Map();

// 상품
var productMap = new Map();
var productKey = 0;

//당첨자
var winnerMap = new Map();


/**
 * 당첨가능한 유저 email을등록한다.
 * @param emails        {Array}
 * @returns {Promise.<T>}
 */
exports.AddUsers = (emails)=>{
    for(let email of emails) {
        if(emailMap.has(email) === false)
            emailMap.set(email, {email:email});
    }
    return Promise.resolve();
}

/**
 * winner 항목에 포함되지않은 이메일 주소를 반환한다.
 * @returns {Promise}
 */
exports.GetRandomEmail = ()=>{
    let emailSize = emailMap.size;

    let find=false;

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return new Promise((resolve, reject)=>{
        async.doWhilst((cb)=>{
            let randomIndex = getRandomIntInclusive(0, (emailSize-1));

            let findEmail = null;

            let emailMapIter = emailMap.keys();

            for(let i=0;i<=randomIndex;++i) {
                findEmail = emailMapIter.next().value;
            }

            if(winnerMap.has(findEmail) === false) {
                find = true;
                cb(null, findEmail);
            }
            else {
                cb();
            }


        }, ()=>{ return find === false}, (err, email)=>{
            resolve(email);
        });
    });
}

/**
 * 상품 정보 등록
 * @param name          {string}    상품명
 * @param qyt           {number}    상품수량
 * @returns {Promise.<T>}
 */
exports.AddProduct = (name, qyt)=>{
    productMap.set(productKey, {productKeyNo:productKey, name:name, qyt:qyt, remain:qyt});
    ++productKey;
    return Promise.resolve();
}

/**
 * 모든 상품 정보를 리턴
 * @returns {Promise.<Array>}
 */
exports.AllProduct = ()=>{
    let returnArr = [];
    productMap.forEach((value, key)=>{
        returnArr.push(value);
    });
    return Promise.resolve(returnArr);
}

/**
 * 특정 상품정보 로딩
 * @param productKeyNo
 * @returns {Promise.<T>}
 */
exports.GetProduct = (productKeyNo)=>{
    productKeyNo = productKeyNo*1;
    return Promise.resolve(productMap.get(productKeyNo));
}

/**
 * 상품 소모
 * @param productKeyNo
 * @returns {Promise.<T>}
 */
exports.DecrementProduct = (productKeyNo)=>{
    productKeyNo = productKeyNo*1;
    let product = productMap.get(productKeyNo);
    product['remain'] -= 1;
    return Promise.resolve();
}


/**
 * 신규 추첨자 등록
 * @param email         {string}
 * @param productName   {string}
 * @param getNumber     {number}
 * @returns {Promise.<T>}
 */
exports.AddWinner = (email, productName, getNumber)=>{
    winnerMap.set(email, {productName:productName, getNumber:getNumber});
    return Promise.resolve();
}

/**
 * 모든 추첨자 정보 로딩
 * @returns {Promise.<Array>}
 */
exports.AllWinner = ()=>{
    let returnArr = [];
    winnerMap.forEach((value, key)=>{
        returnArr.push({productName:value['productName'], getNumber:value['getNumber'], email:key});
    });
    return Promise.resolve(returnArr);
}

