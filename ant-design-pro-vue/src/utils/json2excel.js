
const { export_json_to_excel } = require('./Export2Excel.js')

export default function json2excel (jsonData, tHeader, filterVal, title) {
  const formatJson = jsonData.map(item => filterVal.map(i => item[i]))
  export_json_to_excel(tHeader, formatJson, title)
}
