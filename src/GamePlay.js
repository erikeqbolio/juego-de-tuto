var AMOUNT_DIAMONDS = 30;
GamePlayManager = {
    init: function () {
        //console.log('init');  
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageVertically = true;

        this.flagFirstMouseDown = false;
    },
    preload: function () {
        //console.log('preload'); 
        game.load.image('background', 'assets/images/background.png');
        game.load.spritesheet('horse', 'assets/images/horse.png', 84, 156, 2);
        game.load.spritesheet('diamonds', 'assets/images/diamonds.png', 81, 84, 4);
    },
    create: function () {
        //console.log('create'); 
        game.add.sprite(0,0,'background'); 
        this.horse = game.add.sprite(0,0,'horse');
        this.horse.frame = 0;
        this.horse.x = game.width/2;
        this.horse.y = game.height/2;
        this.horse.anchor.setTo(0.5);

        game.input.onDown.add(this.onTap, this);

        this.diamonds = [];
        for (var i=0; i<AMOUNT_DIAMONDS; i++){
            var diamond = game.add.sprite(100,100,'diamonds');
            diamond.frame = game.rnd.integerInRange(0,3);
            diamond.scale.setTo( 0.30 + game.rnd.frac() );
            diamond.anchor.setTo(0.5);
            diamond.x = game.rnd.integerInRange(50, game.width);
            diamond.y = game.rnd.integerInRange(50, game.height);
            this.diamonds[i] = diamond;

            var rectCurrentDiamond = this.getBoundsDiamond(diamond);
            var rectHorse = this.getBoundsDiamond(this.horse);
            while(this.isOverlappingOtherDiamond(i,rectCurrentDiamond) || this.isRectanglesOverlapping(rectHorse, rectCurrentDiamond) ){
                diamond.x = game.rnd.integerInRange(50, game.width);
                diamond.y = game.rnd.integerInRange(50, game.height);
                rectCurrentDiamond = this.getBoundsDiamond(diamond);
            }
        }

    },
    onTap:function(){
        this.flagFirstMouseDown = true;
    },
    getBoundsDiamond:function(currentDiamond){
        return new Phaser.Rectangle(currentDiamond.left, currentDiamond.top, currentDiamond.width, currentDiamond.height);
    },
    isRectanglesOverlapping: function (rect1, rect2){
        if(rect1.x>rect2.x+rect2.width || rect2.x>rect1.x+rect1.width){
            return false;
        }
        if(rect1.y>rect2.y+rect2.height || rect2>rect1.y+rect1.width){
            return false;
        }
        return true;
    },
    isOverlappingOtherDiamond:function(index, rect2){
        for(var i=0; i<index; i++){
            var rect1 = this.getBoundsDiamond(this.diamonds[i]);
            if(this.isRectanglesOverlapping(rect1,rect2)){
                return true;
            }
        }
        return false;
    },
    getBoundsHourse:function(){
        var x0 = this.horse.x - Math.abs(this.horse.width)/4;
        var width = Math.abs(this.horse.width/2);
        var y0 = this.horse.y - this.horse.height/2;
        var height = this.horse.height;
        return new Phaser.Rectangle(x0,y0,width,height);
    },
    render:function(){
        //game.debug.spriteBounds(this.horse);
        for(var i=0; i<AMOUNT_DIAMONDS; i++){
            //game.debug.spriteBounds(this.diamonds[i]);
        }
    },
    update: function () {
        //console.log('update');  
        if (this.flagFirstMouseDown){
            var pointerX = game.input.x;
            var pointerY = game.input.y;
            var distX = pointerX - this.horse.x;
            var distY = pointerY - this.horse.y;
            if(distX>0){
                this.horse.scale.setTo(1,1);
            }else{
                this.horse.scale.setTo(-1,1);
            }
            this.horse.x += distX * 0.02;
            this.horse.y += distY * 0.02;

            for (var i=0; i<AMOUNT_DIAMONDS; i++){
                var rectHorse = this.getBoundsHourse();
                var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);
                if (this.diamonds[i].visible && this.isRectanglesOverlapping(rectHorse, rectDiamond)){
                    this.diamonds[i].visible = false;
                }
            }
        }

    },
}

var game = new Phaser.Game(1136, 640, Phaser.AUTO);
game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');