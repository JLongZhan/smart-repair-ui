// 深拷贝
export function deepCopy(value) {
	return JSON.parse(JSON.stringify(value));
}

// 判断变量是否是Number类型
export function isNumber(s) {
	return Object.prototype.toString.call(s) === '[object Number]';
}

export function isString(s) {
	return Object.prototype.toString.call(s) === '[object String]';
}

export function isObject(s) {
	return Object.prototype.toString.call(s) === '[object Object]';

}

export function isArray(s) {
	return Object.prototype.toString.call(s) === '[object Array]';
}

//保留两位小数
//功能：将浮点数四舍五入，取小数点后2位
Number.prototype.toDecimal = function toDecimal(x) {
	return Math.round(this * Math.pow(10, x)) / Math.pow(10, x);
};

// 求合array
Array.prototype.getSum = function () {
	let s = 0;
	for (let t of this) {
		s += t;
	}
	return s;
};

// [{name: 'jack',age: 18},{name: 'luc',age: 18},{name: 'mack',age: 18}]是否包含{name: 'mack'}。要传入比较的key(第二个参数)，是name,还是age
Array.prototype.isContainObject = function (compareObject, key) {
	return this.findIndex(item => item[key] === compareObject[key]) !== -1;
};

// 判断是string, 并且length>0
export function isStringAndHasLength(s) {
	return Object.prototype.toString.call(s) === '[object String]' && s.length > 0;
}

// 这个判断是对象，而且{}是否有keys
export function isObjectAndHasKeys(s) {
	return Object.prototype.toString.call(s) === '[object Object]' && Object.keys(s).length > 0;
}

// 这个判断是对象，而且{}是否有keys
export function isObjectAndNotHasKeys(s) {
	return Object.prototype.toString.call(s) === '[object Object]' && Object.keys(s).length === 0;
}

export function isObjectAndContainKey(s, oneKey) {
	return Object.prototype.toString.call(s) === '[object Object]' && Object.keys(s).length > 0 && Object.prototype.hasOwnProperty.call(s, oneKey);
}

// 这个判断是array，而且array.length>0
export function isArrayAndHasLength(s) {
	return Object.prototype.toString.call(s) === '[object Array]' && s.length > 0;
}

// 这个判断是array，而且array.length===0
export function isArrayAndEmpty(s) {
	return Object.prototype.toString.call(s) === '[object Array]' && s.length === 0;
}

// list [1,2,2,3,4] 去重  [...new Set(arr)]
Array.prototype.removeRepeat = function () {
	return [...new Set(this)];
};

// 得到item的所有keys
export function getItemKeys(item) {
	let ketList = [];
	for (let key in item) {
		// if (item.hasOwnProperty(key))
		if (Object.prototype.hasOwnProperty.call(item, key))
			ketList.push(key);
	}
	return ketList;
}

// 传入一个对象组成的列表，和一个对象的key。然后这个这个key对应的值value组成List
export function itemListToValueList(itemList, key) {
	let valueList = [];
	for (let item of itemList) {
		valueList.push(item[key]);
	}
	return valueList;
}

export function itemListToSomeKeyNoRepeatList(dataList, compareKeyList) {
	// console.log(dataList);
	// console.log(compareKeyList);

	let noRepeatList = [];
	for (let t of dataList) {
		// console.log(t);
		// noRepeatList如果不存在t，那么，就push进去
		// 是否能找到这个这几个字段都相同的item
		let index = noRepeatList.findIndex(function (item) {
			let result = true;
			// 比较是否所有字段值都相同。(如果有一个不相同，那表示)
			for (let compareKey of compareKeyList) {
				if (item[compareKey] !== t[compareKey]) {
					result = false
				}
			}
			return result;
		});
		// console.log(index)

		// noRepeatList如果不存在t，那么，就push进去
		if (index === -1) {
			let item = {};
			for (let compareKey of compareKeyList) {
				item[compareKey] = t[compareKey]
			}
			noRepeatList.push(item);
		}
	}
	// console.log(noRepeatList);
	return noRepeatList
}

export function formatNum(value) {
	// 只处理数字
	if (!isNumber(value)) {
		return value;
	}

	value = value + '';
	var newStr = "";
	var count = 0;

	if (value.indexOf(".") == -1) {
		for (var i = value.length - 1; i >= 0; i--) {
			if (count % 3 == 0 && count != 0) {
				newStr = value.charAt(i) + "," + newStr;
			} else {
				newStr = value.charAt(i) + newStr;
			}
			count++;
		}
		value = newStr;
		// console.log(value)
	} else {
		for (let i = value.indexOf(".") - 1; i >= 0; i--) {
			if (count % 3 === 0 && count !== 0) {
				newStr = value.charAt(i) + "," + newStr;
			} else {
				newStr = value.charAt(i) + newStr; //逐个字符相接起来
			}
			count++;
		}
		value = newStr + (value + "00").substr((value + "00").indexOf("."), 3);
		// console.log(value)
	}
	return value;
}

// str（类似【2022-05-23】） 转成 date
export function strToDate(str) {
	// console.log(new Date(str.replace(/-/g, '/')));
	return new Date(str.replace(/-/g, '/'))
}

// date 转成 str（类似【2022-05-23】）
export function dateToStr(date) {
	let year = date.getFullYear().toString().padStart(2, '0');
	let month = (date.getMonth() + 1).toString().padStart(2, '0');
	let d = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${d}`
}
