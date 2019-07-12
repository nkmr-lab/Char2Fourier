var spline;
var W = 600;
var k_MAX = 50;

var app_input = function(p){
    var fourier;

    this.p_list = [];
    this.p_list2 = [];

    p.setup = function(){
        p.createCanvas(W, W);
        p.noFill();
        p.textSize(40);
        p.textAlign(p.CENTER, p.CENTER);

        spline = new Spline();
        fourier = new Fourier();
    }

    p.draw = function(){
        p.background(255, 255, 255);

        if( p_list.length == 0 && p_list2.length == 0 ){
            p.fill(153);
            p.noStroke();
            p.text("Draw here!!", p.width/4, p.height/4);
        }

        p.noStroke();
        p.fill(205, 222, 255);
        p.rect(W/2, W/2, W/2, W/2);
        p.fill(255, 204, 255);
        p.rect(0, W/2, W/2, W/2);
        p.fill(204, 255, 255);
        p.rect(W/2, 0, W/2, W/2);
        p.stroke(0);
        p.strokeWeight(1);
        p.line(W/2, 0, W/2, W/2);
        p.line(0, W/2, W/2, W/2);

        if( p.mouseIsPressed ){
            for( var pi = 0; pi < p_list.length; pi ++ ){
                p.point( p_list[pi].x, p_list[pi].y );
            }
        }
        
        p.strokeWeight(2.5);
        for( var pi = 0 ; pi < p_list2.length/2 ; pi ++ ){
            var p2 = this.p_list2[pi];
            p.point( p2.x, p2.y );
        }
        
        p.stroke(0);
        p.strokeWeight(1);
        if( p_list2.length > 0 ){
            var t = 2 * Math.PI * (p.frameCount % p_list2.length)/p_list2.length - Math.PI;

            p.noFill();
            p.push();
            p.translate(fourier.m_aX[0]/2, p.height * 3/4 );
            p.nextCircleX( 1, k_MAX, t);
            p.pop();
            p.push();
            p.translate(p.width * 3/4, fourier.m_aY[0]/2);
            p.nextCircleY( 1, k_MAX, t);
            p.pop();
        }   

    }

    p.nextCircleX = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
        var r_aX = fourier.m_aX[_k];
        var r_bX = fourier.m_bX[_k];

        p.strokeWeight(1);
        p.stroke(0);
        p.ellipse( 0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2 );
        p.stroke(255, 128, 128);
        p.line(0, 0, r_aX * p.cos(_k*_t), r_aX * p.sin(_k*_t));            // X譁ｹ蜷代�邱�: a(k) * cos(kt)
        p.push();
            p.translate( r_aX * p.cos(_k*_t), r_aX * p.sin(_k*_t) );       // X譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
            p.ellipse( 0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2 );
            p.line(0, 0, r_bX * p.sin(_k*_t), r_bX * p.cos(_k*_t));        // X譁ｹ蜷代�邱�: b(k) * sin(kt)
            p.push();
                p.translate( r_bX * p.sin(_k*_t), r_bX * p.cos(_k*_t) );   // X譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
                if( _k <= _k_MAX ){
                    p.nextCircleX( _k+1, _k_MAX, _t );
                }else{
                    p.line( 0, -W, 0, W );
                    p.strokeWeight(7);
                    p.stroke(255, 0, 0);
                    p.point(0, 0);
                }
            p.pop();
        p.pop();
    }

    p.nextCircleY = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
        var r_aY = fourier.m_aY[_k];
        var r_bY = fourier.m_bY[_k];

        p.strokeWeight(1);
        p.stroke(0);
        p.ellipse( 0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2 );
        p.stroke(128, 128, 255);
        p.line(0, 0, r_aY * p.sin(_k*_t), r_aY * p.cos(_k*_t));           // Y譁ｹ蜷代�邱�: a(k) * cos(kt)
        p.push();
            p.translate( r_aY * p.sin(_k*_t), r_aY * p.cos(_k*_t) );       // Y譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
            p.ellipse( 0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2 );
            p.line(0, 0, r_bY * p.cos(_k*_t), r_bY * p.sin(_k*_t));        // Y譁ｹ蜷代�邱�: b(k) * sin(kt)
            p.push();
               p. translate( r_bY * p.cos(_k*_t), r_bY * p.sin(_k*_t) );   // Y譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
                if( _k <= _k_MAX ){
                    this.nextCircleY( _k+1, _k_MAX, _t );
                }else{
                    p.line(-W, 0, W, 0);
                    p.strokeWeight(7);
                    p.stroke(0, 0, 255);
                    p.point(0, 0);
                }
            p.pop();
        p.pop();
    }

    p.mousePressed = function(){
        if( !(p.mouseX >= 0 && p.mouseX < W && p.mouseY >= 0 && p.mouseY < W) ){
            return;
        }

        p_list = [];
    }

    p.mouseDragged = function(){
        if( !(p.mouseX >= 0 && p.mouseX < W && p.mouseY >= 0 && p.mouseY < W) ){
            return;
        }

        if( p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY) >= 2 ){
            p_list.push( new Point(p.mouseX, p.mouseY) );
        }
    }

    p.mouseReleased = function(){
        if( !(p.mouseX >= 0 && p.mouseX < W && p.mouseY >= 0 && p.mouseY < W) ){
            return;
        }

        console.log("ストロークの入力が行われました");
        console.log(p_list);

        p_list2 = spline.getSpline( this, p_list, 100 );
        fourier.expandFourierSeries( p_list2, k_MAX );

        console.log("スプライン補間を行いました");
        console.log(p_list2);

        var formula_x = "";
        var formula_y = "";
        for ( var i = 0 ; i < 10 ; i++ ){
            k_cos_x = fourier.m_aX[i];
            k_sin_x = fourier.m_bX[i];
            k_cos_y = fourier.m_aY[i];
            k_sin_y = fourier.m_bY[i];

            //console.log( i + ":" +this.m_aX[i] + ", " + this.m_bX[i] + ", " + this.m_aY[i] + ", " + this.m_bX[i] );
            formula_x += p.getFormula(Math.round(k_cos_x*100)/100) +"*cos"+i+"t";
            formula_x += p.getFormula(Math.round(k_sin_x*100)/100) +"*sin"+i+"t";
            formula_y += p.getFormula(Math.round(k_cos_y*100)/100) +"*cos"+i+"t";
            formula_y += p.getFormula(Math.round(k_sin_y*100)/100) +"*sin"+i+"t";
        }

        formula_x = formula_x.slice(2);
        formula_y = formula_y.slice(2);

        $("#formulaX1").text(formula_x);
        $("#formulaY1").text(formula_y);

        p_list2 = fourier.restorePoints(this);
    }

    /**
     * get coefficiet as String
     * @param  _coefficient 
     * @return {String}
     */
    p.getFormula = function( _coefficient ){
        if( _coefficient >= 0 ){
            return " + " + _coefficient;
        }
        return " - " + Math.abs(_coefficient);
    }

}

var canvas_input  = new p5(  app_input, "canvas_input" );

function Point( x, y ){
    this.x = x;
    this.y = y;
}