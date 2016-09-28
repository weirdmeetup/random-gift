'use strict'

const fs = require('fs');
const parse = require('csv-parse');


/**
 * 파일 로딩
 * @param filePath      {string}
 * @returns {Promise}
 */
exports.LoadFile = (filePath)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(filePath, 'utf8', (err, data)=>{
            resolve(data);
        });
    });
}

/**
 * 업로드한 파일을 unlink한다
 * @param filePath
 * @returns {Promise}
 */
exports.UnlinkFile = (filePath)=>{
    return new Promise((resolve, reject)=>{
        fs.unlink(filePath, (err)=>{
            //결과 전송.
            resolve();
        });
    });
}


/**
 * CSV 파일 text를 Array 형태로 변경한다.
 * @param fileData      {string}
 * @returns {Promise}   생성된 데이터의 첫 컬럼은 csv 첫컬럼으로 어떤데이터 있는지 나타내게된다.
 */
exports.CSVTextToArr = (fileData)=>{
    return new Promise((resolve, reject)=>{
        parse(fileData, (err, output)=>{
            if(err) {
                reject(err);
                return;
            }

            resolve(output);
        });
    });
}