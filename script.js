const GameDifficulty=[20,50,70];
class Game{
    difficulty;
    cols=3;
    rows=3;
    count;
    //satir sutun carpimi
    blocks;
    emptyBlockCoords=[2,2];
    //oyun basladiginda bos blokun kordinati 
    indexes=[];
    //index bloklarin sirasini takip eder

    constructor(difficultyLevel=1){
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.count=this.cols*this.rows;
        this.blocks=document.getElementsByClassName("puzzle_blok");//blogu tutma islemi
        this.init();
    }
    // her blogu uygun konuma yerlestirme
    init(){
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let blockIdx=x+y*this.cols;
                if(blockIdx+1>=this.count)
                break;
                let block=this.blocks[blockIdx];
                this.positionBlockAtCoord(blockIdx,x,y);
                block.addEventListener('click',(e)=>this.onClickOnBlock(blockIdx));
                this.indexes.push(blockIdx);
            }
        }
        this.indexes.push(this.count-1);
        this.randomize(this.difficulty);
    }
    //bloku random hareket ettir, x iterasyon sayisi
    randomize(iterationCount){
        for(let i=0;i<iterationCount;i++){
            let randomBlockIdx=Math.floor(Math.random()*(this.count-1));
            let moved=this.moveBlock(randomBlockIdx);
            if(!moved)i--;
        }
    }

    //blok hareket ettiyse true don

    moveBlock(blockIdx){
        let block=this.blocks[blockIdx];
        let blockCoords=this.canMoveBlock(block);
        if(blockCoords!=null){
            this.positionBlockAtCoord(blockIdx,this.emptyBlockCoords[0],this.emptyBlockCoords[1]);
            this.indexes[this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols]=this.indexes[blockCoords[0]+blockCoords[1]*this.cols];
            this.emptyBlockCoords[0]=blockCoords[0];
            this.emptyBlockCoords[1]=blockCoords[1];
                return true;
        }
        return false;
    }
    //eger hareket ederse kordinatlarini dondur, edemiyorsa null dondur
    canMoveBlock(block){
        let blockPos=[parseInt(block.style.left),parseInt(block.style.top)];
        let blockWidth=block.clientWidth;
        let blockCoords=[blockPos[0]/blockWidth,blockPos[1]/blockWidth];
        let diff=[Math.abs(blockCoords[0]-this.emptyBlockCoords[0]),Math.abs(blockCoords[1]-this.emptyBlockCoords[1])];
        let canMove=(diff[0]==1&&diff[1]==0)||(diff[0]==0&&diff[1]==1);
        if(canMove)
            return blockCoords;
        else
            return null;
    }
//bloklari merkez pozisyonda konumlandirma
    positionBlockAtCoord(blockIdx,x,y){
        let block=this.blocks[blockIdx];
        block.style.left=(x*block.clientWidth)+"px";
        block.style.top=(y*block.clientWidth)+"px";
    }
//puzzle cozulduyse ekrana pop up seklinde 600 saniyeye kadar yazdir.
    onClickOnBlock(blockIdx){
        if(this.moveBlock(blockIdx)){
            if(this.checkPuzzleSolved()){
                setTimeout(()=>alert("Tebrikler,Puzzle Cozuldu!!"),600);
            }
        }
    }
//puzzle cozulduysa true dondur.
    checkPuzzleSolved(){
        for(let i=0;i<this.indexes.length;i++){
            if(i==this.emptyBlockCoords[0]+this.emptyBlockCoords[1]*this.cols)
                continue;
            if(this.indexes[i]!=i)
                return false;
        }
        return true;
    }
//zorluk ayarlama
    setDifficulty(difficultyLevel){
        this.difficulty=GameDifficulty[difficultyLevel-1];
        this.randomize(this.difficulty);
    }

}

//yeni oyun baslatma
var game=new Game(1);


//zorluk tuslari
var difficulty_buttons=Array.from(document.getElementsByClassName("difficulty_button"));
difficulty_buttons.forEach((elem,idx)=>{
    elem.addEventListener('click',(e)=>{
        difficulty_buttons[GameDifficulty.indexOf(game.difficulty)].classList.remove("active");
        elem.classList.add("active");
        game.setDifficulty(idx+1);
    });
});

