export default function saveDoc(dom, filename) {

  if (!window.Blob) {
    alert('Your legacy browser does not support this action.');
    return;
  }

  var html, link, blob, url, css;

  // EU A4 use: size: 841.95pt 595.35pt;
  // US Letter use: size:11.0in 8.5in;

  css = ('\
    <style>\
    @page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}\
    .Section1 {page: WordSection1;}\
    h1 {font-family: "Times New Roman", Georgia, Serif; font-size: 16pt;}\
    p {font-family: "Times New Roman", Georgia, Serif; font-size: 14pt;}\
    </style>\
  ');

  var rightAligned = document.getElementsByClassName("sm-align-right");
  for (let i=0, max=rightAligned.length; i < max; i++) {
    rightAligned[i].style = "text-align: right;"
  }

  var centerAligned = document.getElementsByClassName("sm-align-center");
  for (let i=0, max=centerAligned.length; i < max; i++) {
    centerAligned[i].style = "text-align: center;"
  }

  html = dom.innerHTML;
  html = '\
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">\
  <head>\
    <title>Document Title</title>\
    <xml>\
      <w:worddocument xmlns:w="#unknown">\
        <w:view>Print</w:view>\
        <w:zoom>90</w:zoom>\
        <w:donotoptimizeforbrowser />\
      </w:worddocument>\
    </xml>\
  </head>\
  <body lang=RU-ru style="tab-interval:.5in">\
    <div class="Section1">' + html + '</div>\
  </body>\
  </html>'

  blob = new Blob(['\ufeff', css + html], {
    type: 'application/msword'
  });
  
  url = URL.createObjectURL(blob);
  link = document.createElement('A');
  link.href = url;

  // Set default file name.
  // Word will append file extension - do not add an extension here.
  link.download = filename;   
  
  document.body.appendChild(link);
  
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob( blob, filename + '.doc'); // IE10-11
  } else {
    link.click(); // other browsers
  }

  document.body.removeChild(link);
}