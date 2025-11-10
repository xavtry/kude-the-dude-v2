export function isUrlLike(text){
try{
if(/^\w+:\/\//.test(text)) return true;
// quick domain check
if(/^[^\s]+\.[a-z]{2,}$/i.test(text)) return true;
}catch(e){}
return false;
}


export function asSearchQuery(text){
return 'https://www.google.com/search?q=' + encodeURIComponent(text);
}
