var express=require('express')
var cors=require('cors')
var GoogleImages=require('google-images')
var client=new GoogleImages(process.env.cse_id,process.env.api_key)
var app = express();
var mongoose=require('mongoose')
var searchText=require('./model/searchVal.js')
//
mongoose.connect(process.env.dburl);
//
var x=[];
app.get('/api/imagesearch/:sv*',(req,res)=>{
  var {sv}=req.params;
  x=[];
  var {offset}=req.query;
  var pg=Math.floor(offset/10);
  var pi=offset-pg*10;
  pg++;
  console.log(sv);
  var data=new searchText({SearchText:sv,SearchDate:new Date()});
  data.save(err=>{
    if(err) res.send('cannot connect to database');
    });
  client.search(sv,{page:pg+1}).then(images=>{
    for(var i=pi;i<10;i++){
      var t={'Image-Url':images[i].url,'Alt-text':images[i].description,'Page-Url':images[i].parentPage};
      x.push(t);
    }
    client.search(sv,{page:pg+2}).then(imges=>{
    for(var i=0;i<pi;i++){
      var t={'Image-Url':imges[i].url,'Alt-text':imges[i].description,'Page-Url':imges[i].parentPage};
      x.push(t);
    }
    res.json(x);console.log(x.length)})
  })
 /* client.search(sv,{page:pg+1}).then(images=>{
    for(var i=0;i<pi;i++){
      var t={'Image-Url':images[i].url,'Alt-text':images[i].description,'Page-Url':images[i].parentPage};
      x.push(t);
    }
  })*/
  //res.json(x);
})
app.get('/api/latest/imagesearch',(req,res)=>{
  var st=[];
searchText.find({},(err,data)=>{
  for(var i=data.length-1;i>=0&&st.length<10;i--){
    st.push(data[i])
  }
  res.json(st);
})
})
app.get('/',(req,res)=>{
res.sendFile(__dirname+'/views/index.html')
})
app.listen(process.env.PORT);