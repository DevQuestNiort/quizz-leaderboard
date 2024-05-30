const GOOD_ANSWER_SCORE = 3
const BAD_ANSWER_SCORE = 1
const EMAIL_COLUMN_INDEX = '1'
const ANSWER_COLUMN_INDEX = '2' 
const GOOD_ANSWER_CELL = 'D1'

function doGet() {

  let sheets = SpreadsheetApp.getActive().getSheets()

  let results = sheets.map(sheet => {
      // get data without header
      const data = sheet.getDataRange().getValues().slice(1)
      
      const goodAnswerValue = sheet.getRange(GOOD_ANSWER_CELL).getValue()

      return data.map(row => {
        const score = row[ANSWER_COLUMN_INDEX] === goodAnswerValue ? GOOD_ANSWER_SCORE : BAD_ANSWER_SCORE
        return {email: row[EMAIL_COLUMN_INDEX], score: score}
      })
    })
    .flat() 
    // Group by email
    .reduce((acc, currentValue)  => { 
      if(!acc[currentValue.email])  {
        acc[currentValue.email] = currentValue.score
      } else {
        acc[currentValue.email] += currentValue.score
      }
      return acc
    }, {})

  results = Object.keys(results).map(email => {
    return {email, score: results[email]}
  }).sort((a,b) => Number(b.score) - Number(a.score))
  
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}
