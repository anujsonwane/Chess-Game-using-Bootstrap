let Step= new Audio('Step.mp3');
let win= new Audio('win.mp3');
let start=new Audio('start.mp3');
let kill_step= new Audio('kill_step.wav');
let array = new Set();
let only_valid_set = new Set();
let content = [-1,-1,-1];
let cassling = [-1,-1,-1,-1,-1,-1]; //white side king,Rook LS,Rook RS,black King,Rook addtion side,Rook long side
let initial_position=-1;
let check=false;
let king_position=[60,4]; // white kings, black king position
let gameover=0;
let currentGameState = {
    0: {type: 'R', color: 'black'}, 1: {type: 'N', color: 'black'}, 2: {type: 'B', color: 'black'}, 3: {type: 'Q', color: 'black'}, 4: {type: 'K', color: 'black'}, 5: {type: 'B', color: 'black'}, 6: {type: 'N', color: 'black'}, 7: {type: 'R', color: 'black'},
    8: {type: 'P', color: 'black'}, 9: {type: 'P', color: 'black'}, 10: {type: 'P', color: 'black'}, 11: {type: 'P', color: 'black'}, 12: {type: 'P', color: 'black'}, 13: {type: 'P', color: 'black'}, 14: {type: 'P', color: 'black'}, 15: {type: 'P', color: 'black'},
    48: {type: 'P', color: 'white'}, 49: {type: 'P', color: 'white'}, 50: {type: 'P', color: 'white'}, 51: {type: 'P', color: 'white'}, 52: {type: 'P', color: 'white'}, 53: {type: 'P', color: 'white'}, 54: {type: 'P', color: 'white'}, 55: {type: 'P', color: 'white'},
    56: {type: 'R', color: 'white'}, 57: {type: 'N', color: 'white'}, 58: {type: 'B', color: 'white'}, 59: {type: 'Q', color: 'white'}, 60: {type: 'K', color: 'white'}, 61: {type: 'B', color: 'white'}, 62: {type: 'N', color: 'white'}, 63: {type: 'R', color: 'white'}
};
let currentPlayer = 'white'; // Start with white player
// Create spans for each piece type with appropriate glyphicon classes
const pieceClasses = {
    'Q': 'glyphicon-queen',
    'R': 'glyphicon-tree-deciduous',
    'B': 'glyphicon-bishop',
    'N': 'glyphicon-knight'
};


function star(){
    start.play();
}
function validate_move(position,type,color,state){
    array.clear();
    only_valid_set.clear();
    let temp=position;
    let opposite_add=0;
    //if click on Rook
    if(type=="R"){
        while ((temp+8)<64 && ((temp+8)>=0)) { // for down side of rook
            temp+=8;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }    
        }
        temp=position;
        opposite_add=0;
        while ((temp-8)<64 && ((temp-8)>=0)){ // for up side of rook
            temp-=8;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }
        }
        temp=position;
        opposite_add=0;
        while ((temp-1)>=(Math.floor(position/8))*8 && (temp-1)>=0 && (temp-1)<64) { // for left side of rook
            temp--;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }
        }
        temp=position;
        opposite_add=0;
        while ((temp+1)<=(Math.floor(position/8)+1)*8 && (temp+1)>=0 && (temp+1)<64) { // for right side of rook
            temp++;
            array.add(temp);
            // for only_valid_set
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }  
        }

    // for knight
    }else if(type=="N"){
        let rook=[-17,-15,-10,-6,6,10,15,17];
        let rookRow=[-2,-2,-1,-1,1,1,2,2];
        let rookElement=Math.floor(position/8);
        for(let i=0;i<8;i++){
            let element=position+rook[i];
            if(element>=0 && element<64 && rookElement+rookRow[i]==Math.floor(element/8)){
                array.add(position+rook[i]);
                //for only_valid_array
                content_of_position(position+rook[i]);
                if((content[0]!=-1 && content[2]!=color) || content[0]==-1){
                    only_valid_set.add(position+rook[i]);
                }
            }
        }
    // for bishop
    }else if(type=="B"){
        let bishop=[-9,9,-7,7];
        let bishopRow=[-1,1,-1,1];
        let row=Math.floor(position/8);
        for(let i=0;i<bishop.length;i++){
            while(temp+bishop[i]>=0 && temp+bishop[i]<64 && Math.floor((temp+bishop[i])/8)==row+bishopRow[i]){
                temp+=bishop[i];
                row+=bishopRow[i];
                array.add(temp);
                // for only_valid_array
                content_of_position(temp);
                if(content[0]==-1 && opposite_add==0){
                    only_valid_set.add(temp);
                }else if((color!=content[2]) && opposite_add==0){
                    only_valid_set.add(temp);
                    opposite_add=1;
                }else if(content[2]==color){
                    opposite_add=1;
                }
            }
            temp=position;
            opposite_add=0;
            row=Math.floor(position/8);
        }
    // for king
    }else if(type=="K"){

        let king=[-9,9,-7,7,-8,8,-1,1];
        let kingRow=[-1,1,-1,1,-1,1,0,0];
        let row=Math.floor(position/8);
        for(let i=0;i<8;i++){
            if(position+king[i]>=0 && position+king[i]<64 && Math.floor((position+king[i])/8)==row+kingRow[i]){
                array.add(position+king[i]);
                // for only_valid_set
                content_of_position(position+king[i]);
                if(content[0]==-1 || (content[0]!=-1 && content[2]!=color)){
                    only_valid_set.add(position+king[i]);
                }
            }
        }
        //for cassling
        //for white king
        content_of_position(position+2); //on right side cassling
        if(color=="white" && cassling[2]==-1 && cassling[0]==-1  && content[0]==-1){ //cassling[2] is for right side of white side position
            content_of_position(position+1);
            let between_noone=content[0]; 
            content_of_position(position+3);
            if(content[1]=="R" && between_noone==-1){
                array.add(position+2);
                only_valid_set.add(position+2);
            }
        }
        content_of_position(position-2); //on left side cassling
        if(color=="white" && cassling[1]==-1 && cassling[0]==-1  && content[0]==-1){ //cassling[1] is for left side of white king side position
            content_of_position(position-1);
            let between_noone1=content[0];
            content_of_position(position-3);
            let between_noone2=content[0];
            content_of_position(position-4);
            if(content[1]=="R" && between_noone1==-1 && between_noone2==-1){
                array.add(position-2);
                only_valid_set.add(position-2);
            }
        }
        //same for black king
        content_of_position(position+2); //on lift side cassling or addition side
        if(color=="black" && cassling[3]==-1 && cassling[4]==-1  && content[0]==-1){ //cassling[4] is for left side ROOK of black side position
            content_of_position(position+1);
            let between_noone=content[0]; 
            content_of_position(position+3);
            if(content[1]=="R" && between_noone==-1){
                array.add(position+2);
                only_valid_set.add(position+2);
            }
        }
        content_of_position(position-2); //on right side cassling or long side or substraction side
        if(color=="black" && cassling[3]==-1 && cassling[5]==-1  && content[0]==-1){ //cassling[5] is for right side ROOK of black king side position
            content_of_position(position-1);
            let between_noone1=content[0];
            content_of_position(position-3);
            let between_noone2=content[0];
            content_of_position(position-4);
            if(content[1]=="R" && between_noone1==-1 && between_noone2==-1){
                array.add(position-2);
                only_valid_set.add(position-2);
            }
        }
    }else if(type=="Q"){
        // queen do both the work of rook and bishop
        let bishop=[-9,9,-7,7];
        let bishopRow=[-1,1,-1,1];
        let row=Math.floor(position/8);
        for(let i=0;i<bishop.length;i++){
            while(temp+bishop[i]>=0 && temp+bishop[i]<64 && Math.floor((temp+bishop[i])/8)==row+bishopRow[i]){
                temp+=bishop[i];
                row+=bishopRow[i];
                array.add(temp);
                // for only_valid_array
                content_of_position(temp);
                if(content[0]==-1 && opposite_add==0){
                    only_valid_set.add(temp);
                }else if((color!=content[2]) && opposite_add==0){
                    only_valid_set.add(temp);
                    opposite_add=1;
                }else if(content[2]==color){
                    opposite_add=1;
                }

            }
            temp=position;
            opposite_add=0;
            row=Math.floor(position/8);

        }
        temp=position;
        opposite_add=0;
        while ((temp+8)<64 && ((temp+8)>=0)) { // for down side of rook
            temp+=8;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }    
        }
        temp=position;
        opposite_add=0;
        while ((temp-8)<64 && ((temp-8)>=0)){ // for up side of rook
            temp-=8;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }
        }
        temp=position;
        opposite_add=0;
        while ((temp-1)>=(Math.floor(position/8))*8 && (temp-1)>=0 && (temp-1)<64) { // for left side of rook
            temp--;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }
        }
        temp=position;
        opposite_add=0;
        while ((temp+1)<=(Math.floor(position/8)+1)*8 && (temp+1)>=0 && (temp+1)<64) { // for right side of rook
            temp++;
            array.add(temp);
            // for only_valid_array
            content_of_position(temp);
            if((content[0]==-1) && (opposite_add==0)){
                only_valid_set.add(temp);
            }else if((color!=content[2]) && (opposite_add==0)){
                only_valid_set.add(temp);
                opposite_add=1;
            }else if(content[2]==color){
                opposite_add=1;
            }  
        }
        
    //for pawn
    }else if(type=="P"){
        //for white pawn
        if(color=="white"){
            if(Math.floor(position/8)==6){
                array.add(position-8);
                array.add(position-16);
                //for only_valid_array
                content_of_position(position-8);
                if(content[0]==-1){
                    only_valid_set.add(position-8);
                }else{
                    opposite_add=1;
                }
                content_of_position(position-16);
                if(content[0]==-1 && opposite_add==0){
                    only_valid_set.add(position-16);
                }
                
            }else{
                if(position-8>=0){
                    array.add(position-8);
                    content_of_position(position-8);
                    if(content[0]==-1){
                        only_valid_set.add(position-8);
                    }
                }
            }
            //if pawn can kill
            if(position-7>=0 && position-7>=0 && (position-7)<64){
                array.add(position-7);
                // for only_valid_set
                content_of_position(position-7);
                if(content[0]!=-1 && content[2]!=color){
                    only_valid_set.add(position-7);
                }
            }
            if(position-9>=0 && position-9>=0 && (position-9)<64){
                array.add(position-9);
                // for only_valid_set
                content_of_position(position-9);
                if(content[0]!=-1 && content[2]!=color){
                    only_valid_set.add(position-9);
                }
            }
            // for change pawn to other type will be in fun_moveSpan
        }else{
            // for black pawn
            if(Math.floor(position/8)==1){
                array.add(position+8);
                array.add(position+16);
                //for only_valid_set
                content_of_position(position+8);
                if(content[0]==-1){
                    only_valid_set.add(position+8);
                }else{
                    opposite_add=1;
                }
                content_of_position(position+16);
                if(content[0]==-1 && opposite_add==0){
                    only_valid_set.add(position+16);
                }
            }else{
                if(position+8<64){
                    array.add(position+8);
                    content_of_position(position+8);
                    if(content[0]==-1){
                        only_valid_set.add(position+8);
                    }

                }
            }
            //if pawn can kill
            if(position+7>=0 && position+7>=0 && (position+7)<64){
                array.add(position+7);
                // for only_valid_set
                content_of_position(position+7);
                if(content[0]!=-1 && content[2]!=color){
                    only_valid_set.add(position+7);
                }
            }
            if(position+9>=0 && position+9>=0 && (position+9)<64){
                array.add(position+9);
                // for only_valid_set
                content_of_position(position+9);
                if(content[0]!=-1 && content[2]!=color){
                    only_valid_set.add(position+9);
                }
            }
        }
        
    }
    if(check==true){
        console.log("they are here");
        filterValidPosition(position,only_valid_set,color);
        console.log(only_valid_set);
    }
    
}
function filterValidPosition(position,only_valid_set,color){//we will filter only_valid_set
    let valid_positions = new Set();
    let list =Array.from(only_valid_set).sort((a,b)=>a-b);
    for (let i=0;i<list.length;i++) { // only_valid is set so iterate through this process and not through array
        let next_position = list[i];

        // Simulate the move using a temporary state
        let tempState = simulateMove(position, next_position);

        // Check if the king is still in check
        isKingInCheck(color,tempState);
        if (check==false) {
            valid_positions.add(next_position);
        }

        // No need to undo the move as we are using a temporary state
    }
    console.log("this is about filterValidPosition", valid_positions);

    // Update only_valid_array with valid positions
    console.log("only_valid_set",only_valid_set);
    only_valid_set.clear();
    valid_positions.forEach(pos => only_valid_set.add(pos)); //changing elements in only_valid_set
    return ;
}
function simulateMove(initial_position, next_position) {
    // Create a copy of the current game state
    let tempState = JSON.parse(JSON.stringify(currentGameState));

    // Simulate the move on the temporary state
    tempState[next_position] = tempState[initial_position];
    tempState[initial_position] = null;

    // Handle special moves like castling if needed


    return tempState;
}
function isKingInCheck(color,state) {
    check=false;
    let opponentColor = (color === 'white') ? 'black' : 'white';
    let king_position = findKingPosition(color,state);

    // Check if any opponent piece can move to the king's position
    for(let index in state){
        let element =state[index];
        if (element && element.color === opponentColor) {
            let type = element.type;
            if(check==true){// this loop is for dont apply check condition of the validate_move
                check=false;
                validate_move(Number(index), type, opponentColor,state);
                check=true;
            }else{
                validate_move(Number(index), type, opponentColor,state);
            }
            if (only_valid_set.has(Number(king_position))) {
                check=true;
                return check;
            }
        }
        
    }
    // Check if checking_element_array is empty or not
    if (check!=true){
        console.log(color,"King is not in check.");
    }
    return check;
}
function findKingPosition(color,state) { //so we will get kings position
    // Implement logic to find the king's position in the given state
    for (let index in state) {
        let element = state[index];
        if (element && element.type === 'K' && element.color === color) {
            return index;
        }
    }
    return null;
}
function promotion(position, color) {
    let promotionDialog = document.createElement('div');
    promotionDialog.classList.add('promotion-dialog');

    Object.keys(pieceClasses).forEach(piece => {
        let span = document.createElement('span');
        span.className = `glyphicon ${pieceClasses[piece]} ${color} img-thumbnail`;
        span.setAttribute('data-value', piece);
        span.addEventListener('click', () => {
            promotePawn(position, piece, color);
            document.body.removeChild(promotionDialog); // this should work to remove the promotion dialoge
        });
        promotionDialog.appendChild(span);
    });

    // Position the promotion dialog near the pawn
    let pawnElement = document.querySelectorAll('.place')[position];
    let rect = pawnElement.getBoundingClientRect();
    promotionDialog.style.position = 'absolute';
    promotionDialog.style.left = `${rect.left}px`;
    promotionDialog.style.top = `${rect.top + window.scrollY}px`; // Adjust for scroll position

    // Add the promotion dialog to the body
    document.body.appendChild(promotionDialog);
}
function promotePawn(position, piece, color) {
    let positionDiv = document.querySelectorAll('.place')[position];
    let spanElement = positionDiv.querySelector('span');
    if (spanElement) {
        spanElement.setAttribute('data-value', piece);
        spanElement.className = `glyphicon ${pieceClasses[piece]} ${color} `;
    }
}
function content_of_position(index){
    let element=document.querySelectorAll('.place')[index];
    if (!element) {
        console.log('Element not found at index:', index);
        content=[-1,-1,-1];
        return;
    }
    let spanElement = element.querySelector('span');
    if (!spanElement) {
        content=[-1,-1,-1];
        return;
    }
    var type = spanElement.getAttribute('data-value');
    var classes = spanElement.getAttribute('class').split(' ');
    var color = classes.includes('white') ? 'white' : classes.includes('black') ? 'black' : '';
    content=[index,type,color];
}
function highlighter(event,index){
    content_of_position(index);
    // console.log("Index :",content[0],"Type :",content[1],"Color :",content[2]);
    if(content[0]==-1){
        return;
    }
    let type=content[1];
    let color=content[2];
    //implementation of border on possible possitions
    validate_move(index,type,color,currentGameState);
    
    let list =Array.from(only_valid_set).sort((a,b)=>a-b);
    let list2 =Array.from(array).sort((a,b)=>a-b);
    let j=0;
    for(let i=0;i<64;i++){
        if( j<list.length && i==list[j] ){
            document.querySelectorAll('.place')[i].classList.add('highlight');;
            j++;
        }else{
            document.querySelectorAll('.place')[i].classList.remove('highlight');
        }
    }
}
function dehighlighter(){
    document.querySelectorAll('.place').forEach((element) => {
        element.classList.remove('highlight');
    });
}
function is_valid_moveSpan(initial_position, next_position) {
    if (initial_position < 0 || initial_position > 63 || next_position < 0 || next_position > 63) return 0;

    let initial_position_Div = document.querySelectorAll('.place')[initial_position];
    let initial_spanElement = initial_position_Div.querySelector('span');

    if (!initial_spanElement) {
        return 0;
    }
    return 1;
}
function moveSpan(initial_position, next_position) {
    let initial_position_Div = document.querySelectorAll('.place')[initial_position];
    let next_position_Div = document.querySelectorAll('.place')[next_position];
    let initial_spanElement = initial_position_Div.querySelector('span');
    let next_spanElement = next_position_Div.querySelector('span');

    if (initial_spanElement && !next_spanElement) {
        console.log('Next span element is not found, so no problem');
        next_position_Div.appendChild(initial_spanElement);
        Step.play();
    }else{
        next_position_Div.removeChild(next_spanElement);
        next_position_Div.appendChild(initial_spanElement);
        console.log('Next span element is found, will replace it');
        kill_step.play();
    }
    // Update the game state
    currentGameState[next_position] = currentGameState[initial_position];
    currentGameState[initial_position] = null;
}
function fun_moveSpan(event, next_position) {
    if(initial_position==-1){
        highlighter(event,next_position);
        return initial_position=next_position;
    }
    dehighlighter();
    if (is_valid_moveSpan(initial_position, next_position) && only_valid_set.has(next_position)) {
        moveSpan(initial_position, next_position);
        // Check if the move puts the opponent in check
        let opponentColor = (currentPlayer === 'white') ? 'black' : 'white';
        if (isKingInCheck(opponentColor,currentGameState)) {
            check=true;
            console.log(opponentColor + " king is in check!");
        }
        // Switch the current player after a valid move
        currentPlayer = (currentPlayer === 'white') ? 'black' : 'white';

        // to check cassling if king moved then move the respective rook
        content_of_position(next_position); // here initial_position content now move to next_position because moveSpan function has happened on line 450
        if(content[1]=="K"){
            (content[2]=="white")?king_position[0]=next_position:king_position[1]=next_position; // this for to know the kings position 
            if((initial_position==60 || initial_position==4)&& ((initial_position==next_position+2) || (initial_position==next_position-2))){
                if((next_position+2==initial_position)&& initial_position==60) moveSpan(56,59); // moving white rook of cassling long side
                if((next_position+2==initial_position)&& initial_position==4) moveSpan(0,3); // moving black rook of cassling long side
                if((initial_position==next_position-2)&& initial_position==60) moveSpan(63,61); // mooving white rook of cassling short side
                if((initial_position==next_position-2)&& initial_position==4) moveSpan(7,5); // mooving black rook of cassling short side
                if(initial_position!=next_position){
                    (content[2]=="white")?cassling[0]=0:cassling[3]=0;
                }
            }
        }
        if(content[1]=="R"){ // to change the content of cassling if rook move its position then cassling is not possible
            if(initial_position==0 && initial_position!=next_position){
                cassling[5]=0;
            }else if(initial_position==7 && initial_position!=next_position){
                cassling[4]=0;
            }else if(initial_position==56 && initial_position!=next_position){
                cassling[1]=0;
            }else if(initial_position==63 && initial_position!=next_position){
                cassling[2]=0;
            }
        }
        if(content[1]=="P"){ // for promotion and el passo
            //for white promotion
            if(content[2]=="white" && (Math.floor(content[0]/8)==0)){
                promotion(next_position, 'white');
            }
            //black promotion
            if(content[2]=="black" && (Math.floor(content[0]/8)==7)){
                promotion(next_position, 'black');
            }
        }
    }
    
    // Check if the current player is in checkmate
    // if (check == 1 && only_valid_array.size == 0) {
    //     alert(currentPlayer + " is in checkmate! " + opponentColor + " wins!");
    //     gameover = 1;
    // }
    return initial_position=-1;
}
function box_color(element,index){
    if((index%2==0 && Math.floor(index/8)%2==0) || (index%2==1 && Math.floor(index/8)%2==1)){
        element.style.backgroundColor = "rgb(219, 108, 34)";
        element.style.border = "solid 2.5px rgb(219, 108, 34)";
    }else{
        element.style.backgroundColor = "rgb(57, 207, 177)";
        element.style.border = "solid 2.5px rgb(57, 207, 177)";
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    document.addEventListener('click', (event) => {
        star(); // Play sound when the user interacts with the document
    }, { once: true }); // Ensure the event listener is only triggered once
});
document.querySelectorAll('.place').forEach((element,index) => {
    element.setAttribute('tabindex', '0');
    box_color(element,index);
    // element.addEventListener('mouseup',(event)=> highlighter(event,index));
    element.addEventListener('click', (event) => {
        content_of_position(index);
        if (initial_position === -1) { // First click: selecting the piece
            if (content[2] === currentPlayer) {
                fun_moveSpan(event, index);
            } else {
                console.log(`It's ${currentPlayer}'s turn.`);
            }
        } else { // Second click: moving the piece
            fun_moveSpan(event, index);
        }
    });
    
});