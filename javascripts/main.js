var W = 400;
var k_MAX = 50;

var spline;
var fourier1, fourier2, fourier3;

p_list  = [], p_listSpline  = [];
p_list2 = [], p_listSpline2 = [];
p_list3 = [], p_listSpline3 = [];

function setup(){
    createCanvas(W*3, W);
    noFill();
    textSize(20);
    textAlign(CENTER, CENTER);

    spline = new Spline();
    fourier1 = new Fourier();
    fourier2 = new Fourier();
    fourier3 = new Fourier();

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

    pg.background(228);
    // image(pg, W, 0);

    // if( mouseIsPressed ){
    //     for( var pi = 0; pi < p_list.length; pi ++ ){
    //         point( p_list[pi].x, p_list[pi].y );
    //     }
    // }
    
    // draw strokes
    strokeWeight(1);
    for( var pi = 0 ; pi < p_list.length ; pi ++ ){
        var p = p_list[pi];
        point( p.x, p.y );
    }
    for( var pi = 0 ; pi < p_list2.length ; pi ++ ){
        var p = p_list2[pi];
        point( p.x, p.y );
    }

    // draw splined strokes
    strokeWeight(2.5);
    for( var pi = 0 ; pi < p_listSpline.length ; pi ++ ){
        var p = p_listSpline[pi];
        point( p.x, p.y );
    }    
    for( var pi = 0 ; pi < p_listSpline2.length ; pi ++ ){
        var p = p_listSpline2[pi];
        point( p.x, p.y );
    }    

    // stroke(0);
    // strokeWeight(1);
    // if( p_list2.length > 0 ){
    //     var t = 2 * Math.PI * (frameCount % p_list2.length)/p_list2.length - Math.PI;

    //     noFill();
    //     push();
    //     translate(fourier.m_aX[0]/2, height * 3/4 );
    //     nextCircleX( 1, k_MAX, t);
    //     pop();
    //     push();
    //     translate(width * 3/4, fourier.m_aY[0]/2);
    //     nextCircleY( 1, k_MAX, t);
    //     pop();
    // }   

}

// nextCircleX = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
//     var r_aX = fourier.m_aX[_k];
//     var r_bX = fourier.m_bX[_k];

//     strokeWeight(1);
//     stroke(0);
//     ellipse( 0, 0, Math.abs(r_aX) * 2, Math.abs(r_aX) * 2 );
//     stroke(255, 128, 128);
//     line(0, 0, r_aX * cos(_k*_t), r_aX * sin(_k*_t));            // X譁ｹ蜷代�邱�: a(k) * cos(kt)
//     push();
//         translate( r_aX * cos(_k*_t), r_aX * sin(_k*_t) );       // X譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
//         ellipse( 0, 0, Math.abs(r_bX) * 2, Math.abs(r_bX) * 2 );
//         line(0, 0, r_bX * sin(_k*_t), r_bX * cos(_k*_t));        // X譁ｹ蜷代�邱�: b(k) * sin(kt)
//         push();
//             translate( r_bX * sin(_k*_t), r_bX * cos(_k*_t) );   // X譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
//             if( _k <= _k_MAX ){
//                 nextCircleX( _k+1, _k_MAX, _t );
//             }else{
//                 line( 0, -W, 0, W );
//                 strokeWeight(7);
//                 stroke(255, 0, 0);
//                 point(0, 0);
//             }
//         pop();
//     pop();
// }

// nextCircleY = function( _k /* 迴ｾ蝨ｨ縺ｮ谺｡謨ｰ */, _k_MAX /* 譛螟ｧ谺｡謨ｰ */, _t /* 蟐剃ｻ句､画焚 */ ){
//     var r_aY = fourier.m_aY[_k];
//     var r_bY = fourier.m_bY[_k];

//     strokeWeight(1);
//     stroke(0);
//     ellipse( 0, 0, Math.abs(r_aY) * 2, Math.abs(r_aY) * 2 );
//     stroke(128, 128, 255);
//     line(0, 0, r_aY * sin(_k*_t), r_aY * cos(_k*_t));           // Y譁ｹ蜷代�邱�: a(k) * cos(kt)
//     push();
//         translate( r_aY * sin(_k*_t), r_aY * cos(_k*_t) );       // Y譁ｹ蜷醍ｧｻ蜍�: a(k) * cos(kt)
//         ellipse( 0, 0, Math.abs(r_bY) * 2, Math.abs(r_bY) * 2 );
//         line(0, 0, r_bY * cos(_k*_t), r_bY * sin(_k*_t));        // Y譁ｹ蜷代�邱�: b(k) * sin(kt)
//         push();
//             translate( r_bY * cos(_k*_t), r_bY * sin(_k*_t) );   // Y譁ｹ蜷醍ｧｻ蜍�: b(k) * sin(kt)
//             if( _k <= _k_MAX ){
//                 this.nextCircleY( _k+1, _k_MAX, _t );
//             }else{
//                 line(-W, 0, W, 0);
//                 strokeWeight(7);
//                 stroke(0, 0, 255);
//                 point(0, 0);
//             }
//         pop();
//     pop();
// }

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

    }else if((mouseX >= W && mouseX < W*3/2 && mouseY >= 0 && mouseY < W/2)){

        p_list2.push( new Point(mouseX, mouseY) );
        p_listSpline2 = spline.getSpline( p_list2, 100 );
        p_list2 = [];

    }

    // console.log("ストロークの入力が行われました");
    // console.log(p_list);

    // p_list2 = spline.getSpline( this, p_list, 100 );
    // fourier.expandFourierSeries( p_list2, k_MAX );

    // console.log("スプライン補間を行いました");
    // console.log(p_list2);

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

    // p_list2 = fourier.restorePoints(this);
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