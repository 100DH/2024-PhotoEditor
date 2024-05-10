//20210815 백대현 ml5.js 과제
let faceapi;
let video;
let detections;
let propSelect;
let colorSelect;
let frameSelect;
let frameCl;
let borderColor1;
let borderColor2;
let borderColor3;


// 기본적으로 모든 옵션은 true로 설정됨
const detection_options = {
    withLandmarks: true, // 얼굴 특징점 사용 여부
    withDescriptors: false, // 얼굴 특징 기술자 사용 여부
}

function setup() {
    createCanvas(600, 480); // 캔버스 생성
    
    // 비디오 캡처 생성
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // 비디오를 숨김

    // ml5.faceApi() 함수를 사용하여 얼굴 감지 모델 초기화
    faceapi = ml5.faceApi(video, detection_options, modelReady);
    textAlign(RIGHT); // 오른쪽 정렬 설정

    // 첫 번째 선택 옵션 생성
    propSelect = createSelect();
    propSelect.position(10, 500); // 위치 설정
    propSelect.option('Face');
    propSelect.option('RedNose');
    propSelect.option('None');
    propSelect.changed(selectEvent); // 선택 변경 이벤트 핸들링
    propSelect.style('color', 'white'); // 글씨 색상을 하얀색으로 설정
    propSelect.style('background-color', 'black'); // 배경 색상을 검정색으로 설정
    propSelect.size(120, 40); // 크기 설정
    propSelect.style('font-size', '30px'); // 글씨 크기를 20px로 설정
    
    // 두 번째 선택 옵션 생성
    colorSelect = createSelect();
    colorSelect.position(140, 500); // 위치 설정
    colorSelect.option('Black');
    colorSelect.option('Yellow');
    colorSelect.option('Gray');
    colorSelect.changed(selectEvent); // 선택 변경 이벤트 핸들링
    colorSelect.style('color', 'white'); // 글씨 색상을 하얀색으로 설정
    colorSelect.style('background-color', 'black'); // 배경 색상을 검정색으로 설정
    colorSelect.size(120, 40); // 크기 설정   
    colorSelect.style('font-size', '30px'); // 글씨 크기를 20px로 설정
  
    // 세 번째 선택 옵션 생성
    frameSelect = createSelect();
    frameSelect.position(270, 500); // 위치 설정
    frameSelect.option('Hat');
    frameSelect.option('Flower');
    frameSelect.option('None');
    frameSelect.changed(selectEvent); // 선택 변경 이벤트 핸들링
    frameSelect.style('color', 'white'); // 글씨 색상을 하얀색으로 설정
    frameSelect.style('background-color', 'black'); // 배경 색상을 검정색으로 설정
    frameSelect.size(120, 40); // 크기 설정
    frameSelect.style('font-size', '30px'); // 글씨 크기를 20px로 설정
}

function modelReady() {
    console.log('준비 완료!');
    console.log(faceapi);
    faceapi.detect(gotResults); // 얼굴 감지 실행
}

function gotResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }

    detections = result; // 감지 결과 저장

    background(255); // 배경을 흰색으로 지우기
    image(video, 0, 0, width, height); // 웹캠 영상 그리기

    // 얼굴이 감지된 경우
    if (detections && detections.length > 0) {
        drawFace(detections); // 선택된 모양 그리기
    }
    
    drawCanvasBorder(); // 캔버스 테두리 그리기
    faceapi.detect(gotResults); // 계속해서 얼굴 감지 실행
}

// 선택된 모양 그리기
function drawFace(detections) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x + alignedRect._box._width / 2; // 얼굴 중심 X 좌표
        const y = alignedRect._box._y + alignedRect._box._height / 2; // 얼굴 중심 Y 좌표
        const diameter = alignedRect._box._width; // 원의 지름은 얼굴 영역의 가로 길이의 1.5배
        
        const selectedShape = propSelect.value(); // 선택된 모양 가져오기
        const selectedFrame = colorSelect.value(); // 선택된 색상 가져오기
        const selectedProp = frameSelect.value(); // 선택된 크기 가져오기
        
        noStroke();
        
        // 선택된 색상에 따라 설정하기
        if (selectedFrame === 'Black') {
            borderColor1 = 0;
            borderColor2 = 0;
            borderColor3 = 0;
        } else if (selectedFrame === 'Yellow') {
            borderColor1 = 255;
            borderColor2 = 204;
            borderColor3 = 0;
        } else if (selectedFrame === 'Gray') {
            borderColor1 = 204;
            borderColor2 = 204;
            borderColor3 = 204;
        }
        
      
        // 선택된 모양에 따라 그리기
        if (selectedShape === 'Face') {
            fill(255, 245,230); // 피부색
            ellipse(x, y-20, diameter); // 원 그리기
            drawLandmarks(detections)
        } else if (selectedShape === 'RedNose') {
            fill(255,0,0);
            ellipse(x, y, diameter/4); // 원 그리기
        } else if (selectedShape === 'None') {
            
        }
      
        // 선택된 모양 출력 그리기
        if (selectedProp === 'Hat') {
            fill(255,204,102);
            noStroke();
            ellipse(x, y-150, diameter,diameter/2);
            rect(x,y-150, diameter, diameter/4);
            rect(x/2,y-150, diameter, diameter/4);
            
        } else if (selectedProp === 'Flower') {
            drawFlower(x+120,y-120,diameter);
            drawFlower(x-110,y-110,diameter);
            drawFlower(x-140,y+50,diameter);
        } else if (selectedProp === 'None') {
            
        }
      
    }
}

// 선택 변경 이벤트 핸들링 함수
function selectEvent() {
    console.log('Selected Shape:', propSelect.value());
    console.log('Selected Color:', colorSelect.value());
    console.log('Selected Size:', frameSelect.value());
}

// 얼굴 특징을 그리는 함수
function drawLandmarks(detections) {
    noFill();
    stroke(0, 0, 0); // 선 색상 설정
    strokeWeight(2); // 선 굵기 설정

    for (let i = 0; i < detections.length; i++) {
        const parts = detections[i].parts;

        // 얼굴 특징 그리기
        drawFeature(parts.mouth, true);
        drawFeature(parts.nose, false);
        drawFeature(parts.leftEye, true);
        drawFeature(parts.leftEyeBrow, false);
        drawFeature(parts.rightEye, true);
        drawFeature(parts.rightEyeBrow, false);
    }
}

// 얼굴 특징을 그리는 함수
function drawLandmarks2(detections) {
    
    noFill();
    stroke(255,128,144); // 선 색상 설정
    strokeWeight(5); // 선 굵기 설정

    for (let i = 0; i < detections.length; i++) {
        const parts = detections[i].parts;

        // 얼굴 특징 그리기
        
        drawFeature(parts.leftEye, true);
        drawFeature(parts.rightEye, true);
        
    }
}

// 특징을 그리는 함수
function drawFeature(feature, closed) {
    beginShape();
    for (let i = 0; i < feature.length; i++) {
        const x = feature[i]._x;
        const y = feature[i]._y;
        vertex(x, y);
    }

    if (closed === true) {
        endShape(CLOSE);
    } else {
        endShape();
    }
}

function drawCanvasBorder() { // 테두리
    stroke(borderColor1,borderColor1,borderColor3); // 테두리 색상 설정
    strokeWeight(40); // 테두리 두께 설정
    noFill(); // 테두리 내부를 비우기 (투명)

    rect(0, 0, width - 1, height - 1); // 캔버스 테두리 그리기
}


function drawFlower(x,y,diameter) {
  noStroke();
   fill(255,0,0);
   ellipse(x - 15, y, diameter/4, diameter/4); // 왼쪽 꽃잎
   ellipse(x + 15, y, diameter/4, diameter/4); // 오른쪽 꽃잎
   ellipse(x, y - 15, diameter/4, diameter/4); // 위쪽 꽃잎
   ellipse(x, y + 15, diameter/4, diameter/4); // 아래쪽 꽃잎
   fill(255,124,102);
   ellipse(x, y, diameter/4, diameter/4); // 중앙 꽃잎
}
