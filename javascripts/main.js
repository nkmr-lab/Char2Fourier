var isShowingCoef = true;
let W = 400;

let k_MAX = 20;
var spline;
var fourier1, fourier2, fourier3;
// p_listSpline{1,2,3} is a list of points
// made using Spline interpolation OR MADE FROM FOURIER SERIES
p_list  = [], p_listSpline  = [];
p_list2 = [], p_listSpline2 = [];
p_listSpline3 = [];

function setup(){
    let canvas = createCanvas(W*3, W);
    canvas.parent("canvasInput");
    noFill();
    textSize(20);
    textAlign(CENTER, CENTER);

    spline = new Spline();
    fourier1 = new Fourier(0);
    fourier2 = new Fourier(0);
    fourier3 = new Fourier(0);
}

function draw(){
    colorMode(RGB, 255);
    background(255);

    noStroke();
    fill(205, 222, 255);
    rect(W/2, W/2, W/2, W/2);
    rect(W*3/2, W/2, W/2, W/2);
    rect(W*5/2, W/2, W/2, W/2);

    drawPanel("手書きストローク1", p_listSpline, 0, true);
    drawPanel("手書きストローク2", p_listSpline2, W, true);
    drawPanel("平均ストローク", p_listSpline3, W*2, false);
    
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
    push();
    translate(W * 3/2, 0);
    for( var pi = 0 ; pi < p_listSpline3.length; pi ++ ){
        var p = p_listSpline3[pi];
        point( p.x, p.y );
    }
    pop();

    if( p_listSpline.length > 0 ){
        showViewer(p_listSpline, fourier1, W*3/4, W*3/4, false);
    }
    if( p_listSpline2.length > 0 ){
        showViewer(p_listSpline2, fourier2, W*3/4, W*7/4, false);
    }
    if( p_listSpline3.length > 0 ){
        showViewer(p_listSpline3, fourier3, W*3/4, W*11/4, true);
    }
}

function drawPanel(_textStroke, _list, _marginX, _isShowingGuide){
    fill(153);
    textSize(15);
    textAlign(LEFT, TOP);
    text(_textStroke, _marginX, 0);
    if( _list.length == 0 && _isShowingGuide){
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text("Draw here!", W/4 + _marginX, W/4);
    }
    fill(255, 204, 255);
    rect(_marginX, W/2, W/2, W/2);
    fill(204, 255, 255);
    rect(_marginX + W/2, 0, W/2, W/2);
}

function showViewer(_list, _fourier, _offsetY_circleX, _offsetX_circleY, isWeighted){
    stroke(0);
    strokeWeight(1);
    var t = 2 * Math.PI * (frameCount % _list.length) / _list.length - Math.PI;
    noFill();

    push();
        var marginW = 0;
        if( isWeighted ) marginW = W * 3/2;

        var lineX = _fourier.m_aX[0]/2 + marginW;
        translate(lineX, _offsetY_circleX);
        lineXSeries = nextCircleX(_fourier, 1, k_MAX, t, lineX);
    pop();
    push();
        var lineY = _fourier.m_aY[0]/2;
        translate(_offsetX_circleY, lineY);
        lineYSeries = nextCircleY(_fourier, 1, k_MAX, t, lineY);
    pop();

    var off = Math.floor(_offsetX_circleY / W);

    stroke(255, 0, 0);
    line(lineXSeries, 0, lineXSeries, W);
    stroke(0, 0, 255);
    line(off * W, lineYSeries, (off + 1) * W, lineYSeries);
}

function nextCircleX( _fourier, _k , _k_MAX, _t, _lineX){
    colorMode(HSB, 360, 100, 100);
    let threshold = 10;

    // there are no indices if _k > _k_MAX
    var r_aX = 0;
    var r_bX = 0;
    if( _k <= _k_MAX ){
        var r_aX = _fourier.m_aX[_k];
        var r_bX = _fourier.m_bX[_k];
    }

    var hue = (_k * 360 * 2 / _k_MAX) % 360;

    strokeWeight(1);
    stroke(hue, 100, 100);
    ellipse( 0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2 );
    line(0, 0, r_aX * cos(_k*_t), r_aX * sin(_k*_t));            // 前の円の中心〜この円の中心を結ぶ線: a(k) * cos(kt)
    push();
        var coefficientXCos = Math.round(r_aX * 100) / 100;
        if(dist(0, 0, r_aX * cos(_k*_t), r_aX * sin(_k*_t)) >= threshold && isShowingCoef){
            textCoef(coefficientXCos, 0, 0);
        }
        translate( r_aX * cos(_k*_t), r_aX * sin(_k*_t) );       // この円の中心に移動: a(k) * cos(kt)
        stroke(hue, 100, 100);
        ellipse( 0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2 );
        // stroke(160, 2, 40);
        line(0, 0, r_bX * sin(_k*_t), r_bX * cos(_k*_t));        // 前の円の中心〜この円の中心: b(k) * sin(kt)
        push();
            var coefficientXSin = Math.round(r_bX * 100) / 100;
            if(dist(0, 0, r_bX * sin(_k*_t), r_bX * cos(_k*_t)) >= threshold && isShowingCoef){
                textCoef(coefficientXSin, 0, 0);
            }
            translate( r_bX * sin(_k*_t), r_bX * cos(_k*_t) );   // この円の中心に移動: b(k) * sin(kt)
            var retLineX_tmp = _lineX + r_aX * cos(_k*_t) + r_bX * sin(_k*_t);
            var retLineX;
            if( _k <= _k_MAX ){
                retLineX = nextCircleX( _fourier, _k+1, _k_MAX, _t, retLineX_tmp);
            }else{
                colorMode(RGB, 255, 255, 255);
                strokeWeight(7);
                stroke(255, 0, 0);
                point(0, 0);
                retLineX = retLineX_tmp;
            }
        pop();
    pop();

    return retLineX;
}

function nextCircleY(_fourier, _k, _k_MAX, _t, _lineY){
    colorMode(HSB, 360, 100, 100);
    let threshold = 10;

    // there are no indices if _k > _k_MAX
    var r_aY = 0;
    var r_bY = 0;
    if( _k <= _k_MAX ){
        var r_aY = _fourier.m_aY[_k];
        var r_bY = _fourier.m_bY[_k];
    }

    var hue = (_k * 360 * 2 / _k_MAX) % 360;

    strokeWeight(1);
    stroke(hue, 100, 100);
    ellipse( 0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2 );
    // stroke(128, 128, 255);
    line(0, 0, r_aY * sin(_k*_t), r_aY * cos(_k*_t));           // 前の円の中心〜この円の中心を結ぶ線: a(k) * cos(kt)
    push();
        var coefficientYCos = Math.round(r_aY * 100) / 100;
        if(dist(0, 0, r_aY * sin(_k*_t), r_aY * cos(_k*_t)) >= threshold && isShowingCoef){
            textCoef(coefficientYCos, 0, 0);
        }
        translate( r_aY * sin(_k*_t), r_aY * cos(_k*_t) );       // この円の中心に移動: a(k) * cos(kt)
        stroke(hue, 100, 100);
        ellipse( 0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2 );
        line(0, 0, r_bY * cos(_k*_t), r_bY * sin(_k*_t));        // 前の円の中心〜この円の中心を結ぶ線: b(k) * sin(kt)
        push();
            var coefficientYSin = Math.round(r_bY * 100) / 100;
            if(dist(0, 0, r_bY * cos(_k*_t), r_bY * sin(_k*_t)) >= threshold && isShowingCoef){
                textCoef(coefficientYSin, 0, 0);
            }
            translate( r_bY * cos(_k*_t), r_bY * sin(_k*_t) );   // この円の中心に移動: b(k) * sin(kt)
            var retLineY_tmp = _lineY + r_aY * cos(_k*_t) + r_bY * sin(_k*_t);
            var retLineY;
            if( _k <= _k_MAX ){
                retLineY = nextCircleY( _fourier, _k+1, _k_MAX, _t, retLineY_tmp );
            }else{
                colorMode(RGB, 255, 255, 255);
                strokeWeight(7);
                stroke(0, 0, 255);
                point(0, 0);
                retLineY = retLineY_tmp;
            }
        pop();
    pop();

    return retLineY;
}

function mousePressed(){
    if((mouseX >= 0 && mouseX < W/2 && mouseY >= 0 && mouseY < W/2) ){
        p_list = [];
    }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){
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
        updateFormula(fourier1, "#formulaX1", "#formulaY1");

    }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){

        p_list2.push( new Point(mouseX, mouseY) );
        p_listSpline2 = spline.getSpline( p_list2, 100 );
        p_list2 = [];

        fourier2.expandFourierSeries( p_listSpline2, k_MAX );
        updateFormula(fourier2, "#formulaX2", "#formulaY2");
    }

    if(p_listSpline.length > 0 && p_listSpline2.length > 0){
        var ratio = 0.5;

        var lengthOfPointsW = parseInt(p_listSpline.length * (1-ratio) + p_listSpline2.length * ratio);
        fourier3 = new Fourier(lengthOfPointsW);

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
        updateFormula(fourier3, "#formulaX3", "#formulaY3");
    }

}

function textCoef(_text, _x, _y){
    push();
    noStroke();
    fill(0);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(_text, _x, _y);
    pop();
}

function updateFormula(_fourier, _elemFormulaX, _elemFormulaY){
    var formula_x = "";
    var formula_y = "";

    for (var i = 0; i < k_MAX; i ++){
        k_cos_x = _fourier.m_aX[i];
        k_sin_x = _fourier.m_bX[i];
        k_cos_y = _fourier.m_aY[i];
        k_sin_y = _fourier.m_bY[i];

        //console.log( i + ":" +this.m_aX[i] + ", " + this.m_bX[i] + ", " + this.m_aY[i] + ", " + this.m_bX[i] );
        formula_x += k_cos_x == 0 ? "" : getFormula(Math.round(k_cos_x*100)/100) +"cos"+i+"t";
        formula_x += k_sin_x == 0 ? "" : getFormula(Math.round(k_sin_x*100)/100) +"sin"+i+"t";
        formula_y += k_cos_y == 0 ? "" : getFormula(Math.round(k_cos_y*100)/100) +"cos"+i+"t";
        formula_y += k_sin_y == 0 ? "" : getFormula(Math.round(k_sin_y*100)/100) +"sin"+i+"t";
    }

    formula_x = formula_x.slice(2);
    formula_y = formula_y.slice(2);

    formula_x = "x(t) = " + formula_x;
    formula_y = "y(t) = " + formula_y;

    $(_elemFormulaX).text(formula_x);
    $(_elemFormulaY).text(formula_y);

    // p_listSpline = fourier.restorePoints(this);
}

/**
 * get coefficiet as String
 * @param  _coefficient 
 * @return {String}
 */
function getFormula( _coefficient ){
    if( _coefficient >= 0 ){
        return " + " + _coefficient;
    }
    return " - " + Math.abs(_coefficient);
}

function Point( x, y ){
    this.x = x;
    this.y = y;
}