function FourierViewer(){
    Fourier.apply(this, arguments);
    this.p_list = [];
    this.p_list2 = [];
}

FourierViewer.prototype = new Fourier();

FourierViewer.prototype.restorePoints = function(){
    this.p_list2 = [];
    for( var pi = 0 ; pi < this.p_list.length ; pi ++ ){
        var p_restored = new Point(0, 0);
        var t = 2 * Math.PI * pi/this.p_list.length - Math.PI;

        p_restored.x += this.m_aX[0]/2;
        //p_restored.x += this.m_bX[0]/2 * sin(0*t);
        p_restored.y += this.m_aY[0]/2;
        //p_restored.y += this.m_bY[0]/2 * sin(0*t);
        for( var k = 1 ; k <= k_MAX ; k ++ ){
            p_restored.x += this.m_aX[k] * cos(k*t);
            p_restored.x += this.m_bX[k] * sin(k*t);
            p_restored.y += this.m_aY[k] * cos(k*t);
            p_restored.y += this.m_bY[k] * sin(k*t);
        }
        this.p_list2.push(p_restored);
    }
    //console.log("p_list: " + this.p_list.length + ", p_list2: " + this.p_list2.length);
}

FourierViewer.prototype.draw = function(){
    strokeWeight(2.5);

    if( mouseIsPressed ){
        for( var pi = 0 ; pi < this.p_list.length ; pi ++ ){
            var p = this.p_list[pi];
            point( p.x, p.y );
        }
    }
    
    for( var pi = 0 ; pi < this.p_list2.length/2 ; pi ++ ){
        var p2 = this.p_list2[pi];
        point( p2.x, p2.y );
    }
    
    stroke(0);
    strokeWeight(1);
    if( this.p_list2.length > 0 ){
        var t = 2 * Math.PI * (frameCount % this.p_list2.length)/this.p_list2.length - Math.PI;

        noFill();
        push();
        translate( this.m_aX[0]/2, height * 3/4 );
        this.nextCircleX( 1, k_MAX, t);
        pop();
        push();
        translate(width * 3/4, this.m_aY[0]/2);
        this.nextCircleY( 1, k_MAX, t);
        pop();
    }   
}

FourierViewer.prototype.nextCircleX = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
    var r_aX = this.m_aX[_k];
    var r_bX = this.m_bX[_k];

    strokeWeight(1);
    stroke(0);
    ellipse( 0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2 );
    stroke(255, 128, 128);
    line(0, 0, r_aX * cos(_k*_t), r_aX * sin(_k*_t));            // X譁ｹ蜷代�邱�: a(k) * cos(kt)
    push();
        translate( r_aX * cos(_k*_t), r_aX * sin(_k*_t) );       // X譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
        ellipse( 0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2 );
        line(0, 0, r_bX * sin(_k*_t), r_bX * cos(_k*_t));        // X譁ｹ蜷代�邱�: b(k) * sin(kt)
        push();
            translate( r_bX * sin(_k*_t), r_bX * cos(_k*_t) );   // X譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
            if( _k <= _k_MAX ){
                this.nextCircleX( _k+1, _k_MAX, _t );
            }else{
                line( 0, -W, 0, W );
                strokeWeight(7);
                stroke(255, 0, 0);
                point(0, 0);
            }
        pop();
    pop();
}

FourierViewer.prototype.nextCircleY = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
    var r_aY = this.m_aY[_k];
    var r_bY = this.m_bY[_k];

    strokeWeight(1);
    stroke(0);
    ellipse( 0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2 );
    stroke(128, 128, 255);
    line(0, 0, r_aY * sin(_k*_t), r_aY * cos(_k*_t));           // Y譁ｹ蜷代�邱�: a(k) * cos(kt)
    push();
        translate( r_aY * sin(_k*_t), r_aY * cos(_k*_t) );       // Y譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
        ellipse( 0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2 );
        line(0, 0, r_bY * cos(_k*_t), r_bY * sin(_k*_t));        // Y譁ｹ蜷代�邱�: b(k) * sin(kt)
        push();
            translate( r_bY * cos(_k*_t), r_bY * sin(_k*_t) );   // Y譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
            if( _k <= _k_MAX ){
                this.nextCircleY( _k+1, _k_MAX, _t );
            }else{
                line(-W, 0, W, 0);
                strokeWeight(7);
                stroke(0, 0, 255);
                point(0, 0);
            }
        pop();
    pop();
}

FourierViewer.prototype.beginSketch = function(){
    if( !(mouseX >= 0 && mouseX < W && mouseY >= 0 && mouseY < W) ){
        return;
    }

    this.p_list = [];
}

FourierViewer.prototype.dragSketch = function(){
    if( !(mouseX >= 0 && mouseX < W && mouseY >= 0 && mouseY < W) ){
        return;
    }

    if( dist(mouseX, mouseY, pmouseX, pmouseY) >= 2 ){
        this.p_list.push( new Point(mouseX, mouseY) );
    }
}

FourierViewer.prototype.endSketch = function(){
    if( !(mouseX >= 0 && mouseX < W && mouseY >= 0 && mouseY < W) ){
        return;
    }

    this.p_list = spline.getSpline( this.p_list, 100 );
    this.expandFourierSeries( this.p_list, k_MAX );

    var formula_x = "";
    var formula_y = "";
    for ( var i = 0 ; i < 10 ; i++ ){
        k_cos_x = this.m_aX[i];
        k_sin_x = this.m_bX[i];
        k_cos_y = this.m_aY[i];
        k_sin_y = this.m_bY[i];

        //console.log( i + ":" +this.m_aX[i] + ", " + this.m_bX[i] + ", " + this.m_aY[i] + ", " + this.m_bX[i] );
        formula_x += this.getFormula(Math.round(k_cos_x*100)/100) +"cos("+i+"t)";
        formula_x += this.getFormula(Math.round(k_sin_x*100)/100) +"sin("+i+"t)";
        formula_y += this.getFormula(Math.round(k_cos_y*100)/100) +"cos("+i+"t)";
        formula_y += this.getFormula(Math.round(k_sin_y*100)/100) +"sin("+i+"t)";
    }

    formula_x = formula_x.slice(2);
    formula_y = formula_y.slice(2);

    $("#formula_x").text(formula_x);
    $("#formula_y").text(formula_y);

    this.p_list2 = [];
    this.restorePoints();
}

FourierViewer.prototype.getFormula = function( _coefficient ){
    if( _coefficient >= 0 ){
        return " + " + _coefficient;
    }
    return " - " + Math.abs(_coefficient);
}