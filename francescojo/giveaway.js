// region Global variables
var editMode = EditModes.OVERVIEW;
var emailList;
// endregion Global variables

function showInputPanel(jsonMappedCsv) {
	if (0 == jsonMappedCsv.length) {
		alert("잘못된 형식의 csv 파일입니다.");
		return;
	}
	
	var inputPanel = $("inputPanel");
	inputPanel.style.display = "block";
	emailList = jsonMappedCsv;
}

function showInputMode() {
	var editBtn = $("edit");
	editBtn.innerHTML = editMode.btnCaption;

	var modeDisplay = $("modeDisplay");
	modeDisplay.innerHTML = editMode.name;
}

function onClickAddItem() {
	setEditMode(EditModes.EDITING);

	var table = $("inputTableBody");
	var rowCount = table.childElementCount;
	var editRow = document.createElement("tr");
	editRow.id = EDIT_ROW_ID + rowCount;
	/*
	 * xhr 로 로컬 static html 을 템플릿처럼 불러오는 형태면 좀더 깔끔하고 유지보수성 좋지만
	 * 대충 만드는거니 그냥 넘어간다.
	 */
	editRow.innerHTML = 
		"<td>" + rowCount + "</td>" +
		"<td><input type=\"text\" size=\"" + MAXIMUM_ITEM_NAME_LENGTH + "\" " +
			"maxlength=\"" + MAXIMUM_ITEM_NAME_LENGTH + "\" " +
			"id=\"" + ITEM_NAME_ID + rowCount + "\"/></td>" +
		"<td><input type=\"number\" size=\"" + MAXIMUM_NUMBER_LENGTH + "\" " +
			"maxlength=\"" + MAXIMUM_NUMBER_LENGTH + "\" " +
			"id=\"" + TOTAL_QTY_ID + rowCount + "\"/></td>" +
		"<td><button type=\"button\" id=\"" + DELETE_ITEM_BTN_ID + rowCount +
			"\" onclick=\"onClickDeleteItem(\'" + editRow.id + "\');\">삭제</button></td>";
	table.appendChild(editRow);
}

function onClickDeleteItem(itemRowId) {
	if (editMode == EditModes.OVERVIEW) {
		alert(EditModes.OVERVIEW.name + " 에서는 삭제 및 수정이 불가능합니다.");
		return;
	}

	var table = $("inputTableBody");
	table.removeChild($(itemRowId));
}

function onClickEdit() {
	var table = $("inputTableBody");
	var rowCount = table.childElementCount;
	if (rowCount == DEFAULT_ITEM_ROWS) {
		alert("먼저 경품을 추가해 주세요.");
		return;
	}

	if (editMode == EditModes.OVERVIEW) {
		setEditMode(EditModes.EDITING);
	} else {
		setEditMode(EditModes.OVERVIEW);
	}
}

function setInputFieldsEditable(editable) {
	traverseTable(function(column, rowIndex, columnIndex) {
		/*
		 * HTML 에서는 tagName 은 대문자.
		 * https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
		 */ 
		return /(input)|(button)/i.test(column.tagName);
	}, function(column, rowIndex, columnIndex) {
		var attrs = column.attributes;
		if (editable) {
			if (attrs.getNamedItem("disabled")) {
				attrs.removeNamedItem("disabled");
			}
		} else {
			var disabled = document.createAttribute("disabled");
			attrs.setNamedItem(disabled);
		}
		
		return false;
	})
}

function onClickDrawAll() {
	setEditMode(EditModes.OVERVIEW);

	var tableRows = $("inputTableBody").children;
	if (!drawValidation(tableRows)) {
		return;
	}

	var drawResults = new Array();
	traverseTable(function(column, rowIndex, columnIndex) {
		return columnIndex == 1 || columnIndex == 2;
	}, function(column, rowIndex, columnIndex) {
		if (drawResults.length < rowIndex) {
			drawResults.push({
				"name"    : "",
				"qty"     : 0,
				"winners" : []
			});
		}

		if (columnIndex == 1) {
			drawResults[rowIndex - 1]["name"] = column.value;
		} else if (columnIndex == 2) {
			drawResults[rowIndex - 1]["qty" ] = column.value;
		}
	})

	// 추첨 로직
	for (var i = 0; i < drawResults.length; i++) {
		var drawItem = drawResults[i];
		for (var drawCount = 0; drawCount < drawItem.qty; drawCount++) {
			var emailIdx = getRandomInt(0, emailList.length);
			drawItem.winners.push(emailList[emailIdx]);
			emailList.splice(emailIdx, 1);
		}
	}

	printResult(drawResults);
}

function drawValidation(tableRows) {
	if (tableRows.length == DEFAULT_ITEM_ROWS) {
		alert("먼저 경품을 추가해 주세요.");
		return false;
	}

	var tableValidation = traverseTable(function(column, rowIndex, columnIndex) {
		/*
		 * HTML 에서는 tagName 은 대문자.
		 * https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
		 */ 
		return /(input)/i.test(column.tagName);
	}, function(column, rowIndex, columnIndex) {
		if (column.value == undefined || column.value == "") {
			alert(rowIndex + "번째 줄의 입력이 잘못됐습니다.");
			setEditMode(EditModes.EDITING);
			return true;
		}
		
		return false;
	})
	
	if (!tableValidation) {
		return false;
	}

	return validateEmails(emailList);
}

function setEditMode(mode) {
	editMode = mode;
	if (editMode == EditModes.EDITING) {
		setInputFieldsEditable(true);
	} else {
		setInputFieldsEditable(false);
	}
	showInputMode();
}

function validateEmails(mapList) {
	if (!mapList || mapList.length == 0) {
		alert("입력된 이메일 목록이 없습니다.");
		return false;
	}

	for (var i = 0; i < mapList.length; i++) {
		if (mapList[i]["email"] == undefined) {
			alert("'email' 필드가 없는 csv 파일을 입력하셨습니다.");
			return false;
		}
	}

	return true;
}

/**
 * @param predicate: 테이블의 각 행과 열에 도달시마다 관련 작업 수행을 위한 전제조건.
 * function(column: tableColumnElement, rowIndex: number, colIndex: number) 형태를 만족해야 하고,
 * 반환값은 true / false 여야만 한다.
 * @param task: predicate 테스트 성공시 수행할 작업.
 * function(column: tableColumnElement, rowIndex: number, colIndex: number) 형태를 만족해야 하고,
 * 반환값은 true / false 여야만 한다. true 반환시 task 로 인해 traversal 을 중단해야 한다는 의미이며,
 * false 반환은 traversal 을 계속한다는 의미이다.
 * 
 * @return true: traverse 가 끝까지 수행됨. false: traverse 가 중단
 */
function traverseTable(predicate, task) {
	var tableRows = $("inputTableBody").children;
	for (var i = DEFAULT_ITEM_ROWS; i < tableRows.length; i++) {
		var tableCols = tableRows[i].children;
		for(var j = 0; j < tableCols.length; j++) {
			if (tableCols[j].children.length == 0) {
				continue;
			}
			var colCont = tableCols[j].children[0];
			if (predicate(colCont, i, j)) {
				if (task(colCont, i, j)) {
					return false;
				}
			}
		}
	}
	
	return true;
}

function printResult(drawResults) {
	var fileUploadPanel = $("fileUpload");
	fileUploadPanel.style.display = "none";

	var inputPanel = $("inputPanel");
	inputPanel.style.display = "none";

	var printPanel = $("resultPanel");
	printPanel.style.display = "block";
	
	var tabCount = 5;
	var tabStr = getTabStr(tabCount);
	var result = "";
	for (var i = 0; i < drawResults.length; i++) {
		var drawItem = drawResults[i];
		result += "경품 '" + drawItem.name +  "(총 수량: " + drawItem.qty + "개)' 의 추첨 결과: \n\n" +
					"\t이메일" + tabStr + "경품 수량\n" +
					"\t----" + tabStr + "-------\n";
		for (var j = 0; j < drawItem.winners.length; j++) {
			var email = drawItem.winners[j].email;
			// tab size: 8
			var tabsCount = Math.ceil(8 * tabCount - email.length) / 8;
			console.log(tabsCount);
			result += "\t" + drawItem.winners[j].email + getTabStr(tabsCount) + "1\n";
		}
		result += "\n";
	}
	result += "경품 추첨이 끝났습니다. 다시 하시려면 새로고침 해 주세요.";

	printPanel.innerHTML = result;
}