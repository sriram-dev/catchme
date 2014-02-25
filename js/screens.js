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
        this.bg.src = "data/img/menu.jpg";
        this.loading = new me.Font("Verdana", 20, "white");
	},
	
	draw: function(context) {
		 // draw play button
		 this.loadingtext = "Play";
         context.drawImage(this.bg, 0, 0);
         this.play.draw(context);
	},
	/*
     * reset function
     */
    onResetEvent: function()
    {
        // play button
        this.play = new Button("menu", me.state.PLAY, 200);

        // version
        this.version = new me.Font("Verdana", 20, "white");
    }
});

var PlayScreen = me.ScreenObject.extend({
	 onResetEvent: function()
     {
		// add main player
        me.game.add(new PlayerEntity(10, 30), 10);
		// add bkgrd 
		me.game.add(new BackgroundObject(), 1);
		me.debug.renderHitBox = true;
		//randomly add 5 coins at different locations in screen
		me.game.add(new CoinUpdater(), 1);	 	

		this.HUD = new game.HUD.Container(370,250, false);
		me.game.world.addChild(this.HUD);

		this.Clock = new game.HUD.Container(370,20,true);
		me.game.world.addChild(this.Clock);
		this.interval = setInterval(function() {game.data.clock -= 1;},1000);
		// sort
		me.game.sort();
	 },
	 
	 onDestroyEvent:function() {
		clearInterval(this.interval);
		game.data.clock = 10;		
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
        this.play = new Button("menu", me.state.PLAY, 200);

        // version
        this.version = new me.Font("Verdana", 20, "black");
    },
    onDestroyEvent: function() {
    	game.data.score = 0;
    }
});

