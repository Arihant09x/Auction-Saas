const fs = require('fs');

const file = 'd:/Project/Auction-saas/apps/dashboard/app/dashboard/create-auction/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The exact string matches from create-auction/page.tsx:
content = content.replace(/className="bg-\[\#0C3278\] border border-\[\#FFBA00\] text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-\[\#082254\] cursor-pointer transition-colors disabled:opacity-70 flex items-center gap-2"/g, 'className="btn-primary"');
content = content.replace(/className="inline-flex items-center gap-2 bg-\[\#FFBA00\] text-\[\#012972\] rounded-full font-bold text-\[15px\] border border-\[\#012972\] px-8 py-3 font-epilogue hover:opacity-90 cursor-pointer transition-opacity transition-all duration-200"/g, 'className="btn-primary"');
content = content.replace(/className="flex justify-end mt-2 w-fit bg-\[\#0C3278\] border border-\[\#FFBA00\] text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-\[\#082254\] cursor-pointer transition-colors disabled:opacity-70 gap-2"/g, 'className="btn-primary"');
content = content.replace(/className="bg-\[\#0C3278\] w-fit border border-\[\#FFBA00\] text-white px-11 py-3 rounded-full font-bold shadow-md hover:bg-\[\#082254\] cursor-pointer transition-colors disabled:opacity-70 flex items-center gap-2"/g, 'className="btn-primary"');
content = content.replace(/className="bg-\[\#0C3278\] border border-\[\#FFBA00\] text-white px-8 py-2\.5 rounded-full font-bold hover:bg-\[\#082254\] transition-colors disabled:opacity-50 flex items-center gap-2"/g, 'className="btn-primary"');
content = content.replace(/className="flex justify-center items-center mt-2 w-fit h-fit bg-\[\#0C3278\] border border-\[\#FFBA00\] text-white px-10 py-3 rounded-full font-bold shadow-md hover:bg-\[\#082254\] cursor-pointer transition-colors disabled:opacity-70 gap-2"/g, 'className="btn-primary"');

content = content.replace(/className="flex items-center gap-2 px-6 py-2\.5 text-gray-600 font-bold hover:bg-gray-100 cursor-pointer rounded-full transition-colors border border-gray-200 font-poppins"/g, 'className="btn-secondary"');

fs.writeFileSync(file, content, 'utf8');
console.log('Finished updating create-auction');
