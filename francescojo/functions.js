function $(elementId) {
	return document.getElementById(elementId);
}

function csv2Json(csvTextFile) {
	var lines = csvTextFile.split("\n");
	var result = [];
	var headers = lines[0].split(",");
	for (var i = 1; i < lines.length; i++) {
		var obj = {};
		var currentline = lines[i].split(",");
		for (var j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}

	return result;
}

/**
 * [min, max) 범위의 랜덤한 정수를 반환합니다. 사용하는 브라우저의 버전에 따라 분산이 일정하지 않을 수 있습니다.
 * firefox, chrome 이나 opera 브라우저에서는 비교적 고른 분산을 확인할 수 있습니다.
 * 
 * @param min 최소 난수값 (범위에 포함됨)
 * @param max 최대 난수값 (범위에 포함되지 않음)
 * @returns [min, max) 사이의 난수값
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getTabStr(count) {
	var tabStr = "";
	for (var i = 0; i < count; i++) {
		tabStr += "\t";
	}

	return tabStr;
}