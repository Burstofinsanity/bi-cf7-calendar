
class calendar{
    constructor(atts){
        let self = this;
        self.isset = function(target){
            return typeof target !== 'undefined'?true:false;
        };

        self.splitClass = function(cls){
            let arr = cls !== ""?[cls]:[];
            if(cls.indexOf(' ') > -1){
                arr = cls.split(' ');
            }
            return arr;
        };

        self.linkCSS = function(css,callback){
            let linked = false;
            let links = document.getElementsByTagName('link');
            for(let l of links){
                if(l.href === self.css){
                    linked = true;
                }
            }
            if(!linked){
                let calcss=document.createElement("link")
                calcss.setAttribute("rel", "stylesheet")
                calcss.setAttribute("type", "text/css")
                calcss.setAttribute("href", css);
                document.head.appendChild(calcss);
                if (callback !== undefined)
                    calcss.addEventListener('load', function () {
                        callback();
                    }, true);

            }
            else
                callback();
        };

        self.reveal = function(){
            self.target.style.display = 'block';
        };

        //Settings
        self.target =  self.isset(atts.target)?atts.target:null;
        self.prefix = self.isset(atts.prefix)?atts.prefix:'calendar';
        self.cssJoin = self.isset(atts.cssJoin)?atts.cssJoin:'-';
        self.dateJoin = self.isset(atts.dateJoin)?atts.dateJoin:'-';
        self.dateSeperator = self.isset(atts.dateSeperator)?atts.dateSeperator:';';
        self.rangeSeperator = self.isset(atts.rangeSeperator)?atts.rangeSeperator:' - ';
        self.static = self.isset(atts.static)?atts.static:false;
        self.range = self.isset(atts.range)?atts.range:false;
        if(!self.range && self.target.hasAttribute('range') && self.target.getAttribute('range') === 'true')
                self.range = true;

        self.multiple = self.isset(atts.multiple)?atts.multiple:false;
        if(!self.multiple && self.target.hasAttribute('multiple') && self.target.getAttribute('multiple') === 'true')
            self.multiple = true;
        self.shortMonth = self.isset(atts.shortMonth)?atts.shortMonth:false;
        self.date = self.isset(atts.date)?atts.date:new Date();
        self.today = self.isset(atts.today)?atts.today:new Date();
        self.selected = self.isset(atts.selected)?atts.selected:new Date();
        self.input = null;
        self.rangeEndInput = null;
        self.yearClass = self.isset(atts.yearClass)?atts.yearClass:"";
        self.monthClass = self.isset(atts.monthClass)?atts.monthClass:"";
        self.dayClass = self.isset(atts.dayClass)?atts.dayClass:"";
        self.class = self.isset(atts.class)?atts.class:"";
        self.minDate = self.isset(atts.minDate)?atts.minDate:null;
        self.maxDate = self.isset(atts.maxDate)?atts.maxDate:null;
        self.fs = true;
        self.sf = true;
        self.dateFormat = "d-m-Y";

        self.body = '';
        self.dayOftheWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        self.shortdayOftheWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        self.fullMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        self.Month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        if(self.static)
            self.target.style.display = 'none';

        //check requirements

        self.cssLocation =  self.isset(atts.cssLocation)?atts.cssLocation:'/assets/css/calendar.css';
        self.iconsLocation =  self.isset(atts.iconsLocation)?atts.iconsLocation:'https://fonts.googleapis.com/icon?family=Material+Icons';
        self.linkCSS(self.cssLocation, self.reveal);
        self.linkCSS(self.iconsLocation);



        if(self.multiple)
            self.selected = [];


        self.staticCalendar = function(target){
            console.log(target);
        };

        self.refresh = function(date){
            console.log(self.target);
            self.target.innerHTML = "";
            self.render(date);
        };


        self.almanac = function(date){
            let sdd = new Date(date.getFullYear(), date.getMonth(), 1);
            const swd = sdd.getDay();
            let mdd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const ml = mdd.getDate();
            let running = true;
            let count = 0;
            let linear = 0;
            let wdc = 0;
            let wc = 0;
            let ms = false;
            let cal = [];
            let weekcal = [];
            weekcal[0] = [];
            while(running){
                if(wdc === swd)
                    ms = true;
                if(count < ml){
                    if(ms){
                        weekcal[wc][wdc] = count + 1;
                        let m = date.getMonth();
                        let y = date.getFullYear();
                        let cb = {};
                        cb["day"]  = count + 1;
                        cb["month"] = m+1;
                        cb["year"] = y;
                        cal[linear] = cb;
                        cal[linear] = cb;
                    }
                    else
                    {
                        weekcal[wc][wdc] = new Date(date.getFullYear(), date.getMonth(), (wdc - swd+1)) .getDate();
                        let cb = {};
                        cb["day"] = new Date(date.getFullYear(), date.getMonth(), (wdc - swd+1)).getDate();
                        let m = date.getMonth()-1;
                        let y = date.getFullYear();
                        if(m < 0){
                            m = 11;
                            y = y -1;
                        }
                        cb["month"] = m+1;
                        cb["year"] = y;
                        cal[linear] = cb;
                    }
                }
                else{
                    weekcal[wc][wdc] = (count - ml) +1;
                    let cb = {};
                    cb["day"] = (count - ml) +1;
                    let m = date.getMonth()+1;
                    let y = date.getFullYear();
                    if(m > 11){
                        m = 0;
                        y = y +1;
                    }
                    cb["month"] = m+1;
                    cb["year"] = y;
                    cal[linear] = cb;

                }
                if(count >= ml && wdc === 6){
                    running = false;
                }

                if(ms){
                    count ++
                }

                if(wdc === 6){
                    wdc = 0;
                    wc ++;
                    weekcal[wc] = [];
                }
                else
                {
                    wdc ++;
                }

                linear ++;
                if(linear > 42) running = false;
            }
            this.calend = cal;
        }

        self.renderAlamanc = function(){
            self = this;
            let al = this.createElement('div',this.prefix+this.cssJoin+'almanac');
            al.classList.add('almanac');

            let ds = null, ms = null,ys = null
            let dt =  this.today.getDate(), mt =  this.today.getMonth()+1, yt = this.today.getFullYear();
            if(self.multiple){
                ds = [], ms = [],ys = [];
                for (const sel of self.selected) {
                    ds.push( sel.getDate());
                    ms.push(sel.getMonth()+1);
                    ys.push(sel.getFullYear());
                }
            }
            else
            {
                ds =  self.selected.getDate(), ms =  self.selected.getMonth()+1, ys = self.selected.getFullYear();
            }
            let drs =  self.isset(this.range_start)?this.range_start.getDate():null, mrs =  self.isset(this.range_start)?this.range_start.getMonth()+1:null, yrs = self.isset(this.range_start)?this.range_start.getFullYear():null;
            let dre =  self.isset(this.range_end)?this.range_end.getDate():null, mre =  self.isset(this.range_end)?this.range_end.getMonth()+1:null, yre = self.isset(this.range_end)?this.range_end.getFullYear():null;
            let maxDate = new Date(self.maxDate);
            for(let d of this.calend){
                let day = this.createElement('div',this.prefix+this.cssJoin+'day')
                let classes = self.splitClass(self.dayClass);
                if(classes.length> 0)
                    for(let c of classes)
                    {
                        day.classList.add(c);
                    }
                let span = self.createElement('span');
                span.innerHTML =d['day'];
                if(d['month'] !== self.date.getMonth()+1)
                    day.classList.add(this.prefix+this.cssJoin+'fade');

                if(d['day'] > maxDate.getDay())
                    console.log(d);

                day.appendChild(span);

                day.addEventListener('click',function(e){
                    if(!self.range)self.selectDate(this);
                    if(self.range)self.selectRange(this);
                });
                if(d['day'] === dt&& (d['month']) === mt && d['year'] === yt)
                    day.classList.add(this.prefix+this.cssJoin+'today');

                if(self.multiple){
                    let td = false, tm = false, ty = false;

                    for(let x = 0; x < ys.length; x ++){
                        if(ys[x] === d['year'] && ms[x] === d['month'] && ds[x] === d['day'] )
                            day.classList.add(this.prefix+this.cssJoin+'selected')
                    }

                }
                else
                if(d['day'] === ds &&(d['month']) === ms && d['year'] === ys && !self.range)
                    day.classList.add(this.prefix+this.cssJoin+'selected');

                if(d['day'] === drs &&(d['month']) === mrs && d['year'] === yrs && self.range)
                    day.classList.add(this.prefix+this.cssJoin+'selected'+this.cssJoin+'start');

                if(d['day'] === dre && (d['month']) === mre &&  d['year'] === yre &&  self.range)
                    day.classList.add(this.prefix+this.cssJoin+'selected'+this.cssJoin+'end');


                day.setAttribute('day',d['day']);
                day.setAttribute('month',d['month']);
                day.setAttribute('year',d['year']);
                al.appendChild(day);

            }
            this.target.appendChild(al);
            if(self.range){
                self.setBetween();
            }
        }

        self.renderYearlyAlamanc = function(){
            self = this;
            let al = this.createElement('div',this.prefix+this.cssJoin+'year-almanac');
            al.classList.add('almanac');
            let oyear = this.date.getFullYear();
            let yearRen = function(y,prefix,join){
                let year = document.createElement('div');
                year.classList.add(prefix+join+'year')
                let classes = self.splitClass(self.yearClass);
                if(classes.length> 0)
                    for(let c of classes)
                    {
                        year.classList.add(c);
                    }
                let span = self.createElement('span');
                span.innerHTML =y;
                year.appendChild(span);

                year.addEventListener('click',function(e){self.changeYear(this)});
                return year;
            }
            for(let x = 1; x < 5; x ++){
                al.appendChild(yearRen( oyear - (5 - x),this.prefix,this.cssJoin));
            }
            al.appendChild(yearRen(oyear,this.prefix,this.cssJoin));
            for(let x = 1; x < 5; x ++){
                al.appendChild(yearRen( oyear + x,this.prefix,this.cssJoin));
            }
            this.target.appendChild(al);
        }

        self.renderMonthlyAlamanc = function(){
            self = this;
            let al = this.createElement('div',this.prefix+this.cssJoin+'monthly-almanac');
            al.classList.add('almanac');
            for(let x = 0; x < 12; x ++){
                let month = this.createElement('div',this.prefix+this.cssJoin+'month');
                let classes = self.splitClass(self.monthClass);
                if(classes.length> 0)
                    for(let c of classes)
                    {
                        month.classList.add(c);
                    }
                let span = self.createElement('span');
                span.innerHTML = self.shortMonth?self.Month[x]:self.fullMonth[x];
                month.appendChild(span);

                month.setAttribute('month',x+1);
                month.addEventListener('click',function(e){
                    self.changeMonth(this);
                },true)
                al.appendChild(month);
            }
            this.target.appendChild(al);
        }

        self.renderHeaders = function(){
            let hd = this.createElement('div',this.prefix+this.cssJoin+'headings');
            let wd = this.createElement('div',this.prefix+this.cssJoin+'week-days');
            for(let x = 0; x < 7; x++){
                let days = this.createElement('h4',this.prefix+this.cssJoin+'day-heading');
                days.innerHTML = this.dayOftheWeek[x].substr(0,1);
                wd.appendChild(days);
            }
            hd.appendChild(wd);
            this.target.appendChild(hd);
        }

        self.renderOptions = function(){
            self = this;
            let op = this.createElement('div',this.prefix+this.cssJoin+'options');
            let sw = this.createElement('h3',this.prefix+this.cssJoin+'switch');
            let mt = this.createElement('span',this.prefix+this.cssJoin+'switch-month');
            mt.innerHTML = self.fullMonth[this.date.getMonth()];
            mt.addEventListener('click',function(){
                self.switchMonth(this);
            })
            let yr = this.createElement('span',this.prefix+this.cssJoin+'switch-year');
            yr.addEventListener('click',function(){self.switchYear(this)},false)
            yr.innerHTML = this.date.getFullYear();



            let fw = this.createElement('div',this.prefix+this.cssJoin+'forward');
            let ar = this.createElement('i','material-icons');
            let bw = this.createElement('div',this.prefix+this.cssJoin+'backward');
            fw.classList.add(this.prefix+this.cssJoin+'toggles');
            bw.classList.add(this.prefix+this.cssJoin+'toggles');
            let al = this.createElement('i','material-icons');

            fw.addEventListener('click',function(){self.adjacentMonth(1)},false)
            bw.addEventListener('click',function(){self.adjacentMonth(-1)},false)

            ar.innerHTML = 'keyboard_arrow_right';
            fw.addEventListener('click',self.changeMonth(),true);

            al.innerHTML = 'keyboard_arrow_left';


            sw.appendChild(mt);
            sw.appendChild(yr);
            fw.appendChild(ar);
            bw.appendChild(al);
            op.appendChild(bw);
            op.appendChild(sw);
            op.appendChild(fw);

            this.target.appendChild(op);
        }

        self.createElement = function(element,cls){
            let el = document.createElement(element);
            if(cls !== undefined)
                el.classList.add(cls)
            return el;
        }

        self.switchYear = function(e){
            if(e !== undefined){
                e.parentUntil('.calendar').classList.toggle('calendar-view-year');
                e.parentUntil('.calendar').classList.remove('calendar-view-month');
            }
        }

        self.switchMonth = function(e){
            if(e !== undefined){
                e.parentUntil('.calendar').classList.toggle('calendar-view-month');
                e.parentUntil('.calendar').classList.remove('calendar-view-year');
            }
        }

        self.render = function(date){
            self.almanac(date);
            self.renderOptions();
            self.renderHeaders();
            self.renderAlamanc();
            self.renderMonthlyAlamanc();
            self.renderYearlyAlamanc();
        }

        self.adjacentMonth = function(e){
            let dt =  this.date.getDate(), mt =  this.date.getMonth(), yt = this.date.getFullYear();
            let nt = mt + e +1;
            let ny = yt;
            if(nt < 1){
                ny = yt -1;
                nt = 12;
            }
            if(nt > 12){
                ny = yt + 1;
                nt = 1;
            }
            let date  = new Date(nt+self.dateJoin+dt+self.dateJoin+ny);
            this.date = date;
            this.refresh(this.date);
        }

        self.selectRange = function(e){
            if(e !== undefined){
                let nm = this.prefix+this.cssJoin+'selected'+this.cssJoin+(self.sf?'start':'end');
                let q = document.querySelector('.'+nm);
                if(q !== null){
                    q.classList.remove(nm);
                }
                let cal = e.parentUntil('.calendar');
                let y = e.getAttribute('year');
                let m = e.getAttribute('month');

                if(self.fs){
                    e.classList.add(this.prefix+this.cssJoin+'alone');
                    self.fs = false;
                }
                else
                {
                    let al = document.querySelector('.'+this.prefix+this.cssJoin+'alone');
                    if(al !== null){
                        al.classList.remove(this.prefix+this.cssJoin+'alone');
                    }
                }


                if(self.sf){
                    cal.setAttribute('range-start',m+self.dateJoin+e.innerText+self.dateJoin+y);
                    this.range_start = new Date(m+self.dateJoin+e.innerText+self.dateJoin+y);
                    e.classList.add(nm);
                }
                else{
                    cal.setAttribute('range-end',m+self.dateJoin+e.innerText+self.dateJoin+y);
                    this.range_end = new Date(m+self.dateJoin+e.innerText+self.dateJoin+y);
                    e.classList.add(nm);
                    console.log('range');
                    self.closePopup(self.target);
                }
                self.setBetween();

                let val = self.input.value;
                if(val.indexOf(self.rangeSeperator)){
                    val = val.split(self.rangeSeperator);
                    val[(self.sf?0:1)] = m+self.dateJoin+e.innerText+self.dateJoin+y;
                }
                else{
                    val = [];
                    val[(self.sf?0:1)] = m+self.dateJoin+e.innerText+self.dateJoin+y;
                }
                self.sf = !self.sf;

                val = val.join(self.rangeSeperator);
                self.input.value = val;

            }
        }

        self.selectDate = function(e){
            if(!self.multiple){let q = document.querySelector('.'+this.prefix+this.cssJoin+'selected');
                if(q !== null)
                    q.classList.remove(this.prefix+this.cssJoin+'selected');
            }
            if(e !== undefined){
                let cal = e.parentUntil('.calendar');
                let y = e.getAttribute('year');
                let m = e.getAttribute('month');
                if(self.multiple){
                    if(e.classList.contains(this.prefix+this.cssJoin+'selected')){
                        let i = self.selected.indexOf(new Date(m+self.dateJoin+e.innerText+self.dateJoin+y));
                        if (i > -1) {
                            self.selected.splice(i, 1);
                        }
                        let select = [];
                        for(let sel of self.selected){
                            let str = sel.getDate()+self.dateJoin+(sel.getMonth()+1)+self.dateJoin+sel.getFullYear();
                            let dat = (e.innerText)+self.dateJoin+e.getAttribute('month')+self.dateJoin+e.getAttribute('year');
                            if(str != dat)
                                select.push(str);
                        }

                        let selected = select.join(self.dateSeperator);
                        cal.setAttribute('selected',selected);
                        e.classList.remove(this.prefix+this.cssJoin+'selected');
                        if(self.isset(self.input))
                            self.input.value = selected;
                    }
                    else
                    {

                        self.selected.push(new Date(m+self.dateJoin+e.innerText+self.dateJoin+y));
                        let select = [];
                        for(let sel of self.selected){
                            select.push(sel.getDate()+self.dateJoin+(sel.getMonth()+1)+self.dateJoin+sel.getFullYear());
                        }

                        let selected = select.join(self.dateSeperator);
                        e.classList.add(this.prefix+this.cssJoin+'selected');
                        if(self.isset(self.input))
                            self.input.value = selected;
                    }
                }
                else{
                    cal.setAttribute('selected',m+self.dateJoin+e.innerText+self.dateJoin+y);
                    self.selected = new Date(m+self.dateJoin+e.innerText+self.dateJoin+y);

                    if(self.isset(self.input)){
                        self.input.value = e.innerText+self.dateJoin+m+self.dateJoin+y;
                        self.input.setAttribute('selected',m+self.dateJoin+e.innerText+self.dateJoin+y);
                    }

                    e.classList.add(this.prefix+this.cssJoin+'selected');
                    self.target.remove();

                    window.removeEventListener('click',function(){
                        self.closePopup(self.target);
                    },true);
                }
            }
        };

        self.renderDate = function(d,m,y){
            let date = new Date(y,m,d);
            let target = self.dateFormat;
            target = target.replace('d',d);
            let day = self.shortdayOftheWeek[date.getDay()];
            target = target.replace('D',day);
            day = self.dayOftheWeek[date.getDay()];
            target = target.replace('Dd',day);
            target = target.replace('m',m);
            target = target.replace('MM',self.fullMonth[m]);
            target = target.replace('M',self.Month[m]);
            target = target.replace('y',self.Month[m]);
        };

        self.changeYear = function(e){
            let q = document.querySelector('.'+this.prefix+this.cssJoin+'year'+this.cssJoin+'selected');
            if(q !== null)
                q.classList.remove('.'+this.prefix+this.cssJoin+'year'+this.cssJoin+'selected');
            if(e !== undefined){
                let cal = e.parentUntil('.calendar');
                let m = this.date.getMonth();
                let d = this.date.getDate();
                cal.setAttribute('view',m+self.dateJoin+d+self.dateJoin+e.innerText);
                this.date = new Date(m+self.dateJoin+d+self.dateJoin+e.innerText);
                e.classList.add('.'+this.prefix+this.cssJoin+'year'+this.cssJoin+'selected');
                this.switchMonth(e);
                this.refresh(this.date);
            }
        }

        self.changeMonth = function(e){
            let q = document.querySelector('.'+this.prefix+this.cssJoin+'month'+this.cssJoin+'selected');
            if(q !== null)
                q.classList.remove('.'+this.prefix+this.cssJoin+'month'+this.cssJoin+'selected');
            if(e !== undefined){
                let cal = e.parentUntil('.calendar');
                let y = this.date.getFullYear();
                let d = this.date.getDate();
                let m = e.getAttribute('month');
                cal.setAttribute('view',m+self.dateJoin+d+self.dateJoin+y);
                this.date = new Date(m+self.dateJoin+d+self.dateJoin+y);
                e.classList.add('.'+this.prefix+this.cssJoin+'month'+this.cssJoin+'selected');
                this.switchMonth(e);
                this.refresh(this.date);

            }
        }

        self.setBetween = function(){
            if(self.isset(self.range_end)){
                let days = self.target.querySelectorAll('.calendar-day');
                    let low = self.range_start.getTime();
                let high = self.range_end.getTime();
                if(low > high){
                    let s = low;
                    low = high;
                    high = s;
                }


                for(let d of days){
                    d.classList.remove('calendar-selected-between');
                    let dt = parseInt(d.innerText);
                    let m = parseInt(d.getAttribute('month'));
                    let y = parseInt(d.getAttribute('year'));
                    let dm = new Date(m+self.dateJoin+dt+self.dateJoin+y);
                    if((low < dm.getTime()) && (high > dm.getTime()))
                        d.classList.add('calendar-selected-between');
                }
            }
        }

        self.setPopup = function(){
            self.input = self.target;

            self.input.addEventListener('focus',(e)=>{

                self.renderPopup();
                let bounding = self.input.getBoundingClientRect();
                self.target.style.left = `${bounding.left}px`;
                self.target.style.top = `${bounding.top}px`;
            });

            self.input.addEventListener('click',(e)=>{
                e.stopPropagation();
                self.renderPopup();
                let bounding = self.input.getBoundingClientRect();
                self.target.style.left = `${bounding.left}px`;
                self.target.style.top = `${bounding.top}px`;
            });

            self.input.addEventListener('keydown',(e)=>{
                let current =  self.target.querySelector('.hover') || document.querySelector('.calendar-selected span') || document.querySelector(`.calendar-day:not(.${this.prefix+this.cssJoin}fade)`|| document.querySelector(`.calendar-today)`));
                current.classList.remove('hover');

                if(e.which === 13 || e.which === 9){
                    let hold = current.parentNode;
                    if(self.range)self.selectRange(current);
                    else self.selectDate(hold);
                    console.log(e.which);
                    self.closePopup(self.target);
                }
                else
                {
                    current.classList.remove('hover');
                    let add = 0;
                    switch(e.which){
                        case 37: add = -1;
                            break;
                        case 38: add = -7;
                            break;
                        case 39: add = 1;
                            break;
                        case 40: add = 7;
                            break;
                    }
                    let atts = current.parentNode.attributes;
                    let currentDate = new Date(atts.month.value+self.dateJoin+ atts.day.value+self.dateJoin+atts.year.value);
                    currentDate.setDate(currentDate.getDate()+add);
                    let month = currentDate.getMonth() + 1;
                    let day = currentDate.getDate();
                    if(month !== parseInt(atts.month.value)){
                        this.date = new Date(currentDate);
                        this.refresh(this.date);
                    }
                    let ds = self.target.querySelector(`.calendar-day[month="${month}"][day="${day}"] span`);
                    ds.classList.add('hover');
                }
            });


        };

        self.renderPopup = function(e){
            let o = document.getElementsByClassName(self.prefix+self.cssJoin+'popup');
            if(o.length > 0){
                for(let i of o){
                    i.remove();
                }

            }
            let pop = self.createElement('div',self.prefix+self.cssJoin+'popup');
            pop.classList.add('calendar');
            self.target = pop;
            let date = null;
            if(self.isset(self.input) && self.input.value !== ''){
                let exp = self.input.value.split(self.dateJoin);
                self.input.setAttribute('view',self.input.value);
                date = new Date(exp[2],(parseInt(exp[1]) - 1),exp[0]);
                if(self.range)
                    date = self.range_start;
                self.date = date;
            }
            else {
                date = new Date();
            }
            self.render(date);

            document.documentElement.appendChild(pop);
            pop.addEventListener('click',e => {
                e.stopPropagation();
            }   );

            window.addEventListener('click',function(e){

                self.closePopup(self.target);
            });


        }

        self.closePopup = function(e){
            let tar = event.target;
            if(tar.closest('.calendar-popup') === null && tar !== self.input && tar.tagName !== 'HTML'){
                self.target.remove();
                window.removeEventListener('click',function(){
                    self.closePopup(self.target);
                },true);
            }
        }

        //INIT CODE
        {
            if(self.target !== null){
                if(self.target.hasAttribute('view')){
                    self.dateString = self.target.getAttribute('view');
                    self.date = new Date(self.dateString);
                }
                else
                {
                    let dateString = (self.date.getMonth()+1)+self.dateJoin+self.date.getDate()+self.dateJoin+self.date.getFullYear();
                    self.target.setAttribute('view',dateString);
                }

                if(!self.range){
                    if(self.target.hasAttribute('selected')){
                        let selectedString = self.target.getAttribute('selected');
                        self.selected = new Date(selectedString);
                    }
                    else
                    {
                        if(self.multiple){
                            let selected = '';
                            for(let s of self.selected){
                                let dateString = (s.getMonth()+1)+self.dateJoin+s.getDate()+self.dateJoin+s.getFullYear();
                                selected = selected + self.dateSeperator+dateString;
                            }

                            self.target.setAttribute('selected',selected);

                        }
                        else{
                            let dateString = (self.selected.getMonth()+1)+self.dateJoin+self.selected.getDate()+self.dateJoin+self.selected.getFullYear();
                            self.target.setAttribute('selected',dateString);
                        }
                    }
                }
                if(self.target.tagName.toLowerCase() === 'div'){
                    self.render(self.date);
                }
                else
                if(self.target.tagName.toLowerCase() === 'input'){
                    self.setPopup();
                }
                if(!self.target.classList.contains('calendar'))
                    self.target.classList.add('calendar')
            }
        }
    }
}



if(typeof HTMLElement.prototype.parentUntil !== "function"){
    HTMLElement.prototype.parentUntil = function(parent) {
        let target = this.parentNode;
        if (parent.startsWith("#")) {
            parent = parent.replace("#", "");
            while (target.id.toLowerCase() !== parent.toLowerCase()) {
                target = target.parentNode;
                if (target.tagName === "HTML")
                    break;
            }
        } else if (parent.startsWith(".")) {
            parent = parent.replace(".", "");
            while (!target.classList.contains(parent)) {
                target = target.parentNode;
                if (target.tagName === "HTML")
                    break;
            }
        } else {
            while (target.tagName.toLowerCase() !== parent.toLowerCase()) {
                target = target.parentNode;
                if (target.tagName === "HTML")
                    break;
            }
        }
        return target;
    }
}


if(typeof HTMLElement.prototype.appendChildren !== "function"){
    HTMLElement.prototype.appendChildren = function(children = []) {
        for(let child of children){
            this.appendChild(child);
        }
    }
}

const cals = document.querySelectorAll('.bi-calendar ');
for(let cal of cals){
    let cl = new calendar({target: cal});
}
