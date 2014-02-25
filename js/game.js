/* game namespace */
var game = {
 
    /** 
     * an object where to store game global data
     */
    data : {
        // score
        score : 0,
        clock :10
    },
     
    // Run on page load.
    "onload" : function () {
 
        // Initialize the video.
        if (!me.video.init("screen", 400, 300, false, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.debug.renderHitBox = true;
      
        // Initialize the audio.
        me.audio.init("mp3,ogg");
 
        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
      
        // Load the resources.
        me.loader.preload(game.resources);
	
		// set the "Loading" Screen Object
        me.state.set(me.state.LOADING, new LoadingScreen());
		
        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
 
 
 
    // Run on game resources loaded.
    "loaded" : function () {
		// set the "Menu" Screen Object
                me.state.set(me.state.MENU, new MenuScreen());

        // set the "Play" Screen Object
                me.state.set(me.state.PLAY, new PlayScreen());

                // set the "Game over" Screen Object
                me.state.set(me.state.GAMEOVER, new GameOverScreen());

                // set a global fading transition for the screen
                me.state.transition("fade", "#FFFFFF", 250);

                // disable transition for MENU and GAMEOVER screen
               // me.state.setTransition(me.state.MENU, false);
               // me.state.setTransition(me.state.GAMEOVER, false);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.UP, "up");
                me.input.bindKey(me.input.KEY.DOWN, "down");
                me.input.bindKey(me.input.KEY.SPACE, "fire", true);

        // draw menu
                me.state.change(me.state.MENU);
    }
};

/**
 * a HUD container and child items
 */
 
game.HUD = game.HUD || {};
 
  
game.HUD.Container = me.ObjectContainer.extend({
 
    init: function(x,y, timer) {
        // call the constructor
        this.parent();
         
        // persistent across level change
        this.isPersistent = true;
         
        // non collidable
        this.collidable = false;
         
        // make sure our object is always draw first
        this.z = Infinity;
 
        // give a name
        this.name = "HUD";
         
        // add our child score object at the right-bottom position
        this.addChild(new game.HUD.ScoreItem(x, y, timer));
    }
});
 
 
/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /** 
     * constructor
     */     
    init: function(x, y, timer) {
        console.log("in init of HUD scoreitem");
         
        // call the parent constructor 
        // (size does not matter here)
        this.parent(new me.Vector2d(x, y), 10, 10); 
         
        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");
         
        // local copy of the global score
        this.score = -1;
 
        // make sure we use screen coordinates
        this.floating = true;

        // set if this is a timer HUD
        this.timer = timer;
    },
     
    /**
     * update function
     */
    update : function () {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        //console.log("in update");
        if(!this.timer) {
            if (this.score !== game.data.score) {
                this.score = game.data.score;
                return true;
            }
        } else {            
            this.score = game.data.clock;
            if(this.score == 0) {
                me.state.change(me.state.GAMEOVER);
            }
            return true;
        }

        return false;
    },
 
    /**
     * draw the score
     */
    draw : function (context) {
        //console.log("drawing score");
        if(!this.timer)
            this.font.draw (context, game.data.score, this.pos.x, this.pos.y);
        else
            this.font.draw (context, game.data.clock, this.pos.x, this.pos.y);
    }
});