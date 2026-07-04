const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('d:/Project/Auction-saas/apps/dashboard/app');
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace primary buttons: any button with bg-[#0C3278] or bg-blue-600
  newContent = newContent.replace(/className=\"[^\"]*(bg-\\[#0C3278\\]|bg-blue-600)[^\"]*\"/g, 'className=\"btn-primary\"');
  newContent = newContent.replace(/className=\{`flex-1 py-3 text-sm font-bold transition-colors \$\{uploadMethod === "MANUAL" \? "bg-\\[#012972\\] text-white" : "text-gray-600 hover:bg-gray-50"}`\}/g, 'className={`btn-primary flex-1`}');
  
  // Replace secondary buttons: any button with hover:bg-gray-100 and text-gray-600
  newContent = newContent.replace(/className=\"[^\"]*(hover:bg-gray-100|border border-gray-200)[^\"]*\"/g, (match) => {
     // Ensure it's actually a button we want to change
     if (match.includes('text-gray-600') && match.includes('font-bold')) {
        return 'className=\"btn-secondary\"';
     }
     return match;
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    modifiedCount++;
  }
});

console.log('Modified files:', modifiedCount);
