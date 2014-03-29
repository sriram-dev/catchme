var LoadingScreen =  me.ScreenObject.extend(
{
	/* Constructor */
	init: function() {
		console.log("inside init of loading screen \n");
		this.parent(true);
        this.bg = new Image();
        this.bg.src = "data/img/loading.png";
        this.loading = new me.Font("Verdana", 20, "black");
	},
	
	/* draw function */
	draw: function(context) {
		me.video.clearSurface(context, "black");
        context.drawImage(this.bg, 0, 0);
		var loadingText = "Loading Game ... Please Wait!";
        var loadingSize = this.loading.measureText(context, loadingText);
		this.loading.draw(context, loadingText,
                        (me.video.getWidth() / 2) - (loadingSize.width / 2),
                        (me.video.getHeight() / 2) - (loadingSize.height / 2));
	}

});

var MenuScreen = me.ScreenObject.extend({
	init:function() {
		this.parent(true);
        this.bg = new Image();
        this.bg.src = "data/img/sky.jpg";
        this.play = null;
        this.highscores = null;
        this.loading = new me.Font("Verdana", 20, "white");
	},
	
	draw: function(context) {
		 // draw play button
		 this.loadingtext = "";
         context.drawImage(this.bg, 0, 0);
         this.play.draw(context);
         //this.autoplay.draw(context);
         //this.highscores.draw(context);
	},
	/*
     * reset function
     */
    onResetEvent: function()
    {
        // play button
        this.play = new Button("play", me.state.PLAY, false, 80);
        this.autoplay = new Button("autoplay", me.state.PLAY, true, 200);
        //this.highscores = new Button("highscores", me.state.PLAY, 400);
        // version
        this.version = new me.Font("Verdana", 20, "white");
    }
});

var PlayScreen = me.ScreenObject.extend({	 
	 onResetEvent: function()
     {
		// add main player
        me.game.add(new PlayerEntity(10, 30), 10);
        console.log("in play screen ");
        if(game.data.automode) {
        	console.log("automode true");
        } else {
        	console.log("automode false");
        }
		// add bkgrd 
		me.game.add(new BackgroundObject(), 1);
		me.debug.renderHitBox = true;
		//randomly add 5 coins at different locations in screen
		me.game.add(new CoinUpdater(), 1);	 	

		this.HUD = new game.HUD.Container(370,250, 1);
		me.game.world.addChild(this.HUD);

		this.Clock = new game.HUD.Container(370,20,2);
		me.game.world.addChild(this.Clock);

		this.lives = new game.HUD.Container(100, 20, 3);
		me.game.world.addChild(this.lives);
		this.interval = setInterval(function() {game.data.clock -= 1;},1000);
		this.font = new me.BitmapFont("32x32_font", 32);
		// sort
		me.game.sort();

	 },
	 
	 onDestroyEvent:function() {
		clearInterval(this.interval);
		game.data.clock = 60;
		game.data.lives = 5;
		me.game.world.removeChild(this.Clock);
	 }	

});

var GameOverScreen = me.ScreenObject.extend({
	init:function() {
		this.parent(true);
        this.bg = new Image();
        this.bg.src = "data/img/menu.jpg";
        this.loading = new me.Font("Verdana", 20, "black");
	},
	
	draw: function(context) {
		 // draw play button
		 this.loadingtext = "Game Over";
         context.drawImage(this.bg, 0, 0);
         this.play.draw(context,this.loadingtext);
	},
	/*
     * reset function
     */
    onResetEvent: function()
    {
        // play button
        this.play = new Button("menu", me.state.PLAY, false, 80);

        // version
        this.version = new me.Font("Verdana", 20, "black");
    },
    onDestroyEvent: function() {
    	game.data.score = 0;
    }
});

