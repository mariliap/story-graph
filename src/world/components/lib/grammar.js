export function addPeriod(text) {
  return `${text}. `
}

export function capitalizeFirst(text) {
  const head = text[0].toUpperCase()
  const tail = text.substring(1)
  return head + tail
}

export function adaptArticles(text){
  
  let result = text.replace(" de a ", " da ");
  result = result.replace(" de o ", " do ");
  result = result.replace(" em a ", " na ");
  result = result.replace(" em o ", " no ");
  result = result.replace(" em uma ", " num ");
  result = result.replace(" em um ", " numa ");
  result = result.replace(" a a ", " à ");
  result = result.replace(" a o ", " ao ");
  result = result.replace(" por a ", " pela ");
  result = result.replace(" por o ", " pelo ");
  return result
}