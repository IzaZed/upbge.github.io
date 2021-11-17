if(!Scorer)var Scorer={objNameMatch:11,objPartialMatch:6,objPrio:{0:15,1:5,2:-5},objPrioDefault:0,title:15,partialTitle:7,term:5,partialTerm:2};if(!splitQuery)function splitQuery(e){return e.split(/\s+/)}var Search={_index:null,_queued_query:null,_pulse_status:-1,htmlToText:function(e){var t=document.implementation.createHTMLDocument("virtual"),r=$(e,t);return r.find(".headerlink").remove(),docContent=r.find("[role=main]")[0],void 0===docContent?(console.warn("Content block not found. Sphinx search tries to obtain it via '[role=main]'. Could you check your theme or template."),""):docContent.textContent||docContent.innerText},init:function(){var e=$.getQueryParameters();if(e.q){var t=e.q[0];$('input[name="q"]')[0].value=t,this.performSearch(t)}},loadIndex:function(e){$.ajax({type:"GET",url:e,data:null,dataType:"script",cache:!0,complete:function(t,r){"success"!=r&&(document.getElementById("searchindexloader").src=e)}})},setIndex:function(e){var t;this._index=e,null!==(t=this._queued_query)&&(this._queued_query=null,Search.query(t))},hasIndex:function(){return null!==this._index},deferQuery:function(e){this._queued_query=e},stopPulse:function(){this._pulse_status=0},startPulse:function(){this._pulse_status>=0||function e(){var t;Search._pulse_status=(Search._pulse_status+1)%4;var r="";for(t=0;t<Search._pulse_status;t++)r+=".";Search.dots.text(r),Search._pulse_status>-1&&window.setTimeout(e,500)}()},performSearch:function(e){this.out=$("#search-results"),this.title=$("<h2>"+_("Searching")+"</h2>").appendTo(this.out),this.dots=$("<span></span>").appendTo(this.title),this.status=$('<p class="search-summary">&nbsp;</p>').appendTo(this.out),this.output=$('<ul class="search"/>').appendTo(this.out),$("#search-progress").text(_("Preparing search...")),this.startPulse(),this.hasIndex()?this.query(e):this.deferQuery(e)},query:function(e){var t,r=new Stemmer,n=[],a=[],i=[],s=splitQuery(e),o=[];for(t=0;t<s.length;t++)if(""!==s[t]&&o.push(s[t].toLowerCase()),-1==$u.indexOf(stopwords,s[t].toLowerCase())&&""!==s[t]){var u,c=r.stemWord(s[t].toLowerCase());c.length<3&&s[t].length>=3&&(c=s[t]),"-"==c[0]?(u=a,c=c.substr(1)):(u=n,i.push(s[t].toLowerCase())),$u.contains(u,c)||u.push(c)}var h="?highlight="+$.urlencode(i.join(" ")),l=this._index.terms,f=this._index.titleterms,p=[];for($("#search-progress").empty(),t=0;t<o.length;t++){var d=[].concat(o.slice(0,t),o.slice(t+1,o.length));p=p.concat(this.performObjectSearch(o[t],d))}if(p=p.concat(this.performTermsSearch(n,a,l,f)),Scorer.score)for(t=0;t<p.length;t++)p[t][4]=Scorer.score(p[t]);p.sort((function(e,t){var r=e[4],n=t[4];return r>n?1:r<n||(r=e[1].toLowerCase())>(n=t[1].toLowerCase())?-1:r<n?1:0}));var m=p.length;!function e(){if(p.length){var t=p.pop(),r=$("<li></li>"),a="",s="";if("dirhtml"===DOCUMENTATION_OPTIONS.BUILDER){var o=t[0]+"/";o.match(/\/index\/$/)?o=o.substring(0,o.length-6):"index/"==o&&(o=""),s=a=DOCUMENTATION_OPTIONS.URL_ROOT+o}else a=DOCUMENTATION_OPTIONS.URL_ROOT+t[0]+DOCUMENTATION_OPTIONS.FILE_SUFFIX,s=t[0]+DOCUMENTATION_OPTIONS.LINK_SUFFIX;r.append($("<a/>").attr("href",s+h+t[2]).html(t[1])),t[3]?(r.append($("<span> ("+t[3]+")</span>")),Search.output.append(r),setTimeout((function(){e()}),5)):DOCUMENTATION_OPTIONS.HAS_SOURCE?$.ajax({url:a,dataType:"text",complete:function(t,a){var s=t.responseText;""!==s&&void 0!==s&&r.append(Search.makeSearchSummary(s,n,i)),Search.output.append(r),setTimeout((function(){e()}),5)}}):(Search.output.append(r),setTimeout((function(){e()}),5))}else Search.stopPulse(),Search.title.text(_("Search Results")),m?Search.status.text(_("Search finished, found %s page(s) matching the search query.").replace("%s",m)):Search.status.text(_("Your search did not match any documents. Please make sure that all words are spelled correctly and that you've selected enough categories.")),Search.status.fadeIn(500)}()},performObjectSearch:function(e,t){var r,n=this._index.filenames,a=this._index.docnames,i=this._index.objects,s=this._index.objnames,o=this._index.titles,u=[];for(var c in i)for(var h in i[c]){var l=(c?c+".":"")+h,f=l.toLowerCase();if(f.indexOf(e)>-1){var p=0,d=f.split(".");f==e||d[d.length-1]==e?p+=Scorer.objNameMatch:d[d.length-1].indexOf(e)>-1&&(p+=Scorer.objPartialMatch);var m=i[c][h],S=s[m[1]][2],v=o[m[0]];if(t.length>0){var x=(c+" "+h+" "+S+" "+v).toLowerCase(),g=!0;for(r=0;r<t.length;r++)if(-1==x.indexOf(t[r])){g=!1;break}if(!g)continue}var T=S+_(", in ")+v,O=m[3];""===O?O=l:"-"==O&&(O=s[m[1]][1]+"-"+l),Scorer.objPrio.hasOwnProperty(m[2])?p+=Scorer.objPrio[m[2]]:p+=Scorer.objPrioDefault,u.push([a[m[0]],l,"#"+O,T,p,n[m[0]]])}}return u},escapeRegExp:function(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")},performTermsSearch:function(e,t,r,n){var a,i,s,o=this._index.docnames,u=this._index.filenames,c=this._index.titles,h={},l={},f=[];for(a=0;a<e.length;a++){var p=e[a],d=[],m=[{files:r[p],score:Scorer.term},{files:n[p],score:Scorer.title}];if(p.length>2){var S=this.escapeRegExp(p);for(var _ in r)_.match(S)&&!r[p]&&m.push({files:r[_],score:Scorer.partialTerm});for(var _ in n)_.match(S)&&!n[p]&&m.push({files:n[_],score:Scorer.partialTitle})}if($u.every(m,(function(e){return void 0===e.files})))break;for($u.each(m,(function(e){var t=e.files;if(void 0!==t)for(void 0===t.length&&(t=[t]),d=d.concat(t),i=0;i<t.length;i++)(s=t[i])in l||(l[s]={}),l[s][p]=e.score})),i=0;i<d.length;i++)(s=d[i])in h&&-1===h[s].indexOf(p)?h[s].push(p):h[s]=[p]}for(s in h){var v=!0,x=e.filter((function(e){return e.length>2})).length;if(h[s].length==e.length||h[s].length==x){for(a=0;a<t.length;a++)if(r[t[a]]==s||n[t[a]]==s||$u.contains(r[t[a]]||[],s)||$u.contains(n[t[a]]||[],s)){v=!1;break}if(v){var g=$u.max($u.map(h[s],(function(e){return l[s][e]})));f.push([o[s],c[s],"",null,g,u[s]])}}}return f},makeSearchSummary:function(e,t,r){var n=Search.htmlToText(e),a=n.toLowerCase(),i=0;$.each(t,(function(){var e=a.indexOf(this.toLowerCase());e>-1&&(i=e)}));var s=((i=Math.max(i-120,0))>0?"...":"")+$.trim(n.substr(i,240))+(i+240-n.length?"...":""),o=$('<p class="context"></p>').text(s);return $.each(r,(function(){o=o.highlightText(this,"highlighted")})),o}};$(document).ready((function(){Search.init()}));