const fs = require('fs');

const isHeader = line => {
  return line !== '' && line[0].includes('#') ? true : false;
} 

const isBlank = line => {
  return line === '' ? true : false;
}

const parse = path => {
  const data = fs.readFileSync(path);
  const file = data.toString();

  const lineArray = ['', ...file.split(/\r\n|\n/)];
  const sanitized = lineArray.map(line => line.trim()).filter((line, i, arr) => {
    if (i > 0) { 
      return (!isBlank(line) || (isBlank(line) && !isBlank(arr[i-1])))
    }
  });

  const parsed = sanitized.map((ln, index, arr) => {
    if (index > 0 && index < arr.length - 1) {
      const prevHeader = isHeader(arr[index-1]);
      const nextHeader = isHeader(arr[index+1]);
      return isBlank(ln) && !prevHeader && !nextHeader ? '&nbsp;\n' : ln;
    }
  }).join('\n');

  const writeErr = fs.writeFileSync('./parsed.md', parsed);
  
  if (!writeErr) {
    return 'Parse complete'
  } else {
    throw writeErr;
  }
}

module.exports = parse;
