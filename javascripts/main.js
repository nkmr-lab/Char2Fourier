var W = 400;
var k_MAX = 50;

var spline;
var fourier1, fourier2, fourier3;

// p_listSplineX is a list of points
// made using Spline interpolation OR MADE FROM FOURIER SERIES
p_list  = [], p_listSpline  = [];
p_list2 = [], p_listSpline2 = [];
p_listSpline3 = [];

function setup(){
    createCanvas(W*3, W);
    noFill();
    textSize(20);
    textAlign(CENTER, CENTER);

    spline = new Spline();
    fourier1 = new Fourier(0);
    fourier2 = new Fourier(0);
    fourier3 = new Fourier(0);

    pg = createGraphics(W, W);
}

function draw(){
    background(255, 255, 255);

    if( p_list.length == 0 && p_list2.length == 0 ){
        fill(153);
        noStroke();
        text("Draw here!!", width/4, height/4);
    }

    noStroke();
    fill(205, 222, 255);
    rect(W/2, W/2, W/2, W/2);
    fill(255, 204, 255);
    rect(0, W/2, W/2, W/2);
    fill(204, 255, 255);
    rect(W/2, 0, W/2, W/2);
    stroke(0);
    strokeWeight(1);
    line(W/2, 0, W/2, W/2);
    line(0, W/2, W/2, W/2);

    noStroke();
    fill(228);
    rect(W, 0, W, W);
    fill(204);
    rect(W*2, 0, W, W);

    // if( mouseIsPressed ){
    //     for( var pi = 0; pi < p_list.length; pi ++ ){
    //         point( p_list[pi].x, p_list[pi].y );
    //     }
    // }
    
    // draw strokes
    stroke(0);
    strokeWeight(1);
    for( var pi = 0 ; pi < p_list.length ; pi ++ ){
        var p = p_list[pi];
        point( p.x, p.y );
    }
    for( var pi = 0 ; pi < p_list2.length ; pi ++ ){
        var p = p_list2[pi];
        point( p.x, p.y );
    }

    // draw strokes with Spline interpolation
    strokeWeight(2.5);
    for( var pi = 0 ; pi < p_listSpline.length; pi ++ ){
        var p = p_listSpline[pi];
        point( p.x, p.y );
    }    
    for( var pi = 0 ; pi < p_listSpline2.length; pi ++ ){
        var p = p_listSpline2[pi];
        point( p.x, p.y );
    }
    for( var pi = 0 ; pi < p_listSpline3.length; pi ++ ){
        var p = p_listSpline3[pi];
        point( p.x, p.y );
    }

    if( p_listSpline.length > 0 ){
        drawFourierViewer(p_listSpline, fourier1, 0);
    }
    if( p_listSpline2.length > 0 ){
        drawFourierViewer(p_listSpline2, fourier2, W);
    }
}

function drawFourierViewer(_list, _fourier, _offsetX){
    stroke(0);
    strokeWeight(1);
    var t = 2 * Math.PI * (frameCount % _list.length)/_list.length - Math.PI;
    noFill();

    push();
    translate(0, 0);
    push();
    translate(_fourier.m_aX[0]/2, height * 3/4 );
    nextCircleX( _fourier, 1, k_MAX, t);
    pop();
    pop();

    push();
    translate(_offsetX, 0);
    push();
    translate(width/4, _fourier.m_aY[0]/2);
    nextCircleY( _fourier, 1, k_MAX, t);
    pop();
    pop();
}

function nextCircleX( _fourier, _k , _k_MAX, _t){
    var r_aX = _fourier.m_aX[_k];
    var r_bX = _fourier.m_bX[_k];

    strokeWeight(1);
    stroke(0);
    ellipse( 0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2 );
    stroke(255, 128, 128);
    line(0, 0, r_aX * cos(_k*_t), r_aX * sin(_k*_t));            // 前の円の中心〜この円の中心を結ぶ線: a(k) * cos(kt)
    push();
        translate( r_aX * cos(_k*_t), r_aX * sin(_k*_t) );       // この円の中心に移動: a(k) * cos(kt)
        ellipse( 0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2 );
        line(0, 0, r_bX * sin(_k*_t), r_bX * cos(_k*_t));        // 前の円の中心〜この円の中心: b(k) * sin(kt)
        push();
            translate( r_bX * sin(_k*_t), r_bX * cos(_k*_t) );   // この円の中心に移動: b(k) * sin(kt)
            if( _k <= _k_MAX ){
                nextCircleX( _fourier, _k+1, _k_MAX, _t );
            }else{
                line( 0, -W, 0, W );
                strokeWeight(7);
                stroke(255, 0, 0);
                point(0, 0);
            }
        pop();
    pop();
}

function nextCircleY(_fourier, _k, _k_MAX, _t){
    var r_aY = _fourier.m_aY[_k];
    var r_bY = _fourier.m_bY[_k];

    strokeWeight(1);
    stroke(0);
    ellipse( 0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2 );
    stroke(128, 128, 255);
    line(0, 0, r_aY * sin(_k*_t), r_aY * cos(_k*_t));           // 前の円の中心〜この円の中心を結ぶ線: a(k) * cos(kt)
    push();
        translate( r_aY * sin(_k*_t), r_aY * cos(_k*_t) );       // この円の中心に移動: a(k) * cos(kt)
        ellipse( 0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2 );
        line(0, 0, r_bY * cos(_k*_t), r_bY * sin(_k*_t));        // 前の円の中心〜この円の中心を結ぶ線: b(k) * sin(kt)
        push();
            translate( r_bY * cos(_k*_t), r_bY * sin(_k*_t) );   // この円の中心に移動: b(k) * sin(kt)
            if( _k <= _k_MAX ){
                this.nextCircleY( _fourier, _k+1, _k_MAX, _t );
            }else{
                line(-W, 0, W, 0);
                strokeWeight(7);
                stroke(0, 0, 255);
                point(0, 0);
            }
        pop();
    pop();
}

function mousePressed(){
    if((mouseX >= 0 && mouseX < W/2 && mouseY >= 0 && mouseY < W/2) ){
        console.log("キャンバス1: 入力開始");
        isWritingOn = 1;
        p_list = [];
    }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){
        console.log("キャンバス2: 入力開始");
        isWritingOn = 2;
        p_list2 = [];
    }

}

function mouseDragged(){
    if( dist(mouseX, mouseY, pmouseX, pmouseY) >= 2 ){

        if((mouseX >= 0 && mouseX < W/2 && mouseY >= 0 && mouseY < W/2)){
            p_list.push( new Point(mouseX, mouseY) );
        }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){
            p_list2.push( new Point(mouseX, mouseY) );
        }

    }
}

function mouseReleased(){
    if((mouseX >= 0 && mouseX < W/2 && mouseY >= 0 && mouseY < W/2)){

        p_list.push( new Point(mouseX, mouseY) );
        p_listSpline = spline.getSpline( p_list, 100 );
        p_list = [];

        fourier1.expandFourierSeries( p_listSpline, k_MAX );

    }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){

        p_list2.push( new Point(mouseX, mouseY) );
        p_listSpline2 = spline.getSpline( p_list2, 100 );
        p_list2 = [];

        fourier2.expandFourierSeries( p_listSpline2, k_MAX );
    }

    if(p_listSpline.length > 0 && p_listSpline2.length > 0){
        var ratio = 0.5;
        console.log("length of p_listSpline: " + p_listSpline.length);
        console.log("length of p_listSpline2: " + p_listSpline2.length);
        // console.log(1-ratio);
        // console.log(p_listSpline.length * (1-ratio));

        var lengthOfPointsW = parseInt(p_listSpline.length * (1-ratio) + p_listSpline2.length * ratio);
        fourier3 = new Fourier(lengthOfPointsW);
        console.log("fourier3.lengthOfPoints = " + fourier3.lengthOfPoints);

        for(let k = 0; k < fourier1.m_aX.length; k ++){
            let w_aX = fourier1.m_aX[k] * (1-ratio) + fourier2.m_aX[k] * ratio;
            let w_aY = fourier1.m_aY[k] * (1-ratio) + fourier2.m_aY[k] * ratio;
            let w_bX = fourier1.m_bX[k] * (1-ratio) + fourier2.m_bX[k] * ratio;
            let w_bY = fourier1.m_bY[k] * (1-ratio) + fourier2.m_bY[k] * ratio;
            fourier3.m_aX[k] = w_aX;
            fourier3.m_aY[k] = w_aY;
            fourier3.m_bX[k] = w_bX;
            fourier3.m_bY[k] = w_bY;
        }

        p_listSpline3 = fourier3.restorePoints();
    }

    // var formula_x = "";
    // var formula_y = "";
    // for ( var i = 0 ; i < 10 ; i++ ){
    //     k_cos_x = fourier.m_aX[i];
    //     k_sin_x = fourier.m_bX[i];
    //     k_cos_y = fourier.m_aY[i];
    //     k_sin_y = fourier.m_bY[i];

    //     //console.log( i + ":" +this.m_aX[i] + ", " + this.m_bX[i] + ", " + this.m_aY[i] + ", " + this.m_bX[i] );
    //     formula_x += getFormula(Math.round(k_cos_x*100)/100) +"*cos"+i+"t";
    //     formula_x += getFormula(Math.round(k_sin_x*100)/100) +"*sin"+i+"t";
    //     formula_y += getFormula(Math.round(k_cos_y*100)/100) +"*cos"+i+"t";
    //     formula_y += getFormula(Math.round(k_sin_y*100)/100) +"*sin"+i+"t";
    // }

    // formula_x = formula_x.slice(2);
    // formula_y = formula_y.slice(2);

    // $("#formulaX1").text(formula_x);
    // $("#formulaY1").text(formula_y);

    // p_listSpline = fourier.restorePoints(this);
}

/**
 * get coefficiet as String
 * @param  _coefficient 
 * @return {String}
 */
// getFormula = function( _coefficient ){
//     if( _coefficient >= 0 ){
//         return " + " + _coefficient;
//     }
//     return " - " + Math.abs(_coefficient);
// }


function Point( x, y ){
    this.x = x;
    this.y = y;
}